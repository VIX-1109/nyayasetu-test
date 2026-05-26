# Deployment Notes

NyayaSetu's web app is now a Next.js app inside `frontend/`.

If the landing page appears as plain HTML with no styling, the CSS bundle is not being served. Usually this means the app is being opened from the wrong place, an old server is still running, or Vercel is pointed at the old CRA/static output.

Use one of these correct paths:

- Local dev: run `npm run dev` inside `frontend`, then open the shown localhost URL.
- Vercel (project `frontend`): connect the GitHub repo and keep **Root Directory** as repo root (`.`). The root `vercel.json` builds inside `frontend/` and copies `.next` to the repo root so Vercel can find `routes-manifest.json`.
- If you set **Root Directory** to `frontend` in Vercel instead, remove the `cd frontend &&` prefixes from `vercel.json` (or delete root `vercel.json` and use defaults).
- Deploy from `frontend/` for CLI: `npx vercel deploy --prod` (do not use the `emergent` project at repo root unless you intend to).

Do not deploy the old root `build/` folder. It is not the current app.
