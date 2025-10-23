import db from "./db.js";

const usuarios = [
  {
    usuario: "admin",
    nome_exibicao: "Administrador",
    senha: "1234",
    tipo: "admin",
  },
  {
    usuario: "apiuna01",
    nome_exibicao: "01 - Apiúna 01",
    senha: "1234",
    tipo: "filial",
  },
];

usuarios.forEach((u) => {
  db.run(
    `INSERT OR IGNORE INTO usuarios 
     (usuario, nome_exibicao, senha, tipo, ativo)
     VALUES (?, ?, ?, ?, 1)`,
    [u.usuario, u.nome_exibicao, u.senha, u.tipo],
    (err) => {
      if (err) console.error("❌ Erro ao inserir:", err.message);
      else console.log(`✅ Usuário ${u.usuario} inserido`);
    }
  );
});
