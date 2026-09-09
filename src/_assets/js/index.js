import './htmx.js';
import { map as lMap, tileLayer, marker, Browser } from './leaflet.js';
import posthog from './posthog.js';

// MAP
document.body.addEventListener('htmx:load', function () {
  if (document.getElementById('map')) {
    const position = [52.48839587601789, 13.419732288736586];

    const options = {
      scrollWheelZoom: false,
      dragging: Browser.mobile,
      tap: Browser.mobile,
    };

    const map = lMap('map', options).setView(position, 17);

    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    marker(position).addTo(map).bindPopup('Officina').openPopup();
  }
});

// Sidebar
// The header lives outside <main>, so htmx never re-renders it. Registering on
// htmx:load would stack a second listener on the same button after every
// boosted navigation, and the extra toggle would cancel the first one out — so
// this one is delegated and bound once.
document.addEventListener('click', function (event) {
  if (!(event.target instanceof Element)) return;

  if (event.target.closest('#sidebar-open')) {
    document.getElementById('sidebar').classList.toggle('hidden');
  } else if (event.target.closest('#sidebar a[hx-push-url="true"]')) {
    document.getElementById('sidebar').classList.add('hidden');
  }
});

// Posthog
//
// `cookieless_mode: 'on_reject'` means every visitor is counted from their very
// first pageview, whether or not they ever answer the banner: until someone
// explicitly accepts, PostHog stores nothing on the device and identifies the
// visit with a hash it computes server-side. Only an explicit "accept" switches
// it to cookies, which is what buys us country data and returning visitors for
// that slice. Nothing is counted at all if "Cookieless server hash mode" is off
// in the project settings – PostHog drops cookieless events on the floor.
const isDev = window.location.hostname === 'localhost';

posthog.init('phc_QWGNI9ad9Jo4kLsAmzp1fi2sPF6rP3riSUVYrm51EJP', {
  api_host: 'https://eu.i.posthog.com',
  cookieless_mode: 'on_reject',
  // <main> is hx-boost'ed, so most navigation is pushState and never reloads
  // the page. Without this the only pageview we would ever see is the one the
  // visitor landed on.
  capture_pageview: 'history_change',
  // Keeps dev traffic out of the numbers. Opting out is not enough: under
  // `on_reject` an opted-out visitor is still captured, cookielessly, which is
  // the whole point of that mode. Dropping the event in before_send is the only
  // thing that actually stops it leaving the browser.
  before_send: isDev ? () => null : undefined,
  debug: isDev,
});

// Which language someone actually read the site in, on every event – the German
// half of the audience is otherwise only visible through URL prefixes.
posthog.register({ site_language: document.documentElement.lang });

// Conversion tracking
//
// Every way out of the site that counts as interest: the Google form, the email
// address, the social profiles. Matching on href rather than on a hand-placed
// attribute means a new link in a FAQ answer or a translated page is counted
// without anyone remembering to annotate it.
function conversionEventFor(href) {
  if (href.includes('docs.google.com/forms')) return 'apply_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (href.includes('instagram.com') || href.includes('facebook.com')) {
    return 'social_click';
  }
  return null;
}

document.addEventListener('click', function (event) {
  if (!(event.target instanceof Element)) return;

  const link = event.target.closest('a[href]');
  if (!link) return;

  const eventName = conversionEventFor(link.getAttribute('href'));
  if (!eventName) return;

  posthog.capture(eventName, {
    // Which of the several identical apply buttons this was – set explicitly
    // via data-ph-location, and otherwise the enclosing section.
    location: link.dataset.phLocation || link.closest('[id]')?.id || 'unknown',
    link_text: link.innerText.trim().replace(/\s+/g, ' ').slice(0, 80),
  });
});

// The trial day is booked in a cross-origin Google Calendar iframe, so the
// booking itself is invisible to us. Reaching the calendar at all is the
// strongest signal we can get, and it is the step before the best offer we have.
const calendar = document.getElementById('trial-calendar');

if (calendar && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;

      posthog.capture('trial_calendar_view');
      observer.disconnect();
    },
    { threshold: 0.4 }
  );

  observer.observe(calendar);
}

// Cookie consent
//
// PostHog itself remembers the choice, so there is no cookie for us to manage:
// "pending" means nobody has answered and the banner is due. Bound once and
// delegated, for the same reason as the sidebar above – this markup sits
// outside <main>, but htmx:load would still stack a listener per navigation.
const banner = document.getElementById('cookie-banner');

const setBannerVisible = (visible) => {
  banner.classList.toggle('fixed', visible);
  banner.classList.toggle('hidden', !visible);
};

document.addEventListener('click', function (event) {
  if (!(event.target instanceof Element)) return;

  if (event.target.closest('#accept-cookie')) {
    posthog.opt_in_capturing();
    setBannerVisible(false);
  } else if (event.target.closest('#decline-cookie')) {
    posthog.opt_out_capturing();
    setBannerVisible(false);
  } else if (event.target.closest('#show-cookie-banner')) {
    setBannerVisible(true);
  }
});

setBannerVisible(posthog.get_explicit_consent_status() === 'pending');
