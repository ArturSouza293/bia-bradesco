import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('');
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = 'auto';
    ref.current.style.height = Math.min(ref.current.scrollHeight, 140) + 'px';
  }, [value]);

  function handleSubmit(e?: FormEvent) {
    e?.preventDefault();
    const t = value.trim();
    if (!t || disabled) return;
    onSend(t);
    setValue('');
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#F0F0F0] border-t border-gray-200 px-3 py-2"
    >
      <div className="flex items-end gap-2">
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          rows={1}
          placeholder={placeholder ?? 'Digite uma mensagem'}
          className="flex-1 resize-none rounded-2xl bg-white border border-gray-200 shadow-sm px-4 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-bradesco-red/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          aria-label="Enviar"
          className="h-11 w-11 rounded-full bg-whatsapp-send text-white flex items-center justify-center shadow-md hover:opacity-95 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <Send className="h-5 w-5 -ml-0.5" />
        </button>
      </div>
    </form>
  );
}
