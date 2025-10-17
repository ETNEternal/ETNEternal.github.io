# Eternal Website — Content Guide

This repo powers the Eternal website (GitHub Pages). This guide shows how to update content fast without touching layout code.

## 1) Update home page announcements

- File: `data/announcements.json`
- Each entry supports: `id`, `type`, `title`, `date` (YYYY-MM-DD), `image`, `link`, `summary`.
- Types are free text, but the UI has badges for common ones: `Jersey`, `Roster`, `Creator`, `Tournament`.
- Images: add to `images/announcements/` and reference the relative path (e.g., `images/announcements/jersey-drop.png`).

Example:

```json
{
  "id": "jersey-2025-drop",
  "type": "Jersey",
  "title": "2025 Eternal Jersey Drop",
  "date": "2025-10-10",
  "image": "images/announcements/jersey-drop.png",
  "link": "#",
  "summary": "Our new jerseys are live. Limited quantities."
}
```

The list auto-sorts by `date` (newest first) and renders on the home page.

## 2) About Us page

- File: `about.html`
- Contains our History, Mission, Vision, and Leadership Team grid linking to individual pages.
- Replace any placeholder images or add new ones under `images/`.

## 3) Players & Creators page

- File: `players-creators.html`
- Two sections ready for roster cards. Add markup or wire up JSON later if you want this dynamic too.

## 4) Individual people pages

- Folder: `people/`
- Pages created: `pika.html`, `electro.html`, `eros.html`, `royale.html`, `archer.html`.
- Each page includes a banner, role, and social icons. Replace `#` links with real profile URLs.

To add a new person, duplicate a file (e.g., `pika.html`) and update:

- `<title>`, `<h2>`, role text
- Social links
- Banner and avatar images

## 5) Header links

- All pages share the same header: About Us, Players & Creators, centered logo, and icons for Discord, Shop, Twitter, Instagram, YouTube.
- Update the Shop/YouTube URLs in each page header when you have them.

## 6) Styling

- Global styles: `css/main.css`
- Announcements grid/cards styles live near the bottom of the file. Adjust colors/sizing as needed.

## 7) Local testing

Open `index.html` directly in a browser. For JSON fetch to work locally on some browsers, use a tiny web server:

```sh
# Python 3
python3 -m http.server 8000
# then open http://localhost:8000
```

On GitHub Pages the JSON loads automatically.

## Notes

- If images don’t show, ensure the file paths match and the images exist in the repo.
- If you want us to wire Players/Creators from JSON too, we can add `data/players.json` and `data/creators.json` with matching render code.
