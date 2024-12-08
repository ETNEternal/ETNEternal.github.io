// main.js
// Navigation hover effects
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("mouseover", () => {
    link.classList.add("pop-out");
  });
  link.addEventListener("mouseout", () => {
    link.classList.remove("pop-out");
  });
});

// Banner image fade in
window.addEventListener("load", () => {
  const bannerImage = document.getElementById("banner-image");
  if (bannerImage) {
    bannerImage.style.opacity = 0;
    bannerImage.style.transition = "opacity 2s";
    bannerImage.style.opacity = 1;
  }
});

// Footer appear //
document.addEventListener("mousemove", (event) => {
  const footer = document.querySelector(".custom-footer");
  const threshold = 250; // Pixels from the bottom of the viewport to trigger visibility
  const scrollThreshold = 0.9; // 90% scroll height to switch footer to static
  const scrollPosition = window.scrollY + window.innerHeight;
  const totalHeight = document.body.offsetHeight;

  if (!footer) return;

  // Check if user is near the bottom of the page
  const isNearBottom = scrollPosition / totalHeight >= scrollThreshold;

  if (isNearBottom) {
    // Prevent rapid toggling by setting only if not already static
    if (footer.style.position !== "static") {
      footer.style.position = "static";
      footer.classList.remove("visible"); // No animation for static
    }
  } else {
    // Prevent rapid toggling by setting only if not already fixed
    if (footer.style.position !== "fixed") {
      footer.style.position = "fixed";
    }

    // Handle visibility when footer is fixed
    const distanceFromBottom = window.innerHeight - event.clientY;

    if (distanceFromBottom < threshold) {
      footer.classList.add("visible");
    } else {
      footer.classList.remove("visible");
    }
  }
});

// Header Appear //

document.addEventListener("mousemove", (event) => {
  const header = document.querySelector(".header");

  if (!header) return;

  const threshold = 100; // Pixels from the top to trigger visibility
  const distanceFromTop = event.clientY;

  if (distanceFromTop < threshold) {
    header.classList.add("visible");
  } else {
    header.classList.remove("visible");
  }
});
