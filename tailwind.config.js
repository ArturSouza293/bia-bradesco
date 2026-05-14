/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Paleta Bradesco — vermelho como âncora da marca
        bradesco: {
          red: '#CC092F',
          'red-dark': '#A30724',
          'red-darker': '#7D051D',
          'red-light': '#E63950',
          50: '#FCEEF1',
          100: '#F8D6DD',
          // superfícies do "app" (fundo de conteúdo cinza claro)
          surface: '#F3F4F6',
          'surface-2': '#E9EBEF',
          ink: '#1A1D24',
        },
        whatsapp: {
          bg: '#E5DDD5',
          'bg-pattern': '#EFEAE2',
          'bubble-out': '#DCF8C6',
          'bubble-in': '#FFFFFF',
          header: '#F0F2F5',
          send: '#25D366',
          tick: '#34B7F1',
          time: '#667781',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica Neue',
          'sans-serif',
        ],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,23,38,0.06), 0 2px 8px rgba(16,23,38,0.06)',
        'card-hover': '0 2px 4px rgba(16,23,38,0.08), 0 8px 24px rgba(16,23,38,0.10)',
      },
      animation: {
        'typing-dot': 'typing-dot 1.4s infinite ease-in-out',
        'fade-in': 'fade-in 0.25s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'typing-dot': {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-4px)', opacity: '1' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { transform: 'translateY(8px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
