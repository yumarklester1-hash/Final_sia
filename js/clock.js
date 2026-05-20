// js/clock.js

function updateClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  const dateStr = now.toLocaleDateString("en-PH", {
    timeZone: "Asia/Manila",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  });
  document.getElementById("clock-display").textContent
    = `🕐 ${timeStr} | ${dateStr}`;
}

// Start immediately and update every second
updateClock();
setInterval(updateClock, 1000);