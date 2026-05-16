import { useState } from 'react';
import { BiaAvatar } from './BiaAvatar';

const AUTH_KEY = 'bia-bradesco-auth-v1';

interface PasswordGateProps {
  children: React.ReactNode;
}

/**
 * Gate de senha para a demo (grupo restrito).
 * Valida via POST /api/auth e guarda flag em localStorage.
 * Senha default: "vision2026" (sobrescrita por DEMO_PASSWORD no env).
 */
export function PasswordGate({ children }: PasswordGateProps) {
  const [authed, setAuthed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === 'ok';
    } catch {
      return false;
    }
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (authed) return <>{children}</>;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError('Senha incorreta.');
        return;
      }
      try {
        localStorage.setItem(AUTH_KEY, 'ok');
      } catch {
        // localStorage indisponível (modo anônimo etc.) — segue só na sessão atual
      }
      setAuthed(true);
    } catch {
      setError('Não foi possível validar agora. Tenta de novo?');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="phone-stage">
      <div className="bg-white rounded-2xl shadow-card p-7 max-w-sm w-full mx-3">
        <div className="flex justify-center mb-3">
          <BiaAvatar size="lg" />
        </div>
        <h1 className="text-center text-bradesco-ink text-xl font-bold">
          Bia · Bradesco
        </h1>
        <p className="text-center text-gray-500 text-sm mt-1 mb-5">
          Demonstração restrita. Digite a senha para entrar.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            autoFocus
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-bradesco-red focus:ring-1 focus:ring-bradesco-red outline-none text-base"
          />
          {error && (
            <div className="text-sm text-bradesco-red bg-bradesco-50 border border-bradesco-100 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className="w-full bg-bradesco-red hover:bg-bradesco-red-dark active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base py-3 rounded-xl shadow-card transition"
          >
            {loading ? 'Validando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
