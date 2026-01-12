const getProfileIdFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  const fromQuery = (params.get("user") || params.get("id") || "").trim();
  if (fromQuery) return fromQuery;

  const fromHash = (window.location.hash || "").replace(/^#/, "").trim();
  return fromHash;
};

const normalizeId = (value) =>
  (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/[^a-z0-9_-]/g, "");

const iconForPlatform = (platform) => {
  const key = normalizeId(platform);

  if (key === "x" || key === "twitter" || key === "xtwitter") {
    return { iconClass: "fab fa-x-twitter", label: "X" };
  }
  if (key === "youtube")
    return { iconClass: "fab fa-youtube", label: "YouTube" };
  if (key === "twitch") return { iconClass: "fab fa-twitch", label: "Twitch" };
  if (key === "instagram")
    return { iconClass: "fab fa-instagram", label: "Instagram" };
  if (key === "discord")
    return { iconClass: "fab fa-discord", label: "Discord" };
  if (key === "tiktok") return { iconClass: "fab fa-tiktok", label: "TikTok" };

  return { iconClass: "fas fa-link", label: platform };
};

const isExternalUrl = (url) => /^https?:\/\//i.test(url || "");

const profileToWebpUrl = (url) => {
  const raw = (url || "").toString().trim();
  if (!raw) return "";
  if (isExternalUrl(raw)) return "";

  const match = raw.match(/^(.*)\.(png|jpe?g)$/i);
  if (!match) return "";

  return `${match[1]}.webp`;
};

const profileToAvifUrl = (url) => {
  const raw = (url || "").toString().trim();
  if (!raw) return "";
  if (isExternalUrl(raw)) return "";

  const match = raw.match(/^(.*)\.(png|jpe?g)$/i);
  if (!match) return "";

  return `${match[1]}.avif`;
};

const setOptimizedImgSrc = (imgEl, url) => {
  if (!imgEl) return;

  const original = (url || "").toString();
  const picture = imgEl.closest("picture");
  const avifSource = picture?.querySelector('source[type="image/avif"]');
  const webpSource = picture?.querySelector('source[type="image/webp"]');

  const avif = profileToAvifUrl(original);
  const webp = profileToWebpUrl(original);

  imgEl.onerror = () => {
    imgEl.onerror = null;
    if (avifSource) avifSource.srcset = "";
    if (webpSource) webpSource.srcset = "";
    imgEl.src = "images/etn-logo-transparent.png";
  };

  if (avifSource) avifSource.srcset = avif;
  if (webpSource) webpSource.srcset = webp;
  imgEl.src = original;
};

const toAbsoluteAssetUrl = (value) => {
  const url = (value || "").toString().trim();
  if (!url) return url;

  if (isExternalUrl(url)) return url;

  // For local assets, the JSON should use paths relative to site root
  // (e.g. "images/pika.png").
  return url;
};

const renderProfile = (person) => {
  const nameEl = document.getElementById("person-name");
  const imgEl = document.getElementById("person-image");
  const roleEl = document.getElementById("person-role");
  const socialsEl = document.getElementById("person-socials");

  if (nameEl) nameEl.textContent = person.name || "Profile";
  if (roleEl) roleEl.textContent = person.role || "";

  if (imgEl) {
    const resolved =
      toAbsoluteAssetUrl(person.image) || "images/etn-logo-transparent.png";
    setOptimizedImgSrc(imgEl, resolved);
    imgEl.alt = person.name || "Profile";
  }

  document.title = `${person.name || "Profile"} — Eternal`;

  if (socialsEl) {
    socialsEl.innerHTML = "";

    const socials = person.socials || {};
    Object.entries(socials).forEach(([platform, url]) => {
      if (!url) return;

      const { iconClass, label } = iconForPlatform(platform);
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "social-small-icon";
      a.title = label;
      a.setAttribute("aria-label", label);

      const i = document.createElement("i");
      i.className = iconClass;
      a.appendChild(i);

      socialsEl.appendChild(a);
    });
  }
};

const renderNotFound = (id) => {
  const nameEl = document.getElementById("person-name");
  const roleEl = document.getElementById("person-role");
  const socialsEl = document.getElementById("person-socials");

  if (nameEl) nameEl.textContent = "Profile not found";
  if (roleEl)
    roleEl.textContent = id
      ? `No profile found for: ${id}`
      : "No profile specified.";
  if (socialsEl) socialsEl.innerHTML = "";

  document.title = "Profile not found — Eternal";
};

document.addEventListener("DOMContentLoaded", async () => {
  const idRaw = getProfileIdFromUrl();
  const id = normalizeId(idRaw);

  try {
    const loadPeople = async (path) => {
      const res = await fetch(path, { cache: "no-store" });
      if (!res.ok) {
        // Allow optional files (e.g., legacy configs)
        if (res.status === 404) return [];
        throw new Error(`Failed to load ${path} (${res.status})`);
      }
      const data = await res.json();
      return Array.isArray(data?.people) ? data.people : [];
    };

    const [creators, staff] = await Promise.all([
      loadPeople("data/creators.json"),
      loadPeople("data/staff.json"),
    ]);

    const people = [...creators, ...staff];
    const match = people.find((p) => normalizeId(p?.id) === id);

    if (!match) {
      renderNotFound(idRaw);
      return;
    }

    renderProfile(match);
  } catch (err) {
    console.error(err);
    renderNotFound(idRaw);
  }
});
