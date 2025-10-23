import { Request, Response } from "express";
import db from "../../utils/db.js";

type Usuario = {
  id: number;
  usuario: string;
  nome_exibicao: string;
  tipo: "admin" | "filial";
  ativo: number;
};

// 🔐 Controlador de login público
export const publicLogin = (req: Request, res: Response) => {
  const { usuario, senha } = req.body;

  if (!usuario || !senha) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Usuário e senha são obrigatórios.",
    });
  }

  const query = `
    SELECT id, usuario, nome_exibicao, tipo, ativo
    FROM usuarios
    WHERE usuario = ? AND senha = ?;
  `;

  db.get<Usuario>(query, [usuario.toLowerCase(), senha], (err: Error | null, row: Usuario | undefined) => {
    if (err) {
      console.error("❌ Erro ao consultar banco:", err.message);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno no servidor.",
      });
    }

    if (!row) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Usuário ou senha incorretos.",
      });
    }

    if (row.ativo !== 1) {
      return res.status(403).json({
        sucesso: false,
        mensagem: "Usuário inativo. Contate o administrador.",
      });
    }

    res.json({
      sucesso: true,
      usuario: row,
    });
  });
};
