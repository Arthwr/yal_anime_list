import createObserver from "./modules/scrollObserver.js";
import updateItemCategory from "./modules/updateItemCategory.js";
import { alertManager } from "./modules/alertManager.js";

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
      const categoryName = event.detail.item.value;
      const titleId = event.target.closest(".card-overview").dataset.id;
      updateItemCategory(categoryName, titleId)
        .then((response) => alertManager.showAlert(response))
        .catch((error) => {
          console.error("Error in setupCategoryAssign", error);
        });
    }
  });
}

function setupActiveLinks() {
  const currentPathParts = window.location.pathname.split("/");
  const currentPath = currentPathParts[1] || "";
  const links = document.querySelectorAll(".left a");

  links.forEach((link) => {
    const linkPath = link.pathname.slice(1, -1);
    if (linkPath === currentPath) {
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
