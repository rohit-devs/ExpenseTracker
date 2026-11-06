# Finora AI — Smart Expense Tracker

A privacy-first personal expense tracker: dashboard, transaction management with
search/sort/filter, category analytics, document uploads, and AI-style insights.
All data stays in your browser (LocalStorage) — no account, no server, no tracking.

![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JS](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- **Dashboard** — income, spending, remaining budget, savings goal at a glance
- **Transaction manager** — add expenses manually, search, sort, filter by category
- **CSV import** — bulk-upload bank/statement CSV files
- **AI category detection** — auto-classifies merchants (Food, Transport, Bills, ...)
- **Analytics** — category breakdown and monthly saving recommendations
- **Document center** — store statements, receipts and screenshots (demo, local only)
- **Financial setup** — income, budget, savings goal with safe-daily-spend calculation
- **Dark / light theme** toggle
- **100% local** — LocalStorage only; "Local Demo Mode" badge in the sidebar
<img width="1917" height="985" alt="image" src="https://github.com/user-attachments/assets/ad1d7bc2-ca49-412e-9be5-23e295da7320" />
<img width="1917" height="982" alt="image" src="https://github.com/user-attachments/assets/67a97d44-1d7f-4f2a-b5db-066e3958f7e1" />
<img width="1917" height="976" alt="image" src="https://github.com/user-attachments/assets/af0d06c2-9bd5-43ea-bf6d-4c32910fc6e0" />


## 🚀 Getting Started

No build step. It's a static site:

```bash
# Option 1: open index.html in a browser

# Option 2: serve locally (recommended)
npx serve .
# or
python -m http.server 8000
```

## 📁 Project Structure

```
expensetracker/
├── index.html      # App markup (all screens)
├── style.css       # Theme + layout styles
├── script.js       # App logic, storage, CSV parsing, insights
├── README.md
├── LICENSE
└── .gitignore
```

## 🌐 Deploy on GitHub Pages

1. Push this repo to GitHub.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `root` → Save.**
3. Live at `https://<username>.github.io/<repo-name>/`.

## 🧭 Roadmap

- [ ] Bar/line charts for monthly trends
- [ ] Export transactions to CSV/JSON
- [ ] Recurring expense detection
- [ ] Budget alerts (toast + email-style notification)
- [ ] PWA support (offline, installable)

## ⚠️ Disclaimer

Demo project for learning. Financial data is stored only in your browser —
clearing site data deletes it. Not financial advice.

## 📄 License

MIT — see [LICENSE](LICENSE).
# ExpenseTracker
