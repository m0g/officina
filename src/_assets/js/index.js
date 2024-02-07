// import '@ibm/plex/css/ibm-plex.css';
// import '../css/style.css';
// import 'leaflet/dist/leaflet.css';
import {
  Icon,
  map as lMap,
  tileLayer,
  marker,
  Browser,
} from './../../js/leaflet.js';

// stupid hack so that leaflet's images work after going through webpack
// import marker from 'leaflet/dist/images/marker-icon.png';
// import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// delete Icon.Default.prototype._getIconUrl;

// Icon.Default.mergeOptions({
//   iconRetinaUrl: marker2x,
//   iconUrl: marker,
//   shadowUrl: markerShadow,
// });

// MAP
if (document.getElementById('map')) {
  const position = [52.4643115, 13.4443876];

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

  marker(position).addTo(map).bindPopup('Officina Neukölln').openPopup();
}

function toggleSidebar(e) {
  const sidebar = document.getElementById('sidebar');

  sidebar.classList.toggle('hidden');
}

document.addEventListener('DOMContentLoaded', (event) => {
  const burgerBtn = document.getElementById('sidebar-open');

  burgerBtn.addEventListener('touchend', toggleSidebar);
});
