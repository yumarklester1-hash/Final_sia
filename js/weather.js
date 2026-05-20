// js/weather.js

async function getWeather(city, lat, lon) {
  try {
    // PRIMARY: OpenWeatherMap (requires free API key)
    if (CONFIG.WEATHER_KEY) {
      return await getWeatherFromOpenWeather(city);
    } else {
      // ALTERNATIVE: Open-Meteo (no API key needed, uses coordinates)
      return await getWeatherFromOpenMeteo(lat, lon);
    }
  } catch (error) {
    console.error("Weather fetch failed:", error);
    return null;
  }
}

// --- PRIMARY: OpenWeatherMap ---
async function getWeatherFromOpenWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather`
            + `?q=${city}&appid=${CONFIG.WEATHER_KEY}&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    temp: Math.round(data.main.temp),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
  };
}

// --- ALTERNATIVE 1: Open-Meteo (no key needed) ---
async function getWeatherFromOpenMeteo(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast`
            + `?latitude=${lat}&longitude=${lon}`
            + `&current_weather=true&hourly=relativehumidity_2m`;
  const res = await fetch(url);
  const data = await res.json();
  return {
    temp: Math.round(data.current_weather.temperature),
    description: getWeatherDescription(data.current_weather.weathercode),
    humidity: data.hourly.relativehumidity_2m[0],
    code: data.current_weather.weathercode,
    icon: null
  };
}

// Open-Meteo uses numeric weather codes, this converts them
function getWeatherDescription(code) {
  const codes = {
    0: "Clear Sky", 1: "Mainly Clear", 2: "Partly Cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy Fog", 51: "Light Drizzle", 53: "Drizzle",
    55: "Heavy Drizzle", 61: "Light Rain", 63: "Moderate Rain", 65: "Heavy Rain",
    71: "Light Snow", 73: "Moderate Snow", 75: "Heavy Snow",
    80: "Rain Showers", 81: "Moderate Showers", 82: "Heavy Showers",
    95: "Thunderstorm", 96: "Thunderstorm w/ Hail", 99: "Heavy Thunderstorm"
  };
  return codes[code] ?? `Clear Sky`; // fallback instead of "Unknown"
}

// --- ALTERNATIVE 2: wttr.in (no key needed) ---
async function getWeatherFromWttr(city) {
  const url = `https://wttr.in/${city}?format=j1`;
  const res = await fetch(url);
  const data = await res.json();
  const current = data.current_condition[0];
  return {
    temp: current.temp_C,
    description: current.weatherDesc[0].value,
    humidity: current.humidity,
    icon: null
  };
}

// Renders weather data into the HTML
function renderWeather(data) {
  const container = document.getElementById("weather-content");
  if (!data) {
    container.innerHTML = "<p>Weather unavailable.</p>";
    return;
  }
  container.innerHTML = `
    ${data.icon ? `<img src="${data.icon}" alt="${data.description}" />` : ""}
    <div class="temp">${data.temp}°C</div>
    <div class="desc">${data.description}</div>
    <div class="humidity">💧 Humidity: ${data.humidity}%</div>
  `;
}