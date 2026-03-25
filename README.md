# Expense Tracker

A modern, minimal expense tracker built with vanilla HTML, CSS, and JavaScript.
<img width="1047" height="808" alt="Screenshot 2026-03-25 at 7 53 23 PM" src="https://github.com/user-attachments/assets/7ca3550e-abf4-4722-a7b0-37318f5ffad8" />


## Features

- Add expenses with description, amount, and category
- Persist expenses with `localStorage`
- Filter expenses by category
- Overview cards for total spend, monthly spend, and top category
- Delete individual expenses or clear all expenses

## Run locally

Open `index.html` in your browser, or run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy with GitHub Pages

This repo includes `.github/workflows/deploy-pages.yml` to auto-deploy on pushes to `main`.

1. Push this repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from **Actions**).

Your live app URL will be:

`https://<your-github-username>.github.io/<your-repo-name>/`
