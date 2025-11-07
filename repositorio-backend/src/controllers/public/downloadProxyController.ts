import express from "express";
import { getDriveClient } from "../../utils/driveUtils.js";

const router = express.Router();

// Proxy que usa Service Account para obter o conteúdo binário e forçar o download
router.get("/download", async (req, res) => {
    // 1. Pega o ID do arquivo na query string
    const { fileId } = req.query;

    if (!fileId || typeof fileId !== "string") {
        return res.status(400).json({
            sucesso: false,
            mensagem: "ID do arquivo (fileId) ausente.",
        });
    }

    try {
        const drive = getDriveClient();

        // 2. Pega os metadados do arquivo (necessário para o nome e MIME type)
        const metadataResponse = await drive.files.get({
            fileId: fileId,
            fields: 'name, mimeType' // Pede apenas nome e tipo
        });
        
        const fileName = metadataResponse.data.name || 'arquivo_desconhecido';
        const mimeType = metadataResponse.data.mimeType || 'application/octet-stream';

        // 3. Pega o conteúdo binário do arquivo como stream
        const fileContentResponse = await drive.files.get({
            fileId: fileId,
            alt: 'media',
        }, { 
            responseType: 'stream'
        });

        // 4. Define os cabeçalhos para forçar o download
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // 5. Envia o stream de volta para o cliente
        fileContentResponse.data.pipe(res);

    } catch (error: any) {

        let logMessage = `Falha ao buscar arquivo ${fileId}: ${error.message}`;
        if (error.code) logMessage += ` | Code: ${error.code}`;
        if (error.status) logMessage += ` | Status: ${error.status}`;

        console.error(logMessage);

        const statusCode = error.status && error.status < 500 ? error.status : 500;

        res.status(statusCode).json({
            sucesso: false,
            mensagem: `Erro ao buscar arquivo. Verifique se o ID está correto e se as permissões foram concedidas. (Status do Erro: ${statusCode})`,
        });
    }
});

export default router;