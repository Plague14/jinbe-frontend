/** @type {import('tailwindcss').Config} */

function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`
    }
    return `rgb(var(${variableName}))`
  }
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        jinbe: {
          bg: 'var(--color-jinbe-bg)',
          sidebar: 'var(--color-jinbe-sidebar)',
          border: 'var(--color-jinbe-border)',
          card: 'var(--color-jinbe-card)',
          primary: withOpacity('--jinbe-primary-rgb'),
          text: 'var(--color-jinbe-text)',
          muted: 'var(--color-jinbe-muted)',
          dim: 'var(--color-jinbe-dim)',
          success: withOpacity('--jinbe-success-rgb'),
          danger: withOpacity('--jinbe-danger-rgb'),
          warning: withOpacity('--jinbe-warning-rgb'),
          info: withOpacity('--jinbe-info-rgb'),
          hover: 'var(--color-jinbe-hover)',
          active: 'var(--color-jinbe-active)',
        },
      },
    },
  },
  plugins: [],
}
