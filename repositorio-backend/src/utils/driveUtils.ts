import { google, drive_v3 } from "googleapis";
import { Buffer } from "buffer";

const BASE64_STRING = process.env.GOOGLE_CREDENTIALS_BASE64;

// FUNÇÃO DE AUTENTICAÇÃO
function getDriveClient() {
    if (!BASE64_STRING) {
        throw new Error("Credenciais do Google Drive (Base64) não encontradas!");
    }

    let credentials;
    try {
        // Decodifica a string Base64 de volta para JSON
        const jsonString = Buffer.from(BASE64_STRING, 'base64').toString('utf8');
        
        // Converte a string JSON para objeto
        credentials = JSON.parse(jsonString);
        
    } catch (e) {
        console.error("Erro fatal na decodificação ou parsing do JSON de credenciais.");
        throw e;
    }

    // A GoogleAuth recebe o objeto completo
    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });
    
    return google.drive({ version: "v3", auth });
}

// Lista arquivos de uma pasta (sem baixar binários)
export async function listarArquivosDrive(folderId: string) {
    const drive = getDriveClient();

    // Usa o backend local por padrão
    const base = process.env.BACKEND_URL || "http://localhost:3000";

    const arquivos: {
        id: string;
        nome: string;
        tipo: string | null;
        link: string | null;
        thumb?: string;
    }[] = [];

    try {
        let pageToken: string | undefined;

        do {
            const res: drive_v3.Schema$FileList = (
                await drive.files.list({
                    q: `'${folderId}' in parents and trashed = false`,
                    fields: "nextPageToken, files(id, name, mimeType, webViewLink)",
                    pageSize: 1000,
                    pageToken,
                })
            ).data;

            for (const f of res.files || []) {
                const id = f.id || "";
                const thumb = id
                    ? `${base}/api/public/thumb?fileId=${id}` 
                    : undefined;

                arquivos.push({
                    id,
                    nome: f.name || "",
                    tipo: f.mimeType || null,
                    link: f.webViewLink || null,
                    thumb,
                });
            }

            pageToken = res.nextPageToken || undefined;
        } while (pageToken);
    } catch (err: any) {
        console.error(`Erro ao listar arquivos da pasta ${folderId}:`, err.message);
    }

    return arquivos;
}

export { getDriveClient };