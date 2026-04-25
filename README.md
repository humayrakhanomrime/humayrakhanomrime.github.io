Personal academic portfolio for **Most Humayra Khanom Rime**.

Built with Next.js (static export) and Tailwind CSS. Deployed via GitHub Pages with GitHub Actions.

## Local Development

```bash
npm install
npm run dev
```

## Build & Preview

```bash
npm run build
npx serve out
```

## Deployment (`username.github.io`)

This site is built for a **user site** (served at `https://<username>.github.io/`), so no `basePath` is needed.

1. Create a public repo named exactly `<username>.github.io` (e.g. `humayrakhanomrime.github.io`).
2. Push this project to its `main` branch:
   ```bash
   git remote add origin git@github.com:<username>/<username>.github.io.git
   git push -u origin main
   ```
3. In **Settings → Pages**, set **Source** to **GitHub Actions**.
4. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the static export (`out/`) and publishes it. The site goes live at `https://<username>.github.io/`.
