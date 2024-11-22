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
document.addEventListener('DOMContentLoaded', () => {
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
posthog.init('phc_QWGNI9ad9Jo4kLsAmzp1fi2sPF6rP3riSUVYrm51EJP', {
  api_host: 'https://eu.i.posthog.com',
  persistence: 'memory',
});
