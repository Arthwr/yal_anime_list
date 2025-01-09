document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll(".left a");

  links.forEach((link) => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
