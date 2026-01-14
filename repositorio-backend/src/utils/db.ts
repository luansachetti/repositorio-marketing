// src/utils/db.ts

import path from "path";
import sqlite3 from "sqlite3";
import { createClient, Client } from "@libsql/client";

const isRemote = !!process.env.TURSO_DATABASE_URL;
let db: Client | sqlite3.Database;

// Banco remoto (Turso via libSQL)
if (isRemote) {
  console.log("Conectando ao banco remoto (Turso via libSQL)...");

  db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("Conectado ao Turso (libSQL). Nenhuma criação de tabela local será feita.");

// Banco local (SQLite)
} else {
  const dbPath = path.join(process.cwd(), "data", "repo.db");
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Erro ao conectar ao SQLite:", err.message);
    } else {
      console.log("Conectado ao SQLite local:", dbPath);
    }
  });

  // Criação das tabelas apenas no ambiente local
  (db as sqlite3.Database).serialize(() => {

    // Usuários (mantido para autenticação)
    (db as sqlite3.Database).run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario TEXT UNIQUE NOT NULL,
        nome_exibicao TEXT NOT NULL,
        senha TEXT NOT NULL,
        tipo TEXT CHECK(tipo IN ('admin','filial')) NOT NULL,
        ativo INTEGER DEFAULT 1
      )
    `);

    // Nova tabela unificada de Marketing (substitui promocoes e etiquetas)
    (db as sqlite3.Database).run(`
      CREATE TABLE IF NOT EXISTS materiais_marketing (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        tree_json TEXT NOT NULL,
        data_sync DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Tabelas criadas/verificadas com sucesso!");
  });
}

export default db;
export { isRemote };