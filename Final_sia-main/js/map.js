// js/map.js

let mapInstance = null;
let markerInstance = null;

function initMap(lat, lon, cityName) {
  if (!mapInstance) {
    // First time — create the map instantly
    mapInstance = L.map("map", { animate: false }).setView([lat, lon], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors"
    }).addTo(mapInstance);

    markerInstance = L.marker([lat, lon])
      .addTo(mapInstance)
      .bindPopup(`📍 ${cityName}`)
      .openPopup();

  } else {
    // Already exists — snap immediately, no animation
    mapInstance.setView([lat, lon], 13, { animate: false });

    markerInstance.setLatLng([lat, lon])
      .bindPopup(`📍 ${cityName}`)
      .openPopup();
  }

  // Recalculate map size immediately
  mapInstance.invalidateSize();
}