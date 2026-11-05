/* ALLO LAVAGE — editable business settings */
const CONFIG = {
  brand: "ALLO LAVAGE",
  whatsapp: "212661389143", // Replace with your verified WhatsApp number (digits, country code, no +).
  prices: {
    citadine: { label: "Citadine / Berline", exterior: 80, full: 150 },
    suv: { label: "SUV / 4x4", exterior: 140, full: 200 }
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let currentVehicle = "citadine";

function whatsappLink(message) {
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(message);
}

function bookingMessage(service, vehicle, price, quartier, date) {
  const parts = [
    "Bonjour ALLO LAVAGE,",
    "Je souhaite demander une réservation de lavage à domicile à Casablanca.",
    "",
    "Prestation : " + service,
    "Véhicule : " + vehicle,
    "Tarif indicatif : " + (price === null ? "sur devis" : price + " DH"),
    "Quartier : " + (quartier || "à préciser")
  ];
  if (date) parts.push("Date souhaitée : " + date);
  parts.push("", "Merci de me confirmer la disponibilité et le tarif final.");
  return parts.join("\n");
}

function setBookingLinks() {
  const chosen = CONFIG.prices[currentVehicle];
  const exterior = $("#price-exterior");
  const full = $("#price-full");
  if (exterior) exterior.textContent = chosen.exterior;
  if (full) full.textContent = chosen.full;
  $("#book-exterior").href = whatsappLink(bookingMessage("Lavage extérieur", chosen.label, chosen.exterior));
  $("#book-full").href = whatsappLink(bookingMessage("Intérieur + Extérieur", chosen.label, chosen.full));
  $("#book-deep").href = whatsappLink(bookingMessage("Nettoyage approfondi", chosen.label, null));
}

function configureHeaderAndMenu() {
  const header = $("#site-header");
  const menuButton = $("#menu-toggle");
  const menu = $("#mobile-nav");

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    menu.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    if (open) menu.removeAttribute("inert");
    else menu.setAttribute("inert", "");
  }

  menuButton.addEventListener("click", () => setMenu(!menu.classList.contains("open")));
  $$("#mobile-nav a").forEach(link => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && menu.classList.contains("open")) setMenu(false);
  });

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 50);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

function configurePrices() {
  $$(".vehicle-btn").forEach(button => {
    button.addEventListener("click", () => {
      currentVehicle = button.dataset.vehicle;
      $$(".vehicle-btn").forEach(tab => {
        const active = tab === button;
        tab.classList.toggle("active", active);
        tab.setAttribute("aria-pressed", String(active));
      });
      setBookingLinks();
      $$(".price-num").forEach(el => {
        el.classList.remove("bump");
        void el.offsetWidth;
        el.classList.add("bump");
        window.setTimeout(() => el.classList.remove("bump"), 300);
      });
      const vehicleSelect = $("#vehicle");
      if (vehicleSelect) vehicleSelect.value = CONFIG.prices[currentVehicle].label;
    });
  });
  setBookingLinks();
}

function configureBooking() {
  const form = $("#booking-form");
  const dateInput = $("#date");
  if (dateInput) {
    const local = new Date();
    const today = new Date(local.getTime() - local.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = today;
  }
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const vehicle = $("#vehicle").value;
    const service = $("#service").value;
    const quartier = $("#quartier").value.trim();
    const date = $("#date").value;
    if (!quartier) {
      $("#quartier").focus();
      return;
    }
    const category = vehicle.startsWith("SUV") ? "suv" : "citadine";
    const prices = CONFIG.prices[category];
    const price = service === "Lavage extérieur" ? prices.exterior
      : service === "Intérieur + Extérieur" ? prices.full : null;
    const url = whatsappLink(bookingMessage(service, vehicle, price, quartier, date));
    // Navigation (instead of a popup) works reliably in mobile Safari and installed WhatsApp.
    window.location.assign(url);
  });

  const general = whatsappLink("Bonjour ALLO LAVAGE, je souhaite me renseigner sur un lavage à domicile à Casablanca.");
  $("#floating-wa").href = general;
  $("#footer-whatsapp").href = general;
}

function configureReveals() {
  const elements = $$(".reveal");
  if (!("IntersectionObserver" in window) || reducedMotion) {
    elements.forEach(el => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: .11, rootMargin: "0px 0px -30px 0px" });
  elements.forEach(el => observer.observe(el));
}

function configureScrollVisuals() {
  const meter = $("#scroll-meter");
  const hero = $("#hero-photo");
  const feature = $("#feature-image-bg");
  let ticking = false;
  const update = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    meter.style.transform = "scaleX(" + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ")";
    if (reducedMotion) return;
    const sy = window.scrollY;
    if (sy < window.innerHeight * 1.3) hero.style.transform = "scale(" + (1.04 + sy * .00008) + ") translateY(" + sy * .09 + "px)";
    const bounds = feature.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
      const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height);
      feature.style.transform = "scale(1.08) translateY(" + ((progress - .5) * 45) + "px)";
    }
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

function configurePointerEffects() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!finePointer || reducedMotion) return;
  const glow = $("#cursor-glow");
  let x = -500, y = -500, gx = x, gy = y, visible = false;
  document.addEventListener("mousemove", e => {
    x = e.clientX; y = e.clientY;
    if (!visible) { visible = true; glow.style.opacity = "1"; }
  }, { passive: true });
  document.addEventListener("mouseleave", () => { glow.style.opacity = "0"; visible = false; });
  function animateGlow() {
    gx += (x - gx) * .13;
    gy += (y - gy) * .13;
    glow.style.left = gx + "px";
    glow.style.top = gy + "px";
    requestAnimationFrame(animateGlow);
  }
  animateGlow();
  $$(".tilt-card").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - .5;
      const py = (e.clientY - r.top) / r.height - .5;
      card.style.transform = "perspective(900px) rotateY(" + (px * 3) + "deg) rotateX(" + (-py * 3) + "deg) translateY(-7px)";
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  $("#year").textContent = new Date().getFullYear();
  configureHeaderAndMenu();
  configurePrices();
  configureBooking();
  configureReveals();
  configureScrollVisuals();
  configurePointerEffects();
});