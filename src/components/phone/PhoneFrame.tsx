import { ReactNode } from 'react';
import { HomeIndicator } from './HomeIndicator';
import { DynamicIsland } from './DynamicIsland';

interface PhoneFrameProps {
  children: ReactNode;
}

/**
 * Mockup de iPhone 17 Pro Max.
 * - Desktop/tablet (≥ md): frame visível, tela 430×932, fundo gradiente ao redor
 * - Mobile (< md): vira fullscreen sem frame — usuário já está no celular
 */
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="phone-page">
      {/* Marca d'água sutil só no desktop */}
      <div className="hidden md:block phone-watermark">
        <div className="text-xs text-white/60 tracking-wider uppercase font-medium">
          Bradesco · Demonstração
        </div>
        <div className="text-[10px] text-white/40 mt-0.5">
          iPhone 17 Pro Max · 6.9"
        </div>
      </div>

      <div className="phone-shell">
        <div className="phone-bezel">
          <div className="phone-screen">
            <DynamicIsland />
            {children}
            <HomeIndicator />
          </div>
          {/* Botões laterais (decorativo) */}
          <span className="phone-btn phone-btn-mute" aria-hidden />
          <span className="phone-btn phone-btn-vol-up" aria-hidden />
          <span className="phone-btn phone-btn-vol-down" aria-hidden />
          <span className="phone-btn phone-btn-action" aria-hidden />
          <span className="phone-btn phone-btn-power" aria-hidden />
        </div>
      </div>
    </div>
  );
}
