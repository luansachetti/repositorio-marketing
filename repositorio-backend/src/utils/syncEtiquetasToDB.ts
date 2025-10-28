// syncEtiquetasToDB.ts

import { run } from "./query.js";
import { getDriveClient } from "./driveUtils.js";

const DRIVE_FOLDER_ETIQUETAS = process.env.DRIVE_FOLDER_ETIQUETAS;

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3000";

console.log("Iniciando sincronização de Etiquetas com o Google Drive...\n");

export async function syncEtiquetasToDB() {
    if (!DRIVE_FOLDER_ETIQUETAS) {
        console.error("Variável ETIQUETAS_ROOT_FOLDER_ID não configurada. Pulando sincronização de etiquetas.");
        return;
    }
    
    const drive = getDriveClient();
    
    try {
        // PASSO 1: Buscar Subpastas
        const categoriasRes = await drive.files.list({
            q: `'${DRIVE_FOLDER_ETIQUETAS}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
            fields: "files(id, name)",
        });

        const categorias = categoriasRes.data.files || [];
        
        // PASSO 2: Limpar a Tabela Antiga
        await run("DELETE FROM etiquetas");
        
        let count = 0;
        
        // PASSO 3: Processar cada subpasta/categoria
        for (const cat of categorias) {
            if (!cat.id || !cat.name) continue;
            
            // Busca o ÚNICO ARQUIVO dentro desta subpasta
            const filesRes = await drive.files.list({
                q: `'${cat.id}' in parents and trashed = false and mimeType != 'application/vnd.google-apps.folder'`,
                fields: "files(id, name)",
                pageSize: 1,
            });

            const arquivo = filesRes.data.files?.[0];

            if (arquivo && arquivo.id && arquivo.name) {
                // Monta o link do proxy de download
                const downloadLink = `${BACKEND_URL}/api/public/download?fileId=${arquivo.id}`;
                
                // PASSO 4: Salvar no DB
                await run(
                    `INSERT INTO etiquetas (nome_categoria, file_id, file_name, link_download) VALUES (?, ?, ?, ?)`,
                    [cat.name, arquivo.id, arquivo.name, downloadLink]
                );
                console.log(`[Etiqueta] Salva: ${cat.name} (${arquivo.name})`);
                count++;
            }
        }
        
        console.log(`Sincronização de Etiquetas concluída com sucesso! (${count} arquivos)`);
        
    } catch (e: any) {
        console.error("Erro na sincronização de Etiquetas:", e.message);
    }
}

// Se o script for rodado diretamente (npm run sync), executa a função
if (process.argv[1].includes('syncEtiquetasToDB.js')) {
    syncEtiquetasToDB();
}