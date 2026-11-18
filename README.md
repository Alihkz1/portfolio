# Ali Hosseinkhani — Portfolio

A personal portfolio built with HTML, CSS, and vanilla JavaScript. A portrait-led landing page, a live collection of my public GitHub repositories, and direct links to my social profiles.

**[Visit the live portfolio →](https://portfolio-henna-one-60.vercel.app/)**

## Preview

<img src="assets/ali-portrait.jpg" alt="Ali Hosseinkhani" width="180">

The interface uses a night-sky palette, glass-style project cards, a background moon and stars, and subtle animations. The layout is responsive and written in English with left-to-right text.

## Features

- **Live GitHub projects:** fetches my public repositories automatically, including forks and archived projects.
- **Search and discovery:** search repository names, descriptions, languages, and topics; filter by language; sort by recent activity, stars, or name.
- **Offline fallback:** an embedded repository snapshot keeps projects visible when GitHub is unreachable or rate-limited.
- **Motion:** scroll reveals, gently twinkling stars, and hover interactions, with support for reduced-motion preferences.
- **Accessibility:** semantic sections, descriptive image text, keyboard focus indicators, a skip link, and status messages for repository updates.
- **Direct contact:** GitHub, LinkedIn, Instagram, and Telegram links.
- **No build step:** no framework, package installation, database, or backend required.

## Built with

| Technology | Purpose |
| --- | --- |
| HTML5 | Page structure and embedded repository snapshot |
| CSS3 | Responsive layouts, typography, and visual effects |
| Vanilla JavaScript | Repository discovery, filters, and scroll animations |
| GitHub REST API | Public repository data |
| Vercel | Static hosting |

## Run locally

```bash
git clone https://github.com/Alihkz1/portfolio.git
cd portfolio
```

Open `index.html` in a browser. No dependency installation is needed.

An internet connection is needed to refresh the GitHub collection. The embedded snapshot remains available without a connection; JavaScript enables search, filtering, and refresh.

## Project structure

```text
portfolio/
├── assets/
│   └── ali-portrait.jpg    # Profile photo
├── index.html             # Page content and repository snapshot
├── styles.css             # Base styles and responsive layouts
├── refinements.css        # Portrait design, larger typography, and refinements
├── projects.js            # GitHub API, pagination, search, filters, and sorting
├── motion.js              # Scroll reveals and reduced-motion handling
└── README.md
```

## How projects stay up to date

The page first displays the repository snapshot embedded in `index.html`. On each load, `projects.js` requests the latest collection from:

```text
GET https://api.github.com/users/alihkz1/repos?type=owner&sort=updated&per_page=100&page=1
```

It fetches additional pages as needed and updates the displayed collection only after the complete request sequence succeeds. Public repositories owned by the configured account are included, including forks and archives. No access token is required or stored.

If a request fails, times out, or reaches GitHub's public API rate limit, the current collection stays visible. The **Refresh** button retries the request. Live updates apply to the current page session; they do not rewrite the embedded snapshot in the source file.

## Customize

| Change | File |
| --- | --- |
| Name, introduction, contact links, and metadata | `index.html` |
| Profile photo | Replace `assets/ali-portrait.jpg` and update its alt text in `index.html` |
| Colors and base layout | `styles.css` |
| Night palette, moon, stars, and glass surfaces | `night.css` |
| Typography, portrait styling, and visual refinements | `refinements.css` |
| GitHub username | Update the `user` constant in `projects.js` |
| Saved repository collection | Update the cards and `github-repo-data` JSON in `index.html` |
| Scroll animation behavior | `motion.js` |

When changing the GitHub account, also update the saved repository collection and profile links in `index.html` so the initial and offline content matches the new account.

## Deployment

This repository is a static website. Serve the repository root, including `index.html`, all stylesheets, both JavaScript files, and the `assets` directory. No compilation or generated output directory is required.

The live deployment is hosted on **[Vercel](https://portfolio-henna-one-60.vercel.app/)**.

## Connect

- [GitHub — alihkz1](https://github.com/alihkz1)
- [LinkedIn — alihkz](https://www.linkedin.com/in/alihkz/)
- [Instagram — alihkz](https://www.instagram.com/alihkz/)
- [Telegram — alihkz](https://t.me/alihkz)
