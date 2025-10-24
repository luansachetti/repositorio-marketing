import { google, drive_v3 } from "googleapis";
import path from "path";

const SERVICE_ACCOUNT_PATH = path.resolve("./config/service-account.json");

function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_PATH,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });
  return google.drive({ version: "v3", auth });
}

// Lista arquivos de uma pasta (sem baixar binários)
export async function listarArquivosDrive(folderId: string) {
  const drive = getDriveClient();
  const base = process.env.BACKEND_URL || "https://SEU_BACKEND.koyeb.app";
  const arquivos: {
    id: string;
    nome: string;
    tipo: string | null;
    link: string | null;
    // mantém a mesma chave que o front já usa:
    thumb?: string; // agora será uma URL do proxy
  }[] = [];

  try {
    let pageToken: string | undefined;

    do {
      const res: drive_v3.Schema$FileList = (
        await drive.files.list({
          q: `'${folderId}' in parents and trashed = false`,
          fields:
            "nextPageToken, files(id, name, mimeType, webViewLink, thumbnailLink)",
          pageSize: 1000,
          pageToken,
        })
      ).data;

      for (const f of res.files || []) {
        // NÃO baixa mais nada aqui; só prepara o link do proxy
        const id = f.id || "";
        const thumb = id ? `${base}/api/public/thumb/${id}` : undefined;

        arquivos.push({
          id,
          nome: f.name || "",
          tipo: f.mimeType || null,
          link: f.webViewLink || null,
          thumb, // ← o front vai usar <img src={thumb} />
        });
      }

      pageToken = res.nextPageToken || undefined;
    } while (pageToken);
  } catch (err: any) {
    console.error(`Erro ao listar arquivos da pasta ${folderId}:`, err.message);
  }

  return arquivos;
}
