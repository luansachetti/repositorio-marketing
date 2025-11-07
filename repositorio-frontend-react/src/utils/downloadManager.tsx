import { BASE_URL } from "./api";

interface FileToDownload {
    fileId: string; // O ID do arquivo que será usado na query string do backend
    fileName: string; // Nome desejado do arquivo (ex: "FEED_36.png")
}

/**
 * Faz o download sequencial de um único arquivo via API Proxy e o salva no cliente.
 * @param file Objeto contendo o ID do arquivo e o nome desejado.
 * @returns Promise que resolve quando o download for concluído e o link de clique for acionado.
 */
const downloadSingleFile = async (file: FileToDownload): Promise<void> => {
    // URL de download é: /download?fileId=<ID>
    const downloadUrl = `${BASE_URL}/download?fileId=${file.fileId}`;
    
    console.log(`[INÍCIO] Buscando: ${file.fileName}`);

    try {
        // 1. Faz o Fetch do Conteúdo Binário (assíncrono)
        const response = await fetch(downloadUrl, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Erro de rede ou API ao buscar arquivo: ${response.statusText}`);
        }

        // 2. Transforma a resposta em Blob (Buffer de dados do arquivo)
        const blob = await response.blob();

        // 3. Cria um URL temporário para o Blob
        const blobUrl = window.URL.createObjectURL(blob);

        // 4. Cria e simula o clique no link
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', file.fileName); // Define o nome do arquivo
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 5. Libera o Object URL (melhor prática)
        window.URL.revokeObjectURL(blobUrl);

        console.log(`[FIM] Download concluído para: ${file.fileName}`);

    } catch (error) {
        console.error(`Falha fatal ao baixar ${file.fileName}:`, error);
        throw error;
    }
};

/**
 * Inicia o processo de download sequencial de uma lista de arquivos.
 * @param files Array de objetos contendo fileId e fileName.
 */
export const startBulkDownload = async (files: FileToDownload[]): Promise<void> => {
    if (files.length === 0) return;
    
    // Pequeno delay entre downloads para garantir que o navegador processe o evento
    const DELAY_MS = 250; 

    // **IMPORTANTE**: Use uma modal ou confirmação customizada aqui (não o window.confirm)
    if (!window.confirm(`Deseja iniciar o download sequencial de ${files.length} arquivos?`)) {
        return;
    }

    console.log(`Iniciando download sequencial de ${files.length} arquivos.`);
    
    for (const file of files) {
        try {
            await downloadSingleFile(file);
            await new Promise(resolve => setTimeout(resolve, DELAY_MS)); 
        } catch (error) {
            console.error(`Falha ao processar ${file.fileName}. Continuando para o próximo.`, error);
        }
    }

    // Alerta de conclusão (substitua por uma notificação Toast/Modal)
    alert('Download em massa concluído! Verifique sua pasta de Downloads.');
};