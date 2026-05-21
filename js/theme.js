// js/theme.js

function initTheme() {
  const btn = document.getElementById("theme-toggle");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    btn.innerHTML = isLight ? '<img src="images/light.svg" class="icon"> Dark Mode' : '<img src="images/dark.svg" class="icon"> Light Mode';
  });
}