module.exports = {
  purge: {
    mode: 'all',
    content: [
      './src/**/*.njk',
      './node_modules/leaflet/dist/*.js',
      './node_modules/glightbox/dist/*.js',
    ],
  },
  theme: {
    rotate: {
      '-180': '-180deg',
      '-90': '-90deg',
      '-45': '-45deg',
      0: '0',
      20: '20deg',
      45: '45deg',
      90: '90deg',
      180: '180deg',
    },
    extend: {
      inset: {
        '-2': '-2em',
        '-4': '-4em',
        '-6': '-6em',
      },
      fontSize: {
        smc: '0.8rem',
        lgc: '1.2rem',
        '7xl': '5rem',
      },
      lineHeight: {
        65: '1.7rem',
      },
      minHeight: { 180: '720px' },
      zIndex: { 401: '401' },
      colors: { kobi: '#efb0ca' },
    },
  },
};
