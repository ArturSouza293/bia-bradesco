import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StatusBarProps {
  variant?: 'dark' | 'light';
  className?: string;
}

/**
 * Status bar fake do iOS — relógio à esquerda, sinal/wifi/bateria à direita.
 * Fica logo abaixo da Dynamic Island.
 */
export function StatusBar({ variant = 'dark', className }: StatusBarProps) {
  const time = useClock();
  const color = variant === 'dark' ? 'text-gray-900' : 'text-white';

  return (
    <div
      className={cn(
        'status-bar',
        color,
        className,
      )}
      aria-hidden
    >
      <div className="status-bar-time">{time}</div>
      <div className="status-bar-right">
        <SignalBars variant={variant} />
        <WifiIcon variant={variant} />
        <BatteryIcon variant={variant} />
      </div>
    </div>
  );
}

function useClock() {
  const [time, setTime] = useState(() => formatTime());
  useEffect(() => {
    const id = setInterval(() => setTime(formatTime()), 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

function formatTime(): string {
  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

function SignalBars({ variant }: { variant: 'dark' | 'light' }) {
  const fill = variant === 'dark' ? '#111' : '#fff';
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
      <rect x="0" y="7" width="3" height="4" rx="0.6" fill={fill} />
      <rect x="4.5" y="5" width="3" height="6" rx="0.6" fill={fill} />
      <rect x="9" y="3" width="3" height="8" rx="0.6" fill={fill} />
      <rect x="13.5" y="0.5" width="3" height="10.5" rx="0.6" fill={fill} />
    </svg>
  );
}

function WifiIcon({ variant }: { variant: 'dark' | 'light' }) {
  const stroke = variant === 'dark' ? '#111' : '#fff';
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <path
        d="M1 3.5a11 11 0 0 1 14 0"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M3.5 6a7 7 0 0 1 9 0"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M5.8 8.3a3.6 3.6 0 0 1 4.4 0"
        stroke={stroke}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="8" cy="10.2" r="0.9" fill={stroke} />
    </svg>
  );
}

function BatteryIcon({ variant }: { variant: 'dark' | 'light' }) {
  const stroke = variant === 'dark' ? '#111' : '#fff';
  const fill = variant === 'dark' ? '#111' : '#fff';
  return (
    <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
      <rect
        x="0.5"
        y="0.5"
        width="22"
        height="11"
        rx="2.8"
        stroke={stroke}
        strokeOpacity="0.45"
        fill="none"
      />
      <rect x="2.4" y="2.4" width="15.2" height="7.2" rx="1.4" fill={fill} />
      <rect x="23.5" y="4" width="2" height="4" rx="1" fill={stroke} fillOpacity="0.45" />
    </svg>
  );
}
