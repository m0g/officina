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
    openSidebar: 'Open the sidebar',
    workspaceImageAlt: 'The Officina Kreuzberg workspace in Berlin',
    fixDeskImageAlt: 'Fix desk at Officina Kreuzberg',
    flexDeskImageAlt: 'Flex desk at Officina Kreuzberg',
    roomImageAlt: 'Private room at Officina Kreuzberg',
    collectiveImageAlt: 'The Officina Kreuzberg collective',
    eventImageAlt: 'Event at Officina Kreuzberg',
    eventMailSubject: 'Event at Officina',
    trialDayCalendar: 'Book a trial day at Officina Kreuzberg',
    // PostHog already counts the visit cookielessly, so the banner says what
    // accepting adds rather than asking for a favour.
    cookieText:
      "We measure how the site gets used so we can improve it. You're " +
      'already counted anonymously – no cookies, nothing stored on your ' +
      'device. Accepting lets us also recognise a returning visit. We ' +
      "don't share any of it with anyone.",
    cookieAccept: 'Accept cookies',
    cookieDecline: 'No thanks',
    cookieSettings: 'Cookie settings',
    creditsMadeBy: 'Made by',
    creditsMe: 'me',
    creditsAnd: 'and',
    creditsHim: 'him',
    emailLabel: 'Email',
    englishOnly: '',
  },
  de: {
    scrollDown: 'Nach unten scrollen',
    openSidebar: 'Menü öffnen',
    workspaceImageAlt: 'Der Arbeitsraum von Officina Kreuzberg in Berlin',
    fixDeskImageAlt: 'Fix Desk bei Officina Kreuzberg',
    flexDeskImageAlt: 'Flex Desk bei Officina Kreuzberg',
    roomImageAlt: 'Eigenes Zimmer bei Officina Kreuzberg',
    collectiveImageAlt: 'Das Kollektiv von Officina Kreuzberg',
    eventImageAlt: 'Veranstaltung bei Officina Kreuzberg',
    eventMailSubject: 'Veranstaltung bei Officina',
    trialDayCalendar: 'Probetag bei Officina Kreuzberg buchen',
    cookieText:
      'Wir messen, wie die Seite genutzt wird, um sie zu verbessern. Du ' +
      'wirst dabei schon anonym gezählt – ohne Cookies, ohne Daten auf ' +
      'deinem Gerät. Mit deinem Einverständnis erkennen wir zusätzlich ' +
      'wiederkehrende Besuche. Wir geben nichts an Dritte weiter.',
    cookieAccept: 'Cookies akzeptieren',
    cookieDecline: 'Nein, danke',
    cookieSettings: 'Cookie-Einstellungen',
    creditsMadeBy: 'Gemacht von',
    creditsMe: 'mir',
    creditsAnd: 'und',
    creditsHim: 'ihm',
    emailLabel: 'E-Mail',
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
