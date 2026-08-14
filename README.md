# Portfolio — George Murphy

This repository is a static, GitHub Pages–friendly portfolio site. It uses only static HTML, CSS, and JavaScript and is ready to publish as a user or project site.

Quick local preview

```bash
# serve from the repo root
python3 -m http.server 8001
# then visit http://localhost:8001
```

Deploy to GitHub Pages

1. Keep the `CNAME` file at the repo root if you use a custom domain.
2. Commit and push the repository to GitHub (example uses `main`):

```bash
git add .
git commit -m "Publish site"
git push origin main
```

3. In your GitHub repo: Settings → Pages → Source → choose `main` branch, `/ (root)`, then Save. The site will publish within a few minutes.

Notes

- All links are relative; assets live in `/assets` and images in `/images`.
- If you prefer a dedicated `gh-pages` branch, push the built site to that branch and select it in Pages settings.
- Ensure your DNS is configured correctly when using a custom domain (A records or ALIAS) and that the `CNAME` file contains the domain.

If you want I can also add a small GitHub Actions workflow to automatically publish from `main`.
