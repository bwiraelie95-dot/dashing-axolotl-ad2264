import nextEnv from '@next/env';
import { spawnSync } from 'node:child_process';

nextEnv.loadEnvConfig(process.cwd(), true);
// Only manage this project's dedicated local database, never a remote database.
const database = process.env.DATABASE_URL ? new URL(process.env.DATABASE_URL) : null;
if (database && ['127.0.0.1', 'localhost'].includes(database.hostname) && database.port === '3307') {
  const result = spawnSync('bash', ['scripts/start-local-db.sh'], { stdio: 'inherit' });
  if (result.error) console.error(result.error.message);
  process.exit(result.status ?? 1);
}
