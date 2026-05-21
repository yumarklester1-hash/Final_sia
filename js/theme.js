// js/theme.js

function initTheme() {
  const btn = document.getElementById("theme-toggle");

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    btn.innerHTML = isLight ? '<img src="images/dark.png" class="icon"> Dark Mode' : '<img src="images/light.png" class="icon"> Light Mode';
  });
}