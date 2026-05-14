import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BadgeCheck, MoreVertical, RotateCcw } from 'lucide-react';
import { BiaAvatar } from '@/components/BiaAvatar';
import { useSessionStore } from '@/store/sessionStore';

interface ChatHeaderProps {
  status: 'online' | 'digitando…';
}

export function ChatHeader({ status }: ChatHeaderProps) {
  const navigate = useNavigate();
  const reset = useSessionStore((s) => s.reset);
  const [menuOpen, setMenuOpen] = useState(false);

  function restartConversation() {
    if (
      window.confirm(
        'Reiniciar a conversa? Suas mensagens locais serão apagadas (a sessão atual fica registrada no banco).',
      )
    ) {
      reset();
      navigate('/');
    }
    setMenuOpen(false);
  }

  return (
    <header className="text-white shadow-sm">
      <div className="flex items-center gap-3 px-3 py-2">
        <button
          onClick={() => navigate('/')}
          className="p-1.5 rounded-full hover:bg-white/15 active:bg-white/25 transition"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <BiaAvatar size="md" className="ring-2 ring-white/30" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[15px] leading-tight">Bia</span>
            <BadgeCheck
              className="h-4 w-4 text-blue-300"
              fill="currentColor"
              stroke="white"
            />
            <span className="text-white/80 text-[13px] leading-tight">
              | Bradesco
            </span>
          </div>
          <div className="text-[12px] text-white/80 leading-tight">{status}</div>
        </div>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-full hover:bg-white/15 active:bg-white/25 transition"
            aria-label="Menu"
          >
            <MoreVertical className="h-5 w-5" />
          </button>
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMenuOpen(false)}
                aria-hidden
              />
              <div className="absolute right-0 mt-1 z-50 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden min-w-[200px]">
                <button
                  onClick={restartConversation}
                  className="w-full text-left px-3 py-2.5 text-sm hover:bg-gray-100 flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reiniciar conversa
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="bg-yellow-100/95 text-yellow-900 text-[11px] text-center py-1 border-t border-yellow-200/80">
        🟡 Demonstração — não é o atendimento oficial do Bradesco
      </div>
    </header>
  );
}
