# Deployment Notes

NyayaSetu's web app is a Next.js app inside `frontend/`.

If the landing page appears as plain HTML with no styling, the CSS bundle is not being served. Usually this means the app is being opened from the wrong folder, an old server is still running, or Vercel is pointed at the old root/static output.

## Correct Local Run

```bash
cd frontend
npm run dev
```

Open the localhost URL printed by Next.js.

## Correct Vercel Setup

For the Vercel project connected to GitHub:

- Root Directory: `frontend`
- Framework Preset: `Next.js`
- Install Command: default `npm install`
- Build Command: default `npm run build`
- Output Directory: default Next.js output

Do not add `cd frontend` overrides when the Vercel root directory is already set to `frontend`.

## Manual CLI Deploy

Run manual deploys from the frontend folder:

```bash
cd frontend
npx vercel deploy --prod
```

## Do Not Deploy

Do not deploy the old root `build/` folder. It is not the current app.

Do not deploy from the repository root unless the Vercel project is specifically configured for root-level monorepo commands.
