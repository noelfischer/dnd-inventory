import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        main: '#a388ee',
        mainAccent: '#9e66ff', // not needed for shadcn components
        secondary: '#7d66ff',
        overlay: 'rgba(0,0,0,0.8)',
        // background color overlay for alert dialogs, modals, etc.

        // light mode
        bg: '#e3dff2',
        text: '#000',
        border: '#000',

        // dark mode
        darkBg: '#1D1F27',
        darkElevatedBg: '#292a32',
        darkText: '#eeefe9',
        darkBorder: '#000',
      },
      borderRadius: {
        base: '5px'
      },
      borderColor: {
        base: '#000',
        dark: '#000',
      },
      boxShadow: {
        light: '2px 2px 0px 0px #000',
        dark: '2px 2px 0px 0px #000',
        none: 'none',
      },
      translate: {
        boxShadowX: '2px',
        boxShadowY: '2px',
        reverseBoxShadowX: '-2px',
        reverseBoxShadowY: '-2px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config