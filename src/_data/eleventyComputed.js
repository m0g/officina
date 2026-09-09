const items = {
  en: {
    desks: 'Desks',
    about: 'About',
    collective: 'The collective',
    artists: 'Artist residency',
    events: 'Events',
  },
  de: {
    desks: 'Arbeitsplätze',
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
