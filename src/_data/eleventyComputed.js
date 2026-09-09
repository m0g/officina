const items = {
  en: {
    desks: 'Desks',
    about: 'About',
    collective: 'The collective',
    artists: 'Artist residency',
    events: 'Events',
    contact: 'Get in touch',
  },
  de: {
    desks: 'Arbeitsplätze',
    about: 'Über uns',
    collective: 'Unser Kollektiv',
    artists: 'Künstlerresidenzen',
    events: 'Veranstaltungen',
    contact: 'Kontakt',
  },
};

// Strings the layouts render themselves, on pages that exist in both languages.
// They are not editorial copy – nobody would open the CMS to reword "Scroll
// down" – so they live here rather than as a field on every page's front
// matter. Page copy still belongs in front matter, with an English fallback.
// `englishOnly` is the note next to a link that leaves the visitor's language;
// it is empty for English, which hides the note.
const ui = {
  en: {
    scrollDown: 'Scroll down',
    collectiveImageAlt: 'The Officina Kreuzberg collective',
    eventImageAlt: 'Event at Officina Kreuzberg',
    englishOnly: '',
  },
  de: {
    scrollDown: 'Nach unten scrollen',
    collectiveImageAlt: 'Das Kollektiv von Officina Kreuzberg',
    eventImageAlt: 'Veranstaltung bei Officina Kreuzberg',
    englishOnly: 'Nur auf Englisch',
  },
};

module.exports = {
  menu: function (data) {
    return items[data.page.lang];
  },
  // sitemap.xml and llms.txt have no language, and render no chrome – fall back
  // to English so a missing `page.lang` can't blow up a template.
  ui: function (data) {
    return ui[data.page.lang] || ui.en;
  },
};
