# Realms of the Ring — Battle Board (Next.js)

    npm install
    npm run dev      # http://localhost:3000

Deploy: push to GitHub -> Import in Vercel (framework auto-detected: Next.js). No env vars required.
The game API (http://3.110.222.67:8000) is called server-side through /api/initial-state and /api/play,
so the https Vercel site never hits browser mixed-content blocking. Override with GAME_API_BASE if needed.

## Choosing a side
The role screen now drives the backend:
- `GET /api/initial-state?role=player|computer` -> `GET {GAME_API_BASE}/mighty-ring/initial-state/{role}`
  (the `player` role falls back to the old `/mighty-ring/initial-state` if the role route returns 404/405).
- `POST /api/play` body now includes `"player": "player" | "computer"` alongside `previous_state` and `movement`.
- "Play again" returns to the role screen so you can switch sides.
