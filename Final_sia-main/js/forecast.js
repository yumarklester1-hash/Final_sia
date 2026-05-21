// js/forecast.js

async function getForecast(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast`
              + `?latitude=${lat}&longitude=${lon}`
              + `&daily=temperature_2m_max,weathercode`
              + `&timezone=Asia%2FManila&forecast_days=5`;
    const res = await fetch(url);
    const data = await res.json();

    return data.daily.time.map((date, i) => ({
      date: date,
      temp: Math.round(data.daily.temperature_2m_max[i]),
      code: data.daily.weathercode[i]
    }));
  } catch (error) {
    console.error("Forecast fetch failed:", error);
    return [];
  }
}

function renderForecast(days) {
  const container = document.getElementById("forecast-content");
  if (!days.length) {
    container.innerHTML = "<p>Forecast unavailable.</p>";
    return;
  }

  container.innerHTML = days.map(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString("en-PH", { weekday: "short" });
    return `
      <div class="forecast-day">
        <div class="day-name">${dayName}</div>
        <div class="day-temp">${day.temp}°C</div>
        <div class="day-desc">${getWeatherDescription(day.code)}</div>
      </div>
    `;
  }).join("");
}