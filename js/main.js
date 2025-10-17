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

  // Render announcements on home page
  const announcementsGrid = document.getElementById("announcements-grid");
  if (announcementsGrid) {
    fetch("data/announcements.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((items) => {
        announcementsGrid.innerHTML = items
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map(
            (item) => `
            <article class="announcement-card" tabindex="0">
              <a href="${item.link}" class="announcement-link" aria-label="${
              item.title
            }">
                <img src="${item.image}" alt="${
              item.title
            }" class="announcement-image" />
                <div class="announcement-content">
                  <span class="badge badge-${item.type.toLowerCase()}">${
              item.type
            }</span>
                  <h3 class="announcement-title">${item.title}</h3>
                  <time class="announcement-date" datetime="${
                    item.date
                  }">${new Date(item.date).toLocaleDateString()}</time>
                  <p class="announcement-summary">${item.summary}</p>
                </div>
              </a>
            </article>
          `
          )
          .join("");

        // Fallback image if an announcement image is missing
        announcementsGrid
          .querySelectorAll(".announcement-image")
          .forEach((img) => {
            img.addEventListener("error", () => {
              img.src = "images/LogoBackdropFinal.webp";
            });
          });
      })
      .catch((err) => {
        console.error("Failed to load announcements:", err);
        announcementsGrid.innerHTML = `<p>Announcements will appear here soon.</p>`;
      });
  }

  // Socials dropdown toggle
  const dropdown = document.getElementById("socials-dropdown");
  if (dropdown) {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const menu = dropdown.querySelector(".dropdown-menu");
    if (toggle && menu) {
      toggle.addEventListener("click", (e) => {
        e.preventDefault();
        const isOpen = dropdown.classList.contains("open");
        document
          .querySelectorAll(".dropdown.open")
          .forEach((d) => d.classList.remove("open"));
        dropdown.classList.toggle("open", !isOpen);
        toggle.setAttribute("aria-expanded", String(!isOpen));
      });

      document.addEventListener("click", (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    }
  }
});
