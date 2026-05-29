# Controllers

Controllers are API entrypoints for HTTP routes, serverless functions, or future Express handlers.

Rules:

- Parse request parameters and body data.
- Call services, not repositories directly.
- Return response objects and HTTP status codes.
- Do not contain Supabase query logic.

Current files:

- `message.controller.js`
- `admin.controller.js`

Planned files:

- `feed.controller.js`
- `advocate.controller.js`
- `appointment.controller.js`
- `ai.controller.js`
