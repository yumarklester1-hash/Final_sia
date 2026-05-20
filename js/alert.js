// js/alert.js

function checkWeatherAlert(temp, code) {
  const banner = document.getElementById("alert-banner");

  // Thunderstorm codes
  if (code === 95 || code === 96 || code === 99) {
    banner.textContent = "⛈️ Thunderstorm Warning — Stay indoors and avoid travel!";
    banner.className = "alert-banner danger";
    return;
  }

  // Extreme heat
  if (temp >= 38) {
    banner.textContent = "🥵 Extreme Heat Warning — Stay hydrated and avoid going outside!";
    banner.className = "alert-banner danger";
    return;
  }

  // High heat
  if (temp >= 35) {
    banner.textContent = "☀️ Heat Advisory — It's very hot today. Stay hydrated!";
    banner.className = "alert-banner";
    return;
  }

  // Heavy rain codes
  if (code === 65 || code === 82) {
    banner.textContent = "🌧️ Heavy Rain Advisory — Bring an umbrella and drive carefully.";
    banner.className = "alert-banner";
    return;
  }

  // No alert — hide banner
  banner.className = "alert-banner hidden";
}