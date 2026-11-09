/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F8FC',
        surface: '#FFFFFF',
        'surface-subtle': '#F8FAFC',
        'border-subtle': '#E9ECEF',
        'border-default': '#E2E8F0',
        primary: {
          DEFAULT: '#635BDB',
          hover: '#5249CD',
          light: '#EEEDFE',
          subtle: '#F4F3FF',
        },
        violet: {
          soft: '#A78BFA',
          subtle: '#F3EEFF',
        },
        slate: {
          850: '#151F30',
          900: '#0F172A',
        },
        status: {
          excellent: {
            bg: '#ECFDF5',
            text: '#065F46',
            border: '#A7F3D0',
            dot: '#10B981'
          },
          safe: {
            bg: '#EFF6FF',
            text: '#1E40AF',
            border: '#BFDBFE',
            dot: '#3B82F6'
          },
          warning: {
            bg: '#FFFBEB',
            text: '#92400E',
            border: '#FDE68A',
            dot: '#F59E0B'
          },
          critical: {
            bg: '#FEF2F2',
            text: '#991B1B',
            border: '#FECACA',
            dot: '#EF4444'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '18px',
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03), 0 10px 25px -5px rgba(99, 91, 219, 0.05)',
        'soft-hover': '0 8px 30px rgba(0, 0, 0, 0.06), 0 12px 35px -5px rgba(99, 91, 219, 0.09)',
        'card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 16px -2px rgba(15, 23, 42, 0.03)',
        'glow': '0 0 25px rgba(99, 91, 219, 0.25)',
      }
    },
  },
  plugins: [],
}

