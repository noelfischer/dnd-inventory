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
        overlay: 'rgba(0,0,0,0.8)',
        // background color overlay for alert dialogs, modals, etc.

        // light mode
        bg: '#e3dff2',
        text: '#000',
        border: '#000',

        // dark mode
        darkBg: '#1D1F27',
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
        light: '4px 4px 0px 0px #000',
        dark: '4px 4px 0px 0px #000',
      },
      translate: {
        boxShadowX: '4px',
        boxShadowY: '4px',
        reverseBoxShadowX: '-4px',
        reverseBoxShadowY: '-4px',
      },
      fontWeight: {
        base: '500',
        heading: '700',
      },
    },
  },
} satisfies Config

export default config