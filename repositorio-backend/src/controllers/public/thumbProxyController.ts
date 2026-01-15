// src/controllers/public/thumbProxyController.ts

import express from "express";
import axios from "axios";
import { getDriveClient } from "../../utils/driveUtils.js";
import { Readable } from 'stream';

const router = express.Router();

// Define o tamanho da miniatura desejado
const THUMBNAIL_SIZE = 100; 

// Proxy para miniaturas do Google Drive
router.get("/thumb", async (req, res) => {
    const { fileId } = req.query;

    if (!fileId || typeof fileId !== "string") {
        return res.status(400).json({
            sucesso: false,
            mensagem: "ID do arquivo (fileId) da miniatura ausente.",
        });
    }

    try {
        const drive = getDriveClient();

        // PASSO 1: Obter o link da miniatura (thumbnailLink)
        const metadataResponse = await drive.files.get({
            fileId: fileId,
            fields: "thumbnailLink, mimeType" 
        });

        const linkOriginal = metadataResponse.data.thumbnailLink;

        if (!linkOriginal) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Miniatura não disponível para este arquivo.",
            });
        }
        
        // PASSO 2: Manipular o link para definir a resolução desejada
        let linkRedimensionado = linkOriginal;

        if (linkRedimensionado.match(/=s\d+/)) {
            linkRedimensionado = linkRedimensionado.replace(/=s\d+/, `=s${THUMBNAIL_SIZE}`);
        } else {
            linkRedimensionado += `=s${THUMBNAIL_SIZE}`;
        }

        // PASSO 3: FAZER A REQUISIÇÃO DE SERVIDOR PARA SERVIDOR
        const thumbnailResponse = await axios.get(linkRedimensionado, {
            responseType: 'stream'
        });

        // O stream do axios é repassado diretamente para a resposta
        const thumbnailStream = thumbnailResponse.data as Readable;

        // PASSO 4: Repassar os headers e o stream para o cliente (browser)
        const contentType = thumbnailResponse.headers['content-type'] || 'image/jpeg';
        const contentLength = thumbnailResponse.headers['content-length'];

        res.setHeader("Content-Type", contentType);
        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }

        thumbnailStream.pipe(res);

    } catch (error: any) {
        // ... (resto da lógica de erro)
        console.error("Erro ao obter miniatura via Proxy:", error.message);
        const statusCode = error.response?.status || 500;
        
        res.status(statusCode).json({
            sucesso: false,
            mensagem: `Erro ao obter miniatura. Status: ${statusCode}.`,
        });
    }
});

export default router;