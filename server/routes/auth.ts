// =================================================================
// /api/auth — gate de senha simples para a demo (grupo restrito).
// Default: "vision2026". Pode ser sobrescrita via env DEMO_PASSWORD
// no painel do Railway sem precisar de novo deploy.
// =================================================================

import express from 'express';
import type { Request, Response } from 'express';

export const authRouter = express.Router();

const DEFAULT_PASSWORD = 'vision2026';

authRouter.post('/auth', (req: Request, res: Response) => {
  const password = String((req.body ?? {}).password ?? '');
  const expected =
    process.env.DEMO_PASSWORD?.trim() || DEFAULT_PASSWORD;
  if (password !== expected) {
    res.status(401).json({ ok: false, error: 'Senha incorreta' });
    return;
  }
  res.json({ ok: true });
});
