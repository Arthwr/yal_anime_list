let isFetching = false;

async function fetchAndLoadMoreTitles(observer, sentry) {
  if (isFetching) return;

  isFetching = true;

  let page;

  try {
    page = Number(sentry.dataset.page);

    const currentPath = window.location.pathname;

    const category = currentPath === "/" ? "everything" : currentPath.substring(1);
    const response = await fetch(`/titles/${category}/${page}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error("Fetch request to titles failed:" + JSON.stringify(result));
    }

    const container = document.querySelector("#titles-container");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = result.html;

    Array.from(tempDiv.children).forEach((child) => container.appendChild(child));

    observer.unobserve(sentry);
    container.appendChild(sentry);
    observer.observe(sentry);

    if (result.noMoreItems) {
      observer.unobserve(sentry);
      return;
    }
  } catch (error) {
    console.error("Fetch error: ", {
      message: error.message,
      stack: error.stack,
    });
  } finally {
    sentry.dataset.page = page + 1;
    isFetching = false;
  }
}

function createObserver() {
  const sentry = document.querySelector("#sentry");
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

// Intersection observer
window.addEventListener("load", createObserver);
