// =================================================================
// O Express 4 não captura rejeição de handler assíncrono: um await que
// falha vira unhandled rejection e derruba o processo — em serverless,
// isso é um FUNCTION_INVOCATION_FAILED sem resposta nenhuma.
//
// Desde que o store virou assíncrono (libSQL), todo handler pode
// rejeitar. Este wrapper encaminha o erro para o middleware de erro.
// =================================================================

import type { NextFunction, Request, RequestHandler, Response } from 'express';

export function asyncRoute(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
