import '@ibm/plex/css/ibm-plex.css';
import '../css/style.css'
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'glightbox/dist/css/glightbox.css';
import GLightbox from 'glightbox'

// stupid hack so that leaflet's images work after going through webpack
import marker from 'leaflet/dist/images/marker-icon.png';
import marker2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: marker2x,
  iconUrl: marker,
  shadowUrl: markerShadow
});

// MAP
if (document.getElementById('map')) {
  const position = [52.4643115,13.4443876];
  
  const options = {
    scrollWheelZoom: false,
    dragging: !L.Browser.mobile,
    tap: !L.Browser.mobile
  };

  const map = L.map('map', options)
    .setView(position, 17);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  L.marker(position).addTo(map)
    .bindPopup('Officina Neukölln')
    .openPopup();
}

// Gallery
GLightbox({
  selector: '.lightbox',
  touchNavigation: true,
  loop: true,
});

function toggleSidebar(e) {
  const sidebar = document.getElementById('sidebar');

  console.log('uuo')
  sidebar.classList.toggle('hidden');
}

document.addEventListener("DOMContentLoaded", event => { 
  const burgerBtn = document.getElementById('sidebar-open');

  burgerBtn.addEventListener('touchend', toggleSidebar);
});