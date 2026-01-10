const loadPeopleData = async (path) => {
  const res = await fetch(path, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`);
  const data = await res.json();
  return Array.isArray(data?.people) ? data.people : [];
};

const escapeHtml = (value) =>
  (value ?? "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const renderCreatorsGrid = async () => {
  const grid = document.getElementById("creators-grid");
  if (!grid) return;

  try {
    const creators = await loadPeopleData("data/creators.json");
    if (!creators.length) return;

    const html = creators
      .map((p) => {
        const id = encodeURIComponent((p?.id || "").toString());
        const name = escapeHtml(p?.name || "");
        const img = escapeHtml(p?.image || "");

        return `
        <div class="profile">
          <img src="${img}" alt="${name}" width="140" height="140" />
          <a href="profile.html?user=${id}" class="profile-name">${name}</a>
          <div class="profile-role">Creator</div>
        </div>
      `;
      })
      .join("");

    grid.innerHTML = html;
  } catch (err) {
    console.error(err);
  }
};

const renderLeadershipTeam = async () => {
  const section = document.getElementById("leadership");
  if (!section) return;

  const anchor = section.querySelector("#leadership-grid");
  const container = anchor || section;

  try {
    const staff = await loadPeopleData("data/staff.json");
    if (!staff.length) return;

    const html = staff
      .map((p) => {
        const id = encodeURIComponent((p?.id || "").toString());
        const name = escapeHtml(p?.name || "");
        const role = escapeHtml(p?.role || "");
        const img = escapeHtml(p?.image || "");

        return `
        <div class="profile">
          <a href="profile.html?user=${id}">
            <img src="${img}" width="180" height="180" class="profile-img" alt="${name}" />
            <div class="profile-text">
              <h3>${name}</h3>
              <p>${role}</p>
            </div>
          </a>
        </div>
      `;
      })
      .join("");

    if (anchor) {
      anchor.innerHTML = html;
    } else {
      // Preserve the <h2> in the section, replace everything after it.
      const heading = section.querySelector("h2");
      if (!heading) return;

      // Remove everything after the heading
      while (heading.nextSibling) {
        heading.parentNode.removeChild(heading.nextSibling);
      }

      section.insertAdjacentHTML("beforeend", html);
    }
  } catch (err) {
    console.error(err);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  await Promise.all([renderCreatorsGrid(), renderLeadershipTeam()]);
});
