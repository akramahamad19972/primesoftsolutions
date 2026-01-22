(function () {
  const root = document.documentElement;

  // Theme: default from localStorage or system preference
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
  } else {
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    root.setAttribute("data-theme", prefersLight ? "light" : "dark");
  }

  // Theme toggle buttons
  function setTheme(next) {
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }
  window.toggleTheme = function () {
    const current = root.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  };

  // Pricing toggle (monthly/yearly)
  const pricingMode = localStorage.getItem("pricingMode") || "monthly";
  localStorage.setItem("pricingMode", pricingMode);

  window.setPricingMode = function (mode) {
    localStorage.setItem("pricingMode", mode);
    updatePricingUI();
  };

  function money(n){ return Intl.NumberFormat(undefined, {style:"currency", currency:"USD"}).format(n); }

  function updatePricingUI() {
    const mode = localStorage.getItem("pricingMode") || "monthly";

    document.querySelectorAll("[data-pill]").forEach(p => {
      p.classList.toggle("active", p.getAttribute("data-pill") === mode);
    });

    document.querySelectorAll("[data-price]").forEach(el => {
      const monthly = Number(el.getAttribute("data-monthly") || "0");
      const yearly = Number(el.getAttribute("data-yearly") || "0");
      el.textContent = mode === "monthly" ? money(monthly) : money(yearly);
    });

    document.querySelectorAll("[data-price-suffix]").forEach(el => {
      el.textContent = mode === "monthly" ? "/month" : "/year";
    });

    document.querySelectorAll("[data-checkout-link]").forEach(a => {
      const monthlyLink = a.getAttribute("data-checkout-monthly") || "checkout.html";
      const yearlyLink = a.getAttribute("data-checkout-yearly") || "checkout.html";
      a.setAttribute("href", mode === "monthly" ? monthlyLink : yearlyLink);
    });
  }

  document.addEventListener("DOMContentLoaded", updatePricingUI);
})();
