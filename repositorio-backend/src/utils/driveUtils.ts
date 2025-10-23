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

// 📦 Lista arquivos de uma pasta + baixa thumbs
export async function listarArquivosDrive(folderId: string) {
  const drive = getDriveClient();
  const arquivos: {
    id: string;
    nome: string;
    tipo: string | null;
    link: string | null;
    thumb_base64?: string;
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
        let thumb_base64: string | undefined = undefined;

        try {
          if (f.id) {
            const result = await drive.files.get(
              { fileId: f.id, alt: "media" },
              { responseType: "arraybuffer" }
            );

            // 🔥 converte o binário em base64
            thumb_base64 = Buffer.from(result.data as ArrayBuffer).toString("base64");
          }
        } catch (thumbErr: any) {
          console.warn(`⚠️ Falha ao obter thumb de ${f.name}:`, thumbErr.message);
        }

        arquivos.push({
          id: f.id || "",
          nome: f.name || "",
          tipo: f.mimeType || null,
          link: f.webViewLink || null,
          thumb_base64,
        });
      }

      pageToken = res.nextPageToken || undefined;
    } while (pageToken);
  } catch (err: any) {
    console.error(`❌ Erro ao listar arquivos da pasta ${folderId}:`, err.message);
  }

  return arquivos;
}
