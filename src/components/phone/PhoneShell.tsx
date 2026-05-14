import { ReactNode } from 'react';
import { HomeIndicator } from './HomeIndicator';
import { DynamicIsland } from './DynamicIsland';

interface PhoneShellProps {
  children: ReactNode;
  /** Legenda acima do aparelho — usada no modo "dois iPhones". */
  label?: string;
  homeVariant?: 'dark' | 'light';
}

/**
 * Um aparelho iPhone 17 Pro Max. Pode ser usado sozinho ou aos pares
 * (chat + app "Meus Objetivos" lado a lado no desktop).
 */
export function PhoneShell({
  children,
  label,
  homeVariant = 'dark',
}: PhoneShellProps) {
  return (
    <div className="phone-bezel">
      {label ? <div className="phone-label">{label}</div> : null}
      <div className="phone-screen">
        <DynamicIsland />
        {children}
        <HomeIndicator variant={homeVariant} />
      </div>
      {/* Botões laterais (decorativos, só desktop) */}
      <span className="phone-btn phone-btn-mute" aria-hidden />
      <span className="phone-btn phone-btn-vol-up" aria-hidden />
      <span className="phone-btn phone-btn-vol-down" aria-hidden />
      <span className="phone-btn phone-btn-action" aria-hidden />
      <span className="phone-btn phone-btn-power" aria-hidden />
    </div>
  );
}
