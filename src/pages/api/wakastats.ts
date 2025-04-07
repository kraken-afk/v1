import type { APIRoute } from 'astro';
import { extractWakaTimeStats } from '../../libs/extractWakaTimeStats';

const endpoint =
  'https://raw.githubusercontent.com/kraken-afk/kraken-afk/refs/heads/main/README.md';

export const GET: APIRoute = async () => {
  const response = await fetch(endpoint);

  if (response.status !== 200) {
    return new Response('Something went error', { status: response.status });
  }
  const markdown = await response.text();
  const stats = extractWakaTimeStats(markdown);

  if (!stats) {
    return new Response('Cannot extract wakatime stats', { status: 500 });
  }
  return new Response(JSON.stringify(stats), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=43200',
    },
  });
};
