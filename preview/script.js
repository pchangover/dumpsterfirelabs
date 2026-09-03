const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

document.querySelectorAll("[data-current-year]").forEach((year) => {
  year.textContent = new Date().getFullYear();
});

const filterButtons = document.querySelectorAll("[data-filter]");
const galleryCards = document.querySelectorAll("[data-category]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isActive = item === button;
      item.classList.toggle("active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });

    galleryCards.forEach((card) => {
      const shouldShow = selectedFilter === "all" || card.dataset.category === selectedFilter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

const lightbox = document.querySelector("#lightbox");

if (lightbox) {
  const lightboxImage = lightbox.querySelector("img");
  const lightboxCaption = lightbox.querySelector("p");
  const closeButton = lightbox.querySelector(".lightbox-close");

  document.querySelectorAll("[data-lightbox]").forEach((button) => {
    button.addEventListener("click", () => {
      const sourceImage = button.querySelector("img");
      lightboxImage.src = button.dataset.lightbox;
      lightboxImage.alt = sourceImage ? sourceImage.alt : "Enlarged project photo";
      lightboxCaption.textContent = button.dataset.caption || "";
      lightbox.showModal();
    });
  });

  closeButton.addEventListener("click", () => lightbox.close());

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      const bounds = lightbox.getBoundingClientRect();
      const clickedInside = event.clientX >= bounds.left && event.clientX <= bounds.right && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      if (!clickedInside) lightbox.close();
    }
  });
}

const binderForm = document.querySelector("#binder-order-form");
const fileInputs = document.querySelectorAll(".reference-image-input");
const fileList = document.querySelector("#file-list");
const fileError = document.querySelector("#file-error");
const placementInputs = document.querySelectorAll(".placement-input");
const maxUploadBytes = 10 * 1024 * 1024;

function updateFileSummary() {
  if (!fileInputs.length || !fileList || !fileError) return true;

  const files = Array.from(fileInputs).flatMap((input) => Array.from(input.files || []));
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);

  fileList.textContent = files.length
    ? files.map((file) => file.name).join(" · ")
    : "No files selected";

  const isTooLarge = totalBytes > maxUploadBytes;
  fileError.hidden = !isTooLarge;
  fileError.textContent = isTooLarge
    ? "Those files total more than 10 MB. Please remove one or use smaller images."
    : "";
  fileInputs[0].setCustomValidity(isTooLarge ? "Reference images must total 10 MB or less." : "");
  return !isTooLarge;
}

fileInputs.forEach((input) => input.addEventListener("change", updateFileSummary));

function validatePlacements() {
  if (!placementInputs.length) return true;
  const hasPlacement = Array.from(placementInputs).some((input) => input.checked);
  placementInputs[0].setCustomValidity(hasPlacement ? "" : "Choose at least one artwork location.");
  return hasPlacement;
}

placementInputs.forEach((input) => {
  input.addEventListener("change", validatePlacements);
});

if (binderForm) {
  binderForm.addEventListener("submit", (event) => {
    const filesAreValid = updateFileSummary();
    const placementsAreValid = validatePlacements();

    if (!filesAreValid || !placementsAreValid) {
      event.preventDefault();
      binderForm.reportValidity();
    }
  });
}
