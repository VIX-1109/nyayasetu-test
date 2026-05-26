# Deployment Notes

NyayaSetu's web app is now a Next.js app inside `frontend/`.

If the landing page appears as plain HTML with no styling, the CSS bundle is not being served. Usually this means the app is being opened from the wrong place, an old server is still running, or Vercel is pointed at the old CRA/static output.

Use one of these correct paths:

- Local dev: run `npm run dev` inside `frontend`, then open the shown localhost URL.
- Vercel: set the project root directory to `frontend` in Vercel project settings, or keep the root `vercel.json` commands that run the frontend build.

Do not deploy the old root `build/` folder. It is not the current app.
