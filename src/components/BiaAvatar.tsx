import { cn } from '@/lib/utils';

interface BiaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-2xl',
  xl: 'h-28 w-28 text-5xl',
};

export function BiaAvatar({ size = 'md', className }: BiaAvatarProps) {
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white shadow-sm select-none',
        'bg-gradient-to-br from-bradesco-red to-bradesco-red-dark',
        sizeMap[size],
        className,
      )}
      aria-label="Avatar da Bia"
    >
      <span>Bia</span>
    </div>
  );
}
