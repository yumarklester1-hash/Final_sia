// js/news.js

async function getNews(countryCode = "ph", topic = "") {
  try {
    let url;

    if (topic) {
      url = `https://gnews.io/api/v4/search`
          + `?q=${encodeURIComponent(topic)}`
          + `&lang=en&max=5&apikey=${CONFIG.NEWS_KEY}`;
    } else {
      url = `https://gnews.io/api/v4/top-headlines`
          + `?country=${countryCode}&max=5&apikey=${CONFIG.NEWS_KEY}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    return data.articles.map(a => ({
      title: a.title,
      url: a.url,
      source: a.source.name,
      description: a.description,   // ← add this
      image: a.image,                // ← add this
      publishedAt: a.publishedAt     // ← add this
    }));
  } catch (error) {
    console.error("News fetch failed:", error);
    return [];
  }
}

function renderNews(articles) {
  const list = document.getElementById("news-content");
  if (!articles.length) {
    list.innerHTML = "<li style='color:var(--muted)'>No news found.</li>";
    return;
  }

  list.innerHTML = articles.map(a => {
    const timeAgo = getTimeAgo(a.publishedAt);
    return `
      <li class="news-item">
        ${a.image ? `<img src="${a.image}" class="news-thumb" 
          onerror="this.style.display='none'" />` : ""}
        <div class="news-body">
          <div class="news-meta">${a.source} • ${timeAgo}</div>
          <a href="${a.url}" target="_blank" class="news-title">${a.title}</a>
          <p class="news-desc">${a.description || ""}</p>
        </div>
      </li>
    `;
  }).join("");
}

// Converts ISO date to "2 hours ago", "just now", etc.
function getTimeAgo(dateStr) {
  if (!dateStr) return "";
  const now = new Date();
  const published = new Date(dateStr);
  const diffMs = now - published;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// Suggested news topics dropdown
const newsSuggestions = [
  "Manila", "Cebu", "Davao", "Cagayan de Oro", "Mindanao",
  "Typhoon", "Earthquake", "Politics", "Economy", "Sports",
  "Technology", "Health", "Education", "Crime", "Entertainment",
  "Philippines News", "OFW", "Traffic", "BFAR", "PAGASA"
];

function showNewsSuggestions(input) {
  // Remove existing dropdown
  const existing = document.getElementById("news-picker");
  if (existing) existing.remove();

  const query = input.value.trim().toLowerCase();

  // Only show if user has typed something
  if (!query) return;

  // Filter suggestions that match what user typed
  const matches = newsSuggestions.filter(s =>
    s.toLowerCase().includes(query)
  );

  if (!matches.length) return;

  const picker = document.createElement("div");
  picker.id = "news-picker";
  picker.style.cssText = `
    position: absolute;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 10px;
    z-index: 9999;
    width: 100%;
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
    overflow: hidden;
  `;

  matches.forEach(suggestion => {
    const item = document.createElement("div");
    item.textContent = `🔍 ${suggestion}`;
    item.style.cssText = `
      padding: 12px 16px;
      cursor: pointer;
      font-size: 0.9rem;
      border-bottom: 1px solid var(--border);
      color: var(--text);
    `;
    item.addEventListener("mouseover", () =>
      item.style.background = "var(--border)"
    );
    item.addEventListener("mouseout", () =>
      item.style.background = "transparent"
    );
    item.addEventListener("click", async () => {
      input.value = suggestion;
      picker.remove();

      // Fetch and render news for selected suggestion
      const newsData = await getNews("ph", suggestion);
      renderNews(newsData);
    });
    picker.appendChild(item);
  });

  // Position below the news search bar
  const newsSearch = document.querySelector(".news-search");
  newsSearch.style.position = "relative";
  newsSearch.appendChild(picker);

  // Click outside to close
  setTimeout(() => {
    document.addEventListener("click", () => picker.remove(), { once: true });
  }, 100);
}