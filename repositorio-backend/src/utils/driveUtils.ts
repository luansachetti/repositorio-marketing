import { google, drive_v3 } from "googleapis";

// const SERVICE_ACCOUNT_PATH = path.resolve("./config/service-account.json");

const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

function getDriveClient() {
  // 2. Verifica se a credencial existe
  if (!GOOGLE_PRIVATE_KEY) {
    throw new Error("Credenciais do Google Drive não encontradas nas variáveis de ambiente!");
  }

  // 3. Converte a string JSON em objeto
  let credentials;
  try {
    credentials = JSON.parse(GOOGLE_PRIVATE_KEY); 
    if (credentials.private_key) {
      credentials.private_key = credentials.private_key.replace(/\\n/g, '\n')
    }
  } catch (e) {
    console.error("Erro ao fazer parse do JSON de credenciais do Google Drive.");
    throw e;
  }

  // 4. Autentica usando as credenciais
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
