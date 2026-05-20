// js/news.js

async function getNews(countryCode = "ph", topic = "") {
  try {
    let rssUrl;

    if (topic) {
      rssUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=en&gl=PH&ceid=PH:en`;
    } else {
      rssUrl = `https://news.google.com/rss?hl=en&gl=PH&ceid=PH:en`;
    }

    // Use allorigins as proxy — works from any domain, no key needed
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();

    // Parse the XML string into DOM
    const parser = new DOMParser();
    const xml = parser.parseFromString(data.contents, "text/xml");
    const items = Array.from(xml.querySelectorAll("item")).slice(0, 5);

    if (!items.length) return [];

    return items.map(item => ({
      title: item.querySelector("title")?.textContent || "No title",
      url: item.querySelector("link")?.textContent || "#",
      source: item.querySelector("source")?.textContent || "Google News",
      description: item.querySelector("description")?.textContent
        ?.replace(/<[^>]+>/g, "").slice(0, 120) + "..." || "",
      image: null,
      publishedAt: item.querySelector("pubDate")?.textContent || ""
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
        <div class="news-body">
          <div class="news-meta">${a.source} • ${timeAgo}</div>
          <a href="${a.url}" target="_blank" class="news-title">${a.title}</a>
          <p class="news-desc">${a.description}</p>
        </div>
      </li>
    `;
  }).join("");
}

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

// News suggestions dropdown
const newsSuggestions = [
  "Manila", "Cebu", "Davao", "Cagayan de Oro", "Mindanao",
  "Typhoon", "Earthquake", "Politics", "Economy", "Sports",
  "Technology", "Health", "Education", "Crime", "Entertainment",
  "Philippines News", "OFW", "Traffic", "BFAR", "PAGASA"
];

function showNewsSuggestions(input) {
  const existing = document.getElementById("news-picker");
  if (existing) existing.remove();

  const query = input.value.trim().toLowerCase();
  if (!query) return;

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
      const newsData = await getNews("ph", suggestion);
      renderNews(newsData);
    });
    picker.appendChild(item);
  });

  const newsSearch = document.querySelector(".news-search");
  newsSearch.style.position = "relative";
  newsSearch.appendChild(picker);

  setTimeout(() => {
    document.addEventListener("click", () => picker.remove(), { once: true });
  }, 100);
}