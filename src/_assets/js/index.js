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
//
// `opt_out_capturing_by_default` is what makes the "whether or not they answer"
// part true: `on_reject` only falls back to cookieless capture for visitors
// PostHog considers *rejected*, and an unanswered banner counts as rejected only
// when this is on. Without it a visitor who ignores the banner is neither
// cookied nor counted – `is_capturing()` is false and not even the landing
// pageview is sent.
const isDev = window.location.hostname === 'localhost';

posthog.init('phc_QWGNI9ad9Jo4kLsAmzp1fi2sPF6rP3riSUVYrm51EJP', {
  api_host: 'https://eu.i.posthog.com',
  cookieless_mode: 'on_reject',
  opt_out_capturing_by_default: true,
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
//
// Our own profiles only, not the whole of instagram.com/facebook.com: the events
// archive is a wall of links to past facebook.com/events/… and instagram.com/p/…
// posts, and counting those as "went to follow us" would drown out the real
// thing.
const socialProfiles = [
  'instagram.com/officinakreuzberg',
  'facebook.com/OfficinaNeukoelln',
];

function conversionEventFor(href) {
  if (href.includes('docs.google.com/forms')) return 'apply_click';
  if (href.startsWith('mailto:')) return 'email_click';
  if (socialProfiles.some((profile) => href.includes(profile))) {
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
//
// The iframe lives inside <main>, which htmx replaces wholesale, so this has to
// hook htmx:load like the map above: someone who lands on /en/about and then
// clicks "Desks" only ever gets the calendar through a boosted swap, and a
// module-scope lookup would have found nothing at startup. Captured once per
// page load – the flag survives the swaps, the observer does not.
let trialCalendarObserver = null;
let trialCalendarCaptured = false;

document.body.addEventListener('htmx:load', function () {
  if (trialCalendarCaptured || !('IntersectionObserver' in window)) return;

  const calendar = document.getElementById('trial-calendar');
  if (!calendar) return;

  if (trialCalendarObserver) trialCalendarObserver.disconnect();

  trialCalendarObserver = new IntersectionObserver(
    (entries) => {
      // disconnect() does not cancel callbacks already queued for this frame,
      // so the flag has to be re-checked here and not only where the observer
      // is attached – otherwise one scroll past the iframe captures twice.
      if (trialCalendarCaptured) return;
      if (!entries.some((entry) => entry.isIntersecting)) return;

      trialCalendarCaptured = true;
      posthog.capture('trial_calendar_view');
      trialCalendarObserver.disconnect();
    },
    // The iframe is ~1000px tall on mobile; a high threshold would need more of
    // it on screen at once than a phone viewport can show.
    { threshold: 0.15 }
  );

  trialCalendarObserver.observe(calendar);
});

// Reaching the calendar is not the same as using it, and the booking itself is
// unknowable: Google's scheduling iframe posts no message to the parent and
// there is no success redirect, so nothing on this page can see a confirmed
// booking. Focus is as close as we get – clicking into a cross-origin iframe
// blurs the window and leaves it as document.activeElement.
//
// Bound once at window level and resolved at event time, so htmx swapping the
// iframe out from under us does not matter. It can also fire if someone with
// the calendar already focused switches app, which is a rarer way to reach the
// same conclusion – they were engaging with it.
let trialCalendarInteracted = false;

window.addEventListener('blur', function () {
  if (trialCalendarInteracted) return;
  if (document.activeElement?.id !== 'trial-calendar') return;

  trialCalendarInteracted = true;
  posthog.capture('trial_calendar_interact');
});

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
