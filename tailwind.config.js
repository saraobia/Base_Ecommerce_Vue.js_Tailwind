/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      spacing: {
        104: '26rem',
        112: '28rem',
        120: '30rem',
        128: '32rem',
        256: '64rem',
      },
    },
    screens: {
      customPrenotation: '500px',
      bigSmartphone: '680px',
      tablet: '780px',
      laptop: '1000px',
      desktop: '1280px',
    },
    colors: {
      background: '#0B0C0B',
      card: '#131414',
      primary: '#27C499',
      secondary: '#BB86FC',
      secondaryDark: '#3700b3',
      white: '#f9f9f9',

      tGray: '#cccccc',
      tDarkGray: '#7a7a7a',
      tMiddle: '#474747',
      tDark: '#181818',

      warning: '#e3b02f',
      danger: '#CF6679',
    },
    boxShadow: {
      'inner-strong': 'inset 0 2px 4px 2px rgba(0, 0, 0, 0.2)',
      strong: '2px 4px 2px rgba(0, 0, 0, 0.8)',
    },
  },
};
