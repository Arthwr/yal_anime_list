function handleActiveNavLinks() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".left a");

  links.forEach((link) => {
    if (link.pathname === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

function setupScoreHover() {
  const titlesContainer = document.querySelector(".grid-wrapper");
  if (!titlesContainer) return;

  titlesContainer.addEventListener("mouseenter", (event) => handleScoreDisplay(event, "show"), true);
  titlesContainer.addEventListener("mouseleave", (event) => handleScoreDisplay(event, "hide"), true);
}

function handleScoreDisplay(event, action) {
  const detectHoverElement = event.target.closest(".detect-hover");

  if (!detectHoverElement) return;

  const span = detectHoverElement.querySelector("span");
  if (span) {
    if (action === "show" && span.dataset.score) {
      span.textContent = span.dataset.score;
    } else if (action === "hide") {
      span.textContent = "";
    }
  }
}

// Infinite scroll logic
let isFetching = false;

async function fetchAndLoadMoreTitles(observer, sentry) {
  if (isFetching) return;

  isFetching = true;

  let page;

  try {
    page = Number(sentry.dataset.page);

    const currentPath = window.location.pathname;
    const category = currentPath === "/" ? "everything" : decodeURIComponent(currentPath.substring(1));
    const response = await fetch(`/titles/${category}/${page}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error("Fetch request to titles failed:" + JSON.stringify(result));
    }

    appendNewTitles(result.html, sentry, observer);

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

function createObserver() {
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

// Event listeners for animations and interactions
document.addEventListener("DOMContentLoaded", () => {
  handleActiveNavLinks();
  setupScoreHover();
});

// Intersection observer
window.addEventListener("load", createObserver);
