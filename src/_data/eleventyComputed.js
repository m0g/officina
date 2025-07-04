const items = {
  en: {
    about: 'About',
    collective: 'Our collective',
    artists: 'Art Residencies',
    events: 'Events',
  },
  de: {
    about: 'Über uns',
    collective: 'Unser Kollektiv',
    artists: 'Künstlerresidenzen',
    events: 'Veranstaltungen',
  },
};

module.exports = {
  menu: function (data) {
    return items[data.page.lang];
  },
};
