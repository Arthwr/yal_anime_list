export const alertManager = (() => {
  const container = document.querySelector(".alert-toast");
  const alert = container ? container.querySelector("sl-alert") : null;
  const icon = alert.querySelector("sl-icon");
  const strong = alert.querySelector("strong");
  const text = alert.querySelector("div");

  return {
    showAlert: (response) => {
      if (!container || !alert) return;

      icon.name = "check-lg";

      if (response.success) {
        alert.variant = "success";
        strong.textContent = `Success`;
        text.textContent = response.message;
      } else {
        alert.variant = "warning";
        strong.textContent = "Error";
        text.textContent = response.message;
      }

      alert.toast();
    },
  };
})();
