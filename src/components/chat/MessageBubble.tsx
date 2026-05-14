import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, CheckCheck } from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import type { UIMessage } from '@/store/sessionStore';

interface MessageBubbleProps {
  message: UIMessage;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const time = formatTime(message.created_at);

  return (
    <div
      className={cn(
        'flex w-full mb-1.5 animate-fade-in',
        isUser ? 'justify-end' : 'justify-start',
      )}
    >
      <div
        className={cn(
          'relative max-w-[78%] rounded-lg px-3 py-2 text-[15px] shadow-sm bubble-md',
          isUser
            ? 'bg-[#DCF8C6] rounded-tr-sm'
            : 'bg-white rounded-tl-sm',
        )}
      >
        {message.content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        ) : (
          <span className="opacity-50 italic text-sm">…</span>
        )}
        <div className="flex items-center justify-end gap-1 mt-0.5 -mb-0.5 text-[10px] text-gray-500">
          <span>{time}</span>
          {isUser &&
            (message.pending ? (
              <Check className="h-3 w-3" />
            ) : (
              <CheckCheck className="h-3 w-3 text-whatsapp-tick" />
            ))}
        </div>
      </div>
    </div>
  );
}
