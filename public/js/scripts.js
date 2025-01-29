// Animations & Interactivity
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".left a");

  links.forEach((link) => {
    if (link.pathname === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});

const titlesContainer = document.querySelector(".grid-wrapper");

function handleScoreDisplay(event, action) {
  const detectHoverElement = event.target.closest(".detect-hover");

  if (detectHoverElement) {
    const span = detectHoverElement.querySelector("span");
    if (span) {
      if (action === "show" && span.dataset.score) {
        span.textContent = span.dataset.score;
      } else if (action === "hide") {
        span.textContent = "";
      }
    }
  }
}

titlesContainer.addEventListener("mouseenter", (event) => handleScoreDisplay(event, "show"), true);
titlesContainer.addEventListener("mouseleave", (event) => handleScoreDisplay(event, "hide"), true);
