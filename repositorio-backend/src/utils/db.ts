// src/utils/db.ts
import path from "path";
import sqlite3 from "sqlite3";
import { createClient, Client } from "@libsql/client";

const isRemote = !!process.env.TURSO_DATABASE_URL;
let db: Client | sqlite3.Database;

// 🔹 Banco remoto (Turso via libSQL)
if (isRemote) {
  console.log("🌐 Conectando ao banco remoto (Turso via libSQL)...");

  db = createClient({
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  console.log("✅ Conectado ao Turso (libSQL). Nenhuma criação de tabela local será feita.");

// 🔹 Banco local (SQLite)
} else {
  const dbPath = path.join(process.cwd(), "data", "repo.db");
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("❌ Erro ao conectar ao SQLite:", err.message);
    } else {
      console.log("💾 Conectado ao SQLite local:", dbPath);
    }
  });

  // Criação das tabelas apenas no ambiente local
  (db as sqlite3.Database).serialize(() => {
    // Usuários
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

    // Promoções
    (db as sqlite3.Database).run(`
      CREATE TABLE IF NOT EXISTS promocoes (
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

    // Etiquetas
    (db as sqlite3.Database).run(`
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
}

export default db;
export { isRemote };
