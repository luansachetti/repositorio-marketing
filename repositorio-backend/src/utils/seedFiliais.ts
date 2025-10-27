import { query, run } from "./query.js";

console.log("Sincronizando usuários com base nas promoções...");

async function syncUsuarios() {
  try {
    // Consulta todas as promoções
    const promocoes = await query("SELECT usuarios_vinculados FROM promocoes");

    const set = new Set<string>();

    // Extrai nomes únicos de usuários das promoções
    for (const r of promocoes) {
      try {
        const lista = JSON.parse(r.usuarios_vinculados || "[]");

        if (Array.isArray(lista)) {
          lista.forEach((entrada: string) => {
            entrada
              .split(",")
              .map((n) => n.trim().toLowerCase())
              .filter((n) => n && n !== "admin")
              .forEach((n) => set.add(n));
          });
        }
      } catch (e) {
        console.warn("Erro ao processar uma linha de usuarios_vinculados:", e);
      }
    }

    const filiais = Array.from(set);
    console.log(`${filiais.length} filiais detectadas no banco:`);

    let inseridas = 0;

    // Verifica e insere novas filiais
    for (const filial of filiais) {
      const existentes = await query(
        "SELECT id FROM usuarios WHERE usuario = ?",
        [filial]
      );

      if (existentes.length === 0) {
        const nomeExibicao =
          filial.length > 3
            ? filial
                .replace(/(\d+)/, " $1 - ")
                .replace("-", " ")
                .replace(/\b\w/g, (l) => l.toUpperCase())
            : filial;

        try {
          await run(
            "INSERT INTO usuarios (usuario, nome_exibicao, senha, tipo, ativo) VALUES (?, ?, ?, ?, 1)",
            [filial, nomeExibicao.trim(), "1234", "filial"]
          );
          inseridas++;
          console.log(`Inserida: ${filial}`);
        } catch (err: any) {
          console.error("Erro ao inserir:", err.message);
        }
      }
    }

    console.log(`Inserção concluída (${inseridas} novas filiais adicionadas).`);
  } catch (err: any) {
    console.error("Erro ao ler promoções:", err.message);
    process.exit(1);
  }
}

syncUsuarios();
