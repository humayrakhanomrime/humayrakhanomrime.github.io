# Humayra Khanom Rime

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/GitHub_Pages-deployed-222?logo=github" alt="GitHub Pages" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

<p align="center">Personal academic portfolio for <strong>Most Humayra Khanom Rime</strong>.</p>

<p align="center">Built with Next.js (static export) and Tailwind CSS. Deployed via GitHub Pages with GitHub Actions.</p>

## 💻 Local Development

```bash
npm install
npm run dev
```

## 🛠️ Build & Preview

```bash
npm run build
npx serve out
```

## 🌐 Deployment

This site is built for a **user site** (served at `https://<username>.github.io/`), so no `basePath` is needed.

1. Create a public repo named exactly `<username>.github.io` (e.g. `humayrakhanomrime.github.io`).
2. Push this project to its `main` branch:
   ```bash
   git remote add origin git@github.com:<username>/<username>.github.io.git
   git push -u origin main
   ```
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the static export (`out/`) and publishes it. The site goes live at `https://<username>.github.io/`.

## 📄 License

Released under the [MIT License](LICENSE.md). © 2026 Humayra Khanom Rime.
