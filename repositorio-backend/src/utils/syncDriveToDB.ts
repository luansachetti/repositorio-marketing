import { query, run } from "./query.js";
import { listarArquivosDrive } from "./driveUtils.js";

console.log("Iniciando sincronização com o Google Drive...\n");

async function syncDriveToDB() {
  try {
    // 🔹 Busca promoções com ID de pasta
    const promocoes = await query(
      "SELECT id, nome, categoria, id_pasta FROM promocoes WHERE ativo = 1 AND id_pasta IS NOT NULL"
    );

    if (promocoes.length === 0) {
      console.log("Nenhuma promoção com ID de pasta encontrada.");
      return;
    }

    // 🔹 Percorre cada promoção
    for (const promo of promocoes) {
      if (!promo.id_pasta) continue;

      console.log(`${promo.nome} → ${promo.categoria}`);
      console.log(`   Pasta ID: ${promo.id_pasta}`);

      const arquivosOriginais = await listarArquivosDrive(promo.id_pasta);
      console.log(`${arquivosOriginais.length} arquivos encontrados.\n`);

      // 🔹 Cria nova lista de arquivos com proxy no campo "thumb"
      const arquivos = arquivosOriginais.map((f) => ({
        id: f.id || "",
        nome: f.nome || "",
        tipo: f.tipo || null,
        link: f.link || null,
        thumb: f.thumb || undefined,
      }));

      // 🔹 Atualiza o campo arquivos no banco
      await run("UPDATE promocoes SET arquivos = ? WHERE id = ?", [
        JSON.stringify(arquivos),
        promo.id,
      ]);
    }

    console.log("✅ Sincronização concluída com sucesso!");
  } catch (e: any) {
    console.error("❌ Erro geral na sincronização:", e.message);
  }
}

syncDriveToDB();
