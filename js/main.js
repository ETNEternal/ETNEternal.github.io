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
  const otherAnnouncementsGrid = document.getElementById(
    "other-announcements-grid"
  );

  if (announcementsGrid || otherAnnouncementsGrid) {
    const normalizeType = (type) =>
      (type || "general").toString().trim().toLowerCase();

    const formatDate = (value) => {
      if (!value) return "";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return "";

      const day = d.getDate();
      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const suffix = (() => {
        const j = day % 10;
        const k = day % 100;
        if (k >= 11 && k <= 13) return "th";
        if (j === 1) return "st";
        if (j === 2) return "nd";
        if (j === 3) return "rd";
        return "th";
      })();

      const monthName = monthNames[d.getMonth()];
      const year = d.getFullYear();
      return `${day}${suffix} ${monthName} ${year}`;
    };

    const renderJerseyFeature = (items) => {
      const jersey = items.find(
        (item) => normalizeType(item.type) === "jersey"
      );

      if (!jersey) {
        announcementsGrid.innerHTML =
          '<p class="announcement-empty">Jersey coming soon.</p>';
        return;
      }

      announcementsGrid.classList.add("jersey-only");

      const displayDate = formatDate(jersey.date);

      announcementsGrid.innerHTML = `
        <article class="jersey-feature" tabindex="0">
          <a href="${
            jersey.link
          }" target="_blank" rel="noopener noreferrer" class="jersey-link" aria-label="${
        jersey.title
      }">
            <div class="jersey-media">
              <img src="${jersey.image}" alt="${
        jersey.title
      }" class="jersey-image" />
            </div>
            <div class="jersey-content">
              <span class="badge badge-jersey">${jersey.type || "Jersey"}</span>
              <h3 class="jersey-title">${jersey.title}</h3>
              <time class="jersey-date" datetime="${
                jersey.date || ""
              }">${displayDate}</time>
              <p class="jersey-summary">${jersey.summary || ""}</p>
              <span class="jersey-cta">Shop the drop →</span>
            </div>
          </a>
        </article>
      `;

      const img = announcementsGrid.querySelector(".jersey-image");
      if (img) {
        img.addEventListener("error", () => {
          img.src = "images/LogoBackdropFinal.webp";
        });
      }
    };

    const renderOtherAnnouncements = (items) => {
      if (!otherAnnouncementsGrid) return;

      const filtered = items.filter(
        (item) => normalizeType(item.type) !== "jersey"
      );

      if (!filtered.length) {
        otherAnnouncementsGrid.innerHTML =
          '<p class="announcement-empty">More announcements coming soon.</p>';
        return;
      }

      otherAnnouncementsGrid.innerHTML = filtered
        .map((item) => {
          const itemType = normalizeType(item.type);
          const badgeClass = `badge-${itemType}`;
          const displayDate = formatDate(item.date);

          return `
            <article class="announcement-card" tabindex="0">
              <a href="${
                item.link
              }" target="_blank" rel="noopener noreferrer" class="announcement-link" aria-label="${
            item.title
          }">
                <img src="${item.image}" alt="${
            item.title
          }" class="announcement-image" />
                <div class="announcement-content">
                  <span class="badge ${badgeClass}">${
            item.type || "General"
          }</span>
                  <h3 class="announcement-title">${item.title}</h3>
                  <time class="announcement-date" datetime="${
                    item.date || ""
                  }">${displayDate}</time>
                  <p class="announcement-summary">${item.summary || ""}</p>
                </div>
              </a>
            </article>
          `;
        })
        .join("");

      otherAnnouncementsGrid
        .querySelectorAll(".announcement-image")
        .forEach((img) => {
          img.addEventListener("error", () => {
            img.src = "images/LogoBackdropFinal.webp";
          });
        });
    };

    fetch("data/announcements.json", { cache: "no-store" })
      .then((res) => res.json())
      .then((items) => {
        const sorted = items.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        if (announcementsGrid) {
          renderJerseyFeature(sorted);
        }
        if (otherAnnouncementsGrid) {
          renderOtherAnnouncements(sorted);
        }
      })
      .catch((err) => {
        console.error("Failed to load announcements:", err);
        if (announcementsGrid) {
          announcementsGrid.innerHTML = `<p>Announcements will appear here soon.</p>`;
        }
        if (otherAnnouncementsGrid) {
          otherAnnouncementsGrid.innerHTML = `<p>Announcements will appear here soon.</p>`;
        }
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
