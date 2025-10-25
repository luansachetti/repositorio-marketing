import express from "express";
import axios from "axios";

const router = express.Router();

// Proxy leve e seguro para miniaturas do Google Drive
router.get("/thumb", async (req, res) => {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      sucesso: false,
      mensagem: "URL da miniatura ausente.",
    });
  }

  try {
    // Faz o download via streaming
    const response = await axios.get(url, { responseType: "stream" });

    // Define o tipo da imagem
    res.setHeader("Content-Type", "image/jpeg");

    // Envia os bytes diretamente para o cliente
    (response.data as any).pipe(res);
  } catch (error: any) {
    console.error("Erro ao obter miniatura:", error.message);
    res.status(404).json({
      sucesso: false,
      mensagem: "Miniatura não encontrada ou acesso negado.",
    });
  }
});

export default router;
