const rawUrl = process.env.DEPLOYMENT_URL ?? process.env.NEXT_PUBLIC_APP_URL;
if (!rawUrl) throw new Error('Set DEPLOYMENT_URL to the deployed ACV site URL.');

const healthUrl = new URL('/api/health', rawUrl).toString();
const response = await fetch(healthUrl, {
  headers: { Accept: 'application/json' },
  signal: AbortSignal.timeout(20_000)
});
const body = await response.json() as { status?: string; database?: string };

if (!response.ok || body.status !== 'ok' || body.database !== 'connected') {
  throw new Error(`Deployment health check failed (${response.status}): ${JSON.stringify(body)}`);
}

console.log(`[deployment] ${healthUrl} confirms that the application and database are reachable.`);
