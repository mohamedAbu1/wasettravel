# WasetTravel

WasetTravel is a multilingual Egypt travel platform built with Next.js App Router. It provides curated trips, destination browsing, bookings, reviews, customer messaging, and an admin workspace.

## Local development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The default storefront is available at `/en`; supported locales are `en`, `de`, `es`, `fr`, `it`, and `zh`.

## Quality checks

```bash
npm run lint
npm run i18n:check
npm run build
```

## Deployment

Configure the required database, authentication, email, and storage environment variables in the deployment platform. Never commit `.env` or production secrets. After deployment, verify `/en`, `/robots.txt`, `/sitemap.xml`, and `/google49366a773d42ea4a.html`.
