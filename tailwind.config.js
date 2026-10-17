/** Pizza-parlour design tokens (palette + type chosen with the UI/UX Pro Max skill) */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        dough:  { DEFAULT: '#FFF4DE', 50: '#FFFAF0', 100: '#FFF4DE', 200: '#FDE6B9' },
        crust:  { DEFAULT: '#C98A3E', light: '#E9B872', dark: '#8A4B1F' },
        tomato: { DEFAULT: '#D32F1E', dark: '#A82216', light: '#F26B57' },
        basil:  { DEFAULT: '#2E7D32', dark: '#1F5A24' },
        cheese: { DEFAULT: '#F7B733', light: '#FDD878' },
        oven:   { DEFAULT: '#2B140D', soft: '#43251A' },
        ink:    '#3B1F14',
        muted:  '#7A5A48',
      },
      fontFamily: {
        display: ['"Playfair Display Variable"', 'Georgia', 'serif'],
        body: ['"Karla Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        hand: ['"Caveat Variable"', 'cursive'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(138,75,31,.08), 0 8px 24px -8px rgba(138,75,31,.25)',
        pop: '0 4px 0 #8f1d12',
        player: '0 -8px 40px -8px rgba(43,20,13,.45)',
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(0) scale(.8)', opacity: '0' },
          '15%': { opacity: '.9' },
          '100%': { transform: 'translateY(-110vh) scale(1.1)', opacity: '0' },
        },
        eq: { '0%,100%': { height: '25%' }, '50%': { height: '100%' } },
        spinSlow: { to: { transform: 'rotate(360deg)' } },
        pop: { '0%': { transform: 'scale(1)' }, '40%': { transform: 'scale(1.35)' }, '100%': { transform: 'scale(1)' } },
      },
      animation: {
        floatUp: 'floatUp 12s linear infinite',
        eq: 'eq 900ms ease-in-out infinite',
        spinSlow: 'spinSlow 16s linear infinite',
        pop: 'pop 350ms ease-out',
      },
    },
  },
  plugins: [],
}
