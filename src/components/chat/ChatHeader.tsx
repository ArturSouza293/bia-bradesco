import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, MoreVertical, Phone, RotateCcw, Video } from 'lucide-react';
import { BiaAvatar } from '@/components/BiaAvatar';
import { useSessionStore } from '@/store/sessionStore';

interface ChatHeaderProps {
  status: 'online' | 'digitando…';
}

/**
 * Header estilo WhatsApp (claro) — back, avatar, nome + online,
 * ícones de vídeo/chamada e menu.
 */
export function ChatHeader({ status }: ChatHeaderProps) {
  const navigate = useNavigate();
  const reset = useSessionStore((s) => s.reset);
  const [menuOpen, setMenuOpen] = useState(false);

  function restartConversation() {
    if (
      window.confirm(
        'Reiniciar a conversa? As mensagens locais serão apagadas.',
      )
    ) {
      reset();
      navigate('/');
    }
    setMenuOpen(false);
  }

  return (
    <header className="bg-[#F0F2F5] text-gray-900 border-b border-black/5 flex-shrink-0">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <button
          onClick={() => navigate('/')}
          className="p-1 rounded-full hover:bg-black/5 active:bg-black/10 transition text-gray-600"
          aria-label="Voltar"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <BiaAvatar size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[15px] leading-tight">BIA</span>
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          </div>
          <div className="text-[12px] text-gray-500 leading-tight">
            {status}
          </div>
        </div>
        <button
          className="p-1.5 rounded-full text-[#54656F] hover:bg-black/5 transition"
          aria-label="Chamada de vídeo"
        >
          <Video className="h-5 w-5" />
        </button>
        <button
          className="p-1.5 rounded-full text-[#54656F] hover:bg-black/5 transition"
          aria-label="Chamada de voz"
        >
          <Phone className="h-[18px] w-[18px]" />
        </button>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1.5 rounded-full text-[#54656F] hover:bg-black/5 transition"
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
              <div className="absolute right-0 mt-1 z-50 bg-white text-gray-800 rounded-md shadow-lg overflow-hidden min-w-[190px]">
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
    </header>
  );
}
