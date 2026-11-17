# SpecPilot Pro

**Free, open-source Software Project Blueprint & Hiring Studio for NextGen Tech Solutions.**

**Live tool:** https://www.nextgentechdev.com/specpilot

[![CI](https://github.com/rajachanna/SpecPilot-Pro/actions/workflows/ci.yml/badge.svg)](https://github.com/rajachanna/SpecPilot-Pro/actions/workflows/ci.yml)

> Client-side, deterministic templates and rules. No remote AI model or automated quote generation. This does not promise leads, sales or rankings.

## Purpose

Turn a vague request for an MT5 trading bot, AI agent, web app, SaaS portal, API integration, ecommerce automation, mobile app, or voice receptionist into a useful starting scope **before** involving a developer.

## Working features

- Eight industry-specific categories with capability pickers and external integration selections.
- Four-step editable wizard: business need → must-have features → technical constraints → blueprint.
- Technical acceptance tests and risks specific to the chosen category.
- Scope readiness indicator, transparent custom complexity signal and unresolved discovery questions.
- Free Markdown, JSON and browser Print/Save PDF exports.
- Explicit, consent-first handoff to NextGen Tech Solutions' live inquiry form; no automatic POST requests.
- Public, static hosting without an external API or account.

## Architecture

- src/templates.js — eight domain catalogs with concrete risk and acceptance criteria
- src/core.js — pure normalization, validation, readiness/complexity, blueprint and Markdown export
- src/app.js — accessible browser wizard, controlled selections, downloads and optional inquiry handoff
- src/index.html and src/styles.css — responsive, indexable application shell
- tests — Node built-in deterministic unit tests
- .github/workflows/ci.yml — syntax, unit and static checks

## Local execution

Node 22+ recommended. No npm packages required:

```bash
npm test
npm run check
python -m http.server 8000
```

Open http://localhost:8000/src/ . The browser needs an HTTP server because ES modules generally cannot import dependencies from file://.

## Privacy

All draft input stays in your browser until you choose the quote handoff. The optional handoff stores a short summary in same-origin sessionStorage and opens the website contact form. The contact form still requires a separate explicit submit. No external model calls are made. See [SECURITY.md](SECURITY.md).

## Calculations and limitations

Readiness is the share of ten scoping fields answered; complexity is a transparent capped rule score based on requested features, integrations and stated constraints. These are **informational signals** only, not calibrated predictions, prices, professional estimates or deployment guarantees. Recommended tests and delivery phases must be reviewed and accepted for each client project.

## Testing

```bash
node --test tests/*.test.js
node --check src/app.js
```

Use real user feedback and verified inquiries to measure impact. GitHub repositories, stars or views alone are not paid-client outcomes.

## License

MIT · © 2026 NextGen Tech Solutions.
