import db from "./db.js";
import { listarArquivosDrive } from "./driveUtils.js";

// URL base do backend (ajusta pro domínio do Render depois)
const BACKEND_BASE = process.env.BACKEND_URL || "http://localhost:3000";

// Sincroniza as promoções com o Google Drive
async function syncDriveToDB() {
  console.log("Iniciando sincronização com o Google Drive...\n");

  // Busca todas as promoções ativas com id_pasta
  const promocoes = await new Promise<any[]>((resolve, reject) => {
    db.all(
      "SELECT id, nome, categoria, id_pasta FROM promocoes WHERE ativo = 1 AND id_pasta IS NOT NULL",
      [],
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });

  if (promocoes.length === 0) {
    console.log("Nenhuma promoção com ID de pasta encontrada.");
    return;
  }

  for (const promo of promocoes) {
    if (!promo.id_pasta) continue;

    console.log(`${promo.nome} → ${promo.categoria}`);
    console.log(`   Pasta ID: ${promo.id_pasta}`);

    const arquivosOriginais = await listarArquivosDrive(promo.id_pasta);
    console.log(`${arquivosOriginais.length} arquivos encontrados.\n`);

    // Cria nova lista de arquivos com proxy no campo "thumb"
    const arquivos = arquivosOriginais.map((f) => ({
      id: f.id || "",
      nome: f.nome || "",
      tipo: f.tipo || null,
      link: f.link || null,
      thumb: f.thumb || undefined,
    }));

    // Atualiza o campo arquivos no banco
    await new Promise<void>((resolve, reject) => {
      db.run(
        `UPDATE promocoes SET arquivos = ? WHERE id = ?`,
        [JSON.stringify(arquivos), promo.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  console.log("Sincronização concluída com sucesso!");
}

// Executa o script
syncDriveToDB().catch((e) => console.error("Erro geral:", e));
