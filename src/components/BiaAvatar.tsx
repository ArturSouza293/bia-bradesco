import { cn } from '@/lib/utils';

interface BiaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  ring?: boolean;
}

const sizeMap = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-16 w-16',
  xl: 'h-28 w-28',
};

/**
 * Avatar da Bia — círculo vermelho Bradesco com o ícone de headset
 * (referência: logo oficial da BIA no WhatsApp).
 */
export function BiaAvatar({ size = 'md', className, ring }: BiaAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full overflow-hidden shadow-sm select-none flex-shrink-0',
        ring && 'ring-2 ring-white/40',
        sizeMap[size],
        className,
      )}
      aria-label="Avatar da Bia"
    >
      <svg viewBox="0 0 64 64" className="h-full w-full" role="img">
        <defs>
          <linearGradient id="biaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E11138" />
            <stop offset="100%" stopColor="#A30724" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="32" fill="url(#biaGrad)" />
        {/* headband */}
        <path
          d="M 18 36 L 18 30 A 14 14 0 0 1 46 30 L 46 36"
          fill="none"
          stroke="#fff"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        {/* ear cups */}
        <rect x="13" y="33.5" width="8.2" height="13.5" rx="4.1" fill="#fff" />
        <rect x="42.8" y="33.5" width="8.2" height="13.5" rx="4.1" fill="#fff" />
        {/* mic boom + tip */}
        <path
          d="M 46.9 47 Q 46.9 54.5 35 54.5"
          fill="none"
          stroke="#fff"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <circle cx="31.5" cy="54.5" r="3.1" fill="#fff" />
      </svg>
    </div>
  );
}
