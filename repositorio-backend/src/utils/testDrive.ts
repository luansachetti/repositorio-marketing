import { google } from "googleapis";
import path from "path";

const SERVICE_ACCOUNT_PATH = path.resolve("./config/service-account.json");

async function testarConexaoDrive() {
  console.log("🔍 Testando conexão com o Google Drive...");

  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: ["https://www.googleapis.com/auth/drive.readonly"],
    });

    const drive = google.drive({ version: "v3", auth });

    // tenta listar 5 arquivos do Drive
    const res = await drive.files.list({
      pageSize: 5,
      fields: "files(id, name)",
    });

    console.log("✅ Conexão bem-sucedida!");
    console.log("📄 Arquivos encontrados:");
    res.data.files?.forEach((f) => console.log(`- ${f.name} (${f.id})`));
  } catch (err: any) {
    console.error("❌ Erro ao conectar ao Drive:", err.message);
  }
}

testarConexaoDrive();
