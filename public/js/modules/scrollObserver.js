let isFetching = false;

async function fetchAndLoadMoreTitles(observer, sentry) {
  if (isFetching) return;

  isFetching = true;

  let page;

  try {
    page = Number(sentry.dataset.page);

    const url = new URL(window.location.href);
    const pathParts = url.pathname.split("/").filter((part) => part.length > 0);
    const category = decodeURIComponent(pathParts[0]);

    const searchParams = new URLSearchParams(window.location.search);

    const response = await fetch(`/${category}/${page}?${searchParams.toString()}`);

    if (!response.ok) {
      throw new Error(`Fetch failed with status ${response.status}`);
    }

    const result = await response.json();

    appendNewTitles(result.html, sentry, observer);

    if (result.noMoreItems) {
      observer.unobserve(sentry);
      return;
    }
  } catch (error) {
    console.error("Failed to fetch additional titles:", error);
  } finally {
    sentry.dataset.page = page + 1;
    isFetching = false;
  }
}

function appendNewTitles(html, sentry, observer) {
  const container = document.querySelector("#titles-container");
  if (!container || !sentry) return;

  observer.unobserve(sentry);

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  Array.from(tempDiv.children).forEach((child) => container.appendChild(child));

  container.appendChild(sentry);
  observer.observe(sentry);
}

export default function createObserver() {
  const sentry = document.querySelector("#sentry");
  if (!sentry) {
    return;
  }
  const observer = new IntersectionObserver(async (entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      await fetchAndLoadMoreTitles(observer, sentry);
    }
  });

  if (sentry) {
    observer.observe(sentry);
  }
}
