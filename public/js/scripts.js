import createObserver from "./scrollObserver.js";

function setupScoreHover() {
  const titlesContainer = document.querySelector(".grid-wrapper");
  if (!titlesContainer) return;

  const handleScoreDisplay = (event, action) => {
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
  };

  titlesContainer.addEventListener("mouseenter", (event) => handleScoreDisplay(event, "show"), true);
  titlesContainer.addEventListener("mouseleave", (event) => handleScoreDisplay(event, "hide"), true);
}

function setupCategoryAssign() {
  const titlesContainer = document.querySelector(".grid-wrapper");
  if (!titlesContainer) return;

  titlesContainer.addEventListener("sl-select", (event) => {
    const targetMenu = event.target;

    if (targetMenu instanceof Element && targetMenu.classList.contains("category-menu")) {
      const item = event.detail.item;
      console.log("Selected item: ", item.value);
    }
  });
}

// prettier-ignore
function setupActiveLinks() {
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

// Event listeners for animations and interactions
document.addEventListener("DOMContentLoaded", () => {
  setupActiveLinks();
  setupScoreHover();
  setupCategoryAssign();
});

// Intersection observer
window.addEventListener("load", createObserver);
