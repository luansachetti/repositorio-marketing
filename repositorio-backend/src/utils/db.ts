import sqlite3 from "sqlite3";
import path from "path";

// Caminho do banco na pasta /data
const dbPath = path.join(process.cwd(), "data", "repo.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Erro ao conectar ao SQLite:", err.message);
  } else {
    console.log("Conectado ao SQLite:", dbPath);
  }
});

// Criação das tabelas (estrutura completa)
db.serialize(() => {
  // Tabela de usuários
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario TEXT UNIQUE NOT NULL,
      nome_exibicao TEXT NOT NULL,
      senha TEXT NOT NULL,
      tipo TEXT CHECK(tipo IN ('admin','filial')) NOT NULL,
      ativo INTEGER DEFAULT 1
    )
  `);

  // Tabela de promoções
  db.run(`
    CREATE TABLE IF NOT EXISTS promocoes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT,
      nome TEXT,
      grupo TEXT,
      categoria TEXT,
      id_pasta TEXT,
      usuarios_vinculados TEXT, -- JSON string (ex: ["apiuna01","timbo02"])
      arquivos TEXT,            -- JSON string (ex: [{"nome":"...","link":"..."}])
      ativo INTEGER DEFAULT 1
    )
  `);

  // Tabela de etiquetas (mesma estrutura)
  db.run(`
    CREATE TABLE IF NOT EXISTS etiquetas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT,
      nome TEXT,
      grupo TEXT,
      categoria TEXT,
      id_pasta TEXT,
      usuarios_vinculados TEXT,
      arquivos TEXT,
      ativo INTEGER DEFAULT 1
    )
  `);
});

export default db;
