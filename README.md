# Nader Abdelshahid — Portfolio

Source for [nnabdelshahid.github.io](https://nnabdelshahid.github.io), a static
portfolio and project-case-study site.

## Local development

No build step is required. Serve the repository root with a local HTTP server:

```bash
npx serve .
```

Then open the URL printed by the server. Avoid opening pages directly from the
filesystem because browser path and fetch behavior differs from GitHub Pages.

## Structure

- `index.html` — portfolio homepage
- `css/` and `js/` — shared styles and browser behavior
- `data/` — structured public profile content
- `resume/` — web resume
- `API-MongoQuery-Prompts/` — vendor-neutral Banking WorkBench case study
- `.github/workflows/` — repository validation and Pages automation

## Content and security

This is a public repository. Do not commit credentials, private customer or
employer information, internal URLs, private screenshots, or proprietary test
data. A client-side password prompt is never an access-control boundary; only
publish content that is safe for unrestricted public access.

## Validation

Before publishing, verify links and HTML, review the rendered site at desktop
and mobile widths, and scan the repository for secrets and internal names.
