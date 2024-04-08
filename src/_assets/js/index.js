import './htmx.js';
import { map as lMap, tileLayer, marker, Browser } from './leaflet.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/components/dialog/dialog.js';
import 'https://cdn.jsdelivr.net/npm/@shoelace-style/shoelace@2.13.1/cdn/components/button/button.js';

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

  const popup = document.getElementById('popup');

  if (!document.cookie.match(/shown_popup=1/) && popup) {
    const closeButton = popup.querySelector('sl-button[slot="footer"]');

    popup.show();
    closeButton.addEventListener('click', () => popup.hide());

    popup.addEventListener('sl-after-hide', () => {
      document.cookie = 'shown_popup=1; SameSite=Strict';
    });
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
