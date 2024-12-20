import './htmx.js';
import { map as lMap, tileLayer, marker, Browser } from './leaflet.js';
import posthog from './posthog.js';
import Cookies from './universal-cookie.js';

const cookies = new Cookies();
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
document.body.addEventListener('htmx:load', function () {
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    console.log('toggle sidebar', sidebar);

    sidebar.classList.toggle('hidden');
  }

  const burgerBtn = document.getElementById('sidebar-open');

  burgerBtn.addEventListener('mouseup', toggleSidebar);

  const sidebarLinks = document.querySelectorAll(
    '#sidebar a[hx-push-url="true"]'
  );

  for (const sidebarLink of sidebarLinks) {
    sidebarLink.addEventListener('click', () => {
      const sidebar = document.getElementById('sidebar');
      sidebar.classList.add('hidden');
    });
  }
});

// Posthog config
function initPosthog() {
  if (window.location.hostname === 'localhost') {
    console.log('dev version, posthog is deactivated');
  } else {
    console.log('posthog init');
    posthog.init('phc_QWGNI9ad9Jo4kLsAmzp1fi2sPF6rP3riSUVYrm51EJP', {
      api_host: 'https://eu.i.posthog.com',
    });
  }
}

// Cookie consent
document.body.addEventListener('htmx:load', function () {
  const trackingCookieName = 'officina-tracking';
  const showCookieBanner = document.getElementById('show-cookie-banner');
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieAccept = document.getElementById('accept-cookie');
  const declineCookie = document.getElementById('decline-cookie');

  const handleCookieChange = (cookie) => {
    if (cookie.name === trackingCookieName && cookie.value == 'accepted') {
      initPosthog();
    }
  };

  const showBanner = () => {
    cookieBanner.classList.add('fixed');
    cookieBanner.classList.remove('hidden');
  };

  const hideBanner = () => {
    cookieBanner.classList.remove('fixed');
    cookieBanner.classList.add('hidden');
  };

  showCookieBanner.onclick = showBanner;

  cookieAccept.onclick = () => {
    cookies.set(trackingCookieName, 'accepted', {
      path: '/',
      expires: new Date(2099, 1, 1),
    });

    hideBanner();
  };

  declineCookie.onclick = () => {
    cookies.set(trackingCookieName, 'rejected', {
      path: '/',
      expires: new Date(2099, 1, 1),
    });

    posthog.opt_out_capturing();
    hideBanner();
  };

  cookies.addChangeListener(handleCookieChange);

  if (cookies.get(trackingCookieName) === 'accepted') {
    initPosthog();
  }

  if (!cookies.get(trackingCookieName)) {
    showBanner();
  }
});
