# Ferry Ticket Booking System — Project Guidelines

## Tech Stack

- **Frontend**: Vue 3 (Composition API), Pinia, Vue Router, Axios, Vite
- **Backend**: Node.js, Express
- **Styling**: CSS (src/style.css — global), scoped CSS in each `.vue` file

## Project Structure

```
src/
  components/   # Reusable UI components (dumb/presentational)
  views/        # Page-level components mapped to routes
  stores/       # Pinia stores — one store per domain (e.g., booking.js)
  services/     # API calls only — no business logic here (e.g., api.js)
  router/       # Route definitions only
  i18n.js       # Internationalization config
```

- **One component per file**, named clearly by purpose (e.g., `TicketCard.vue`, not `Card.vue`)
- **Views** = pages; **Components** = reusable pieces used inside views
- New features go in their own domain folder if complex (e.g., `src/features/booking/`)

## Vue 3 Conventions

- Always use **Composition API** with `<script setup>` syntax
- Use `defineProps` and `defineEmits` — never mutate props directly
- Keep template logic minimal — extract computed/methods into `<script setup>`
- Emit events upward; don't let child components call store directly unless necessary
- Component names: **PascalCase** (`TicketCard.vue`), events: **kebab-case** (`update:modelValue`)

## Pinia Store Rules

- One store per domain (`booking.js`, not one giant store)
- Use **Setup Store** style (same pattern as existing `booking.js`)
- Never call API directly from a store — call `services/` functions instead
- Store holds **state only** — side effects belong in composables or services

## API Service Rules (`src/services/api.js`)

- All HTTP calls go through `src/services/api.js` — never use `axios` directly in components
- Each service function throws errors up to the caller — never swallow silently
- Use `import.meta.env.VITE_*` for environment variables — never hardcode URLs or keys

## Express Backend (`server.js`)

- Validate all request inputs before processing — never trust raw `req.body` / `req.params`
- Use `process.env.PORT` — never hardcode ports
- CORS is already configured — don't widen it unnecessarily
- When adding routes, group them by resource (e.g., `/api/tickets`, `/api/bookings`)
- Return consistent JSON: `{ data: ... }` for success, `{ error: "message" }` for errors

## Security

- API keys and secrets go in `.env` files only — never commit them
- Sanitize search filter inputs before passing to queries
- Don't expose stack traces or internal error details in API responses

## Commands

```bash
npm run dev       # Start Vite dev server (frontend)
node server.js    # Start Express backend on port 8000
npm run build     # Production build
npm run lint      # ESLint (src/**/*.js, *.vue)
```

> General coding standards (naming, DRY, SRP, readability) apply from user-level instructions.
