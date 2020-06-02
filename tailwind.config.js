module.exports = {
  purge: [
    './src/**/*.njk',
  ],
  theme: {
    rotate: {
      '-180': '-180deg',
      '-90': '-90deg',
      '-45': '-45deg',
      '0': '0',
      '20': '20deg',
      '45': '45deg',
      '90': '90deg',
      '180': '180deg',
    },
    extend: {
      inset: {
        '-2': '-2em',
        '-4': '-4em',
      },
      fontSize: {
        'smc': '0.8rem',
        'lgc': '1.2rem',
        '7xl': '5rem',
      },
      lineHeight: {
        '65': '1.7rem',
      },
    }
  },
}
