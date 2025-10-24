import db, { isRemote } from "./db.js";

export async function query(sql: string, params: any[] = []): Promise<any[]> {
  // 🌐 Se estiver usando Turso (libSQL)
  if (isRemote) {
    const res = await (db as any).execute({
      sql,
      args: params,
    });
    return res.rows;
  }

  // 💾 Se estiver usando SQLite local
  return new Promise((resolve, reject) => {
    (db as any).all(sql, params, (err: any, rows: any[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export async function run(sql: string, params: any[] = []): Promise<void> {
  if (isRemote) {
    await (db as any).execute({
      sql,
      args: params,
    });
    return;
  }

  return new Promise((resolve, reject) => {
    (db as any).run(sql, params, (err: any) => {
      if (err) reject(err);
      else resolve();
    });
  });
}
