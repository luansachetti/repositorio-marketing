import db from "./db.js";

console.log("🔍 Sincronizando usuários com base nas promoções...");

// Consulta todas as promoções
db.all<{ usuarios_vinculados: string }>(
  "SELECT usuarios_vinculados FROM promocoes",
  [],
  (err, rows) => {
    if (err) {
      console.error("❌ Erro ao ler promoções:", err.message);
      process.exit(1);
    }

    const set = new Set<string>();

    // 🧠 Extrai todos os nomes únicos de usuários das promoções
    rows.forEach((r) => {
      try {
        const lista = JSON.parse(r.usuarios_vinculados || "[]");

        // Corrige o formato (caso esteja como uma única string com vírgulas)
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
        console.warn("⚠️ Erro ao processar uma linha de usuários_vinculados:", e);
      }
    });

    const filiais = Array.from(set);
    console.log(`📦 ${filiais.length} filiais detectadas no banco:`);

    let inseridas = 0;

    filiais.forEach((filial) => {
      db.get<{ id: number }>(
        "SELECT id FROM usuarios WHERE usuario = ?",
        [filial],
        (err, row) => {
          if (err) return console.error("Erro ao verificar:", err.message);

          if (!row) {
            const nomeExibicao =
              filial.length > 3
                ? filial
                    .replace(/(\d+)/, " $1 - ")
                    .replace("-", " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())
                : filial;

            db.run(
              "INSERT INTO usuarios (usuario, nome_exibicao, senha, tipo, ativo) VALUES (?, ?, ?, ?, 1)",
              [filial, nomeExibicao.trim(), "1234", "filial"],
              (err2) => {
                if (err2) console.error("❌ Erro ao inserir:", err2.message);
                else {
                  inseridas++;
                  console.log(`➕ Inserida: ${filial}`);
                }
              }
            );
          }
        }
      );
    });

    // Dá tempo das inserções terminarem antes de encerrar o processo
    setTimeout(() => {
      console.log(`✅ Inserção concluída (${inseridas} novas filiais adicionadas).`);
      process.exit(0);
    }, 2000);
  }
);
