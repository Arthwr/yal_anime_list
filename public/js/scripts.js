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

const rating = document.querySelectorAll(".detect-hover");

rating.forEach((node) => {
  const span = node.querySelector("span");

  if (span) {
    node.addEventListener("mouseenter", () => {
      if (span.dataset.score) {
        span.textContent = span.dataset.score;
      }
    });

    node.addEventListener("mouseleave", () => {
      span.textContent = "";
    });
  }
});
