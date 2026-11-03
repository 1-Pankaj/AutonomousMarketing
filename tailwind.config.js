/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#18191D',
        dock: '#1C1D22',
        surface: {
          DEFAULT: '#202227',
          card: '#202227',
          sub: '#15161A',
          hover: '#25272F',
        },
        border: {
          DEFAULT: '#2E313A',
          subtle: '#2A2D35',
        },
        lime: {
          DEFAULT: '#D2F83D',
          hover: '#c3e82e',
        },
        cobalt: {
          DEFAULT: '#3B66F5',
          hover: '#2e55dc',
          subtle: '#1B202E',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#8A8F9E',
          muted: '#656A78',
        },
        status: {
          critical: '#FF5C5C',
          warning: '#FFB020',
          healthy: '#3B66F5',
          success: '#06D6A0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '28px',
        'sub': '22px',
        'pill': '9999px',
        'dock': '34px',
      }
    },
  },
  plugins: [],
}
