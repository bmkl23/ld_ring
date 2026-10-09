export const dynamic = 'force-dynamic';
const BASE = process.env.GAME_API_BASE || 'http://3.110.222.67:8000';

// GET /api/initial-state?role=player|computer  ->  GET {BASE}/mighty-ring/initial-state/{role}
export async function GET(req) {
  const q = new URL(req.url).searchParams.get('role');
  const role = q === 'computer' ? 'computer' : 'player';
  const get = (path) => fetch(BASE + path, { cache: 'no-store' });
  try {
    let r = await get('/mighty-ring/initial-state/' + role);
    // older backend without the role-specific route: fall back to the original endpoint for the player side
    if ((r.status === 404 || r.status === 405) && role === 'player') r = await get('/mighty-ring/initial-state');
    return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return Response.json({ error: 'upstream unreachable' }, { status: 502 });
  }
}
