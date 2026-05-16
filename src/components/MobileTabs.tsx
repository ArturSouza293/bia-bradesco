import { Target, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MobileTabsProps {
  current: 'chat' | 'app';
  onChange: (v: 'chat' | 'app') => void;
  objectivesCount: number;
}

/**
 * Tabs no topo da demo em mobile — alterna entre a conversa com a Bia
 * e a visão "Meus Objetivos". Aparece SÓ em telas < 900px.
 */
export function MobileTabs({
  current,
  onChange,
  objectivesCount,
}: MobileTabsProps) {
  return (
    <div className="w-full max-w-md mx-auto bg-bradesco-ink/95 backdrop-blur px-2 py-1.5 flex gap-1.5 rounded-xl shadow-md">
      <TabButton
        active={current === 'chat'}
        onClick={() => onChange('chat')}
        icon={<MessageCircle className="h-4 w-4" />}
        label="Conversa"
      />
      <TabButton
        active={current === 'app'}
        onClick={() => onChange('app')}
        icon={<Target className="h-4 w-4" />}
        label="Meus Objetivos"
        badge={objectivesCount > 0 ? objectivesCount : undefined}
      />
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  badge?: number;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold transition',
        active
          ? 'bg-bradesco-red text-white shadow-sm'
          : 'text-white/70 hover:text-white hover:bg-white/10',
      )}
    >
      {icon}
      {label}
      {badge != null && (
        <span
          className={cn(
            'ml-0.5 px-1.5 rounded-full text-[10px] leading-4 font-bold',
            active ? 'bg-white/25' : 'bg-white/15',
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}
