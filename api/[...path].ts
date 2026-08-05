// =================================================================
// Entrypoint serverless da Vercel.
//
// O nome do arquivo é um catch-all: a Vercel roteia qualquer /api/*
// para cá SEM precisar de rewrite, e — por ser roteamento nativo e não
// reescrita — req.url chega com o caminho original (/api/chat, etc.).
// É por isso que o Express casa as rotas montadas em '/api' sem
// nenhuma normalização de path.
//
// O app é criado uma vez por instância (fora do handler), então o
// schema do banco roda no cold start e não a cada request.
// =================================================================

import { createApp } from '../server/app.js';

export default createApp();
