// src/utils/syncMarketingToDB.ts

import { readMarketingDrive } from "./readMarketingDrive.js";
import { run, query } from "./query.js";

export async function syncMarketingToDB() {
  console.log("\n🔄 Iniciando sincronização Marketing → Banco de Dados...\n");

  try {
    // 1. Ler toda a estrutura do Drive (recursivo)
    const tree = await readMarketingDrive();

    console.log(`📊 Estrutura carregada: ${tree.length} categorias principais\n`);

    // 2. Limpar registros antigos
    await run("DELETE FROM materiais_marketing");
    console.log("🗑️  Cache antigo limpo\n");

    // 3. Inserir novo snapshot
    await run(
      "INSERT INTO materiais_marketing (tree_json) VALUES (?)",
      [JSON.stringify(tree)]
    );

    console.log("✅ Sincronização concluída com sucesso!\n");

    // 4. Exibir resumo
    const categorias = tree.map(c => c.name).join(", ");
    console.log(`📁 Categorias disponíveis: ${categorias}\n`);

  } catch (e: any) {
    console.error("❌ Erro na sincronização do Marketing:", e.message);
    throw e;
  }
}

// Permite rodar diretamente com: npm run sync:marketing
if (import.meta.url === `file://${process.argv[1]}`) {
  syncMarketingToDB()
    .then(() => process.exit(0))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}