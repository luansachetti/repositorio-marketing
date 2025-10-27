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

  // Usa o backend local por padrão
  const base = process.env.BACKEND_URL || "http://localhost:3000";

  const arquivos: {
    id: string;
    nome: string;
    tipo: string | null;
    link: string | null;
    thumb?: string; // agora será a URL do proxy leve
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
        const id = f.id || "";
        const thumbLink = f.thumbnailLink || null;

        // monta proxy leve com o link real
        const thumb =
          thumbLink !== null
            ? `${base}/api/public/thumb?url=${encodeURIComponent(thumbLink)}`
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
