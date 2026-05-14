interface HomeIndicatorProps {
  variant?: 'dark' | 'light';
}

/**
 * Barra horizontal arredondada na base da tela (iOS).
 * Posicionada absolutamente — páginas adicionam padding-bottom de ~28px
 * para não ficar sob conteúdo importante.
 */
export function HomeIndicator({ variant = 'dark' }: HomeIndicatorProps) {
  return (
    <div
      className="home-indicator"
      aria-hidden
      data-variant={variant}
    />
  );
}
