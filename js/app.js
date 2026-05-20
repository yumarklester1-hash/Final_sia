// js/app.js
function showSkeletons() {
  document.getElementById("weather-content").innerHTML = `
    <div class="skeleton tall"></div>
    <div class="skeleton short"></div>
    <div class="skeleton medium"></div>
  `;
  document.getElementById("forecast-content").innerHTML = `
    <div class="skeleton tall"></div>
    <div class="skeleton tall"></div>
    <div class="skeleton tall"></div>
    <div class="skeleton tall"></div>
    <div class="skeleton tall"></div>
  `;
  document.getElementById("news-content").innerHTML = `
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
  `;
}
// ===== CORE DASHBOARD LOADER =====
async function loadDashboard(city, countryCode, lat, lon) {
  const [weatherData, forecastData, newsData] = await Promise.all([
    getWeather(city, lat, lon),
    getForecast(lat, lon),
    getNews(countryCode)
  ]);

  renderWeather(weatherData);
  renderForecast(forecastData);
  renderNews(newsData);
  initMap(lat, lon, city);

  if (weatherData) {
    checkWeatherAlert(weatherData.temp, weatherData.code);
  }
}

// ===== LOCATION PICKER DROPDOWN =====
function showLocationPicker(results) {
  const existing = document.getElementById("location-picker");
  if (existing) existing.remove();

  const picker = document.createElement("div");
  picker.id = "location-picker";
  picker.style.cssText = `
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    z-index: 9999;
    width: 400px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    overflow: hidden;
  `;

  results.forEach(r => {
    const item = document.createElement("div");
    item.textContent = `${r.name}, ${r.admin1 ? r.admin1 + ", " : ""}${r.country}`;
    item.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--border);
      color: var(--text);
    `;
    item.addEventListener("mouseover", () => item.style.background = "var(--border)");
    item.addEventListener("mouseout", () => item.style.background = "transparent");
    item.addEventListener("click", async () => {
      picker.remove();
      await applyLocation(r);
    });
    picker.appendChild(item);
  });

  const searchBar = document.querySelector(".search-bar");
  searchBar.style.position = "relative";
  searchBar.appendChild(picker);

  setTimeout(() => {
    document.addEventListener("click", () => picker.remove(), { once: true });
  }, 100);
}

// ===== APPLY SELECTED LOCATION =====
async function applyLocation(result) {
  // Safety check — some results may have missing fields
  const name = result.name || "Unknown";
  const country = result.country || "";
  const countryCode = (result.country_code || "ph").toLowerCase();
  const lat = result.latitude;
  const lon = result.longitude;

  document.getElementById("location-display").textContent
    = `📍 ${name}, ${country}`;

  // Clear city input
  document.getElementById("city-input").value = "";

  await loadDashboard(name, countryCode, lat, lon);
}

// ===== MAIN INIT =====
async function initDashboard() {
  initTheme();
  showSkeletons();
  const location = await getUserLocation();
  document.getElementById("location-display")
    .textContent = `📍 ${location.city}, ${location.country}`;

  await loadDashboard(
    location.city,
    location.countryCode,
    location.lat,
    location.lon
  );

  // City search button
  document.getElementById("search-btn").addEventListener("click", async () => {
    const input = document.getElementById("city-input").value.trim();
    if (!input) return;

    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search`
                 + `?name=${encodeURIComponent(input)}&count=5`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      alert("Location not found. Try a different name.");
      return;
    }

    if (geoData.results.length === 1) {
      await applyLocation(geoData.results[0]);
      return;
    }

    showLocationPicker(geoData.results);
  });

  // Enter key for city search
  document.getElementById("city-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") document.getElementById("search-btn").click();
  });

  // News search button
  // News search button
document.getElementById("news-search-btn").addEventListener("click", async () => {
  const input = document.getElementById("news-input");
  const topic = input.value.trim();

  // Remove dropdown if open
  const existing = document.getElementById("news-picker");
  if (existing) existing.remove();

  // Show loading state
  document.getElementById("news-content").innerHTML = `
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
  `;

  const newsData = await getNews("ph", topic);
  renderNews(newsData);
});

document.getElementById("news-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("news-search-btn").click();
});

document.getElementById("news-input").addEventListener("input", () => {
  const input = document.getElementById("news-input");
  showNewsSuggestions(input);
});

// Enter key for news search
document.getElementById("news-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") document.getElementById("news-search-btn").click();
});

// Show suggestions as user types
document.getElementById("news-input").addEventListener("input", () => {
  const input = document.getElementById("news-input");
  showNewsSuggestions(input);
});
}

initDashboard();