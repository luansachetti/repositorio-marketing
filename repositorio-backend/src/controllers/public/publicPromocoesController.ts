import { Request, Response } from "express";
import db from "../../utils/db.js";

type Promocao = {
  id: number;
  tipo: string;
  nome: string;
  grupo: string;
  categoria: string;
  id_pasta: string | null;
  usuarios_vinculados: string; // JSON string
  arquivos: string; // JSON string
  ativo: number;
};

// Lista promoções disponíveis para uma filial
export const listarPromocoesPorFilial = (req: Request, res: Response) => {
  const { filial } = req.params;

  if (!filial) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "O nome da filial é obrigatório.",
    });
  }

  const query = `SELECT * FROM promocoes WHERE ativo = 1;`;

  db.all<Promocao>(query, [], (err, rows) => {
    if (err) {
      console.error("Erro ao consultar promoções:", err.message);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno ao buscar promoções.",
      });
    }

    // Filtra promoções que contenham a filial
    const filtradas = rows.filter((p) => {
      try {
        const lista = JSON.parse(p.usuarios_vinculados || "[]");

        // Corrige caso venha como ["a,b,c"]
        const filiais =
          Array.isArray(lista) && lista.length === 1 && typeof lista[0] === "string"
            ? lista[0]
                .split(",")
                .map((f: string) => f.trim().toLowerCase())
            : (lista as string[]).map((f) => f.toLowerCase());

        return Array.isArray(filiais) && filiais.includes(filial.toLowerCase());
      } catch (e) {
        console.error("Erro ao processar usuarios_vinculados:", e);
        return false;
      }
    });

    if (filtradas.length === 0) {
      return res.json({
        sucesso: false,
        mensagem: "Nenhuma promoção disponível para esta filial.",
        promocoes: [],
      });
    }

    res.json({
      sucesso: true,
      total: filtradas.length,
      promocoes: filtradas.map((p) => ({
        id: p.id,
        nome: p.nome,
        grupo: p.grupo,
        categoria: p.categoria,
        arquivos: JSON.parse(p.arquivos || "[]"),
      })),
    });
  });
};
