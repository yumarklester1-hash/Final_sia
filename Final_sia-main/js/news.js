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

    return items.map(item => {
      const title = item.querySelector("title")?.textContent || "No title";
      const url = item.querySelector("link")?.textContent || "#";
      const source = item.querySelector("source")?.textContent || "Google News";
      let desc = item.querySelector("description")?.textContent || "";
      desc = desc.replace(/<[^>]+>/g, "").trim();
      if (desc.length > 120) desc = desc.slice(0, 120) + "...";
      const publishedAt = item.querySelector("pubDate")?.textContent || "";
      return { title, url, source, description: desc, image: null, publishedAt };
    });

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
// Search UI removed: disable suggestions handler to avoid errors
function showNewsSuggestions() {
  return; // removed per request — search suggestions disabled
}

async function initNews() {
  const container = document.getElementById('news-content');
  if (!container) return;
  container.innerHTML = `
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
    <li><div class="skeleton"></div><div class="skeleton short"></div></li>
  `;

  const articles = await getNews('ph');
  renderNews(articles);
}

// Auto-initialize news on script load
initNews();