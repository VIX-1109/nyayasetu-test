# Controllers

Controllers are the future API entrypoints for HTTP routes, serverless functions, or Express handlers.

Rules:

- Parse request parameters and body data.
- Call services, not repositories directly.
- Return response objects and HTTP status codes.
- Do not contain Supabase query logic.

Example future files:

- `feed.controller.js`
- `advocate.controller.js`
- `appointment.controller.js`
- `message.controller.js`
- `ai.controller.js`
