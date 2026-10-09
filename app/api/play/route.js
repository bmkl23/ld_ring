export const dynamic = 'force-dynamic';
const BASE = process.env.GAME_API_BASE || 'http://3.110.222.67:8000';

export async function POST(req) {
  try {
    const r = await fetch(BASE + '/mighty-ring/play', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: await req.text(),
      cache: 'no-store',
    });
    return new Response(await r.text(), { status: r.status, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return Response.json({ error: 'upstream unreachable' }, { status: 502 });
  }
}
