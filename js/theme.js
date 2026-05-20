// js/theme.js

function initTheme() {
  const btn = document.getElementById("theme-toggle");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    btn.textContent = isLight ? "🌙 Dark Mode" : "☀️ Light Mode";
  });
}