import { readFile } from 'node:fs/promises';
import path from 'node:path';
import mysql, { type RowDataPacket } from 'mysql2/promise';
import nextEnv from '@next/env';

nextEnv.loadEnvConfig(process.cwd());

type TriggerInspection = RowDataPacket & {
  TRIGGER_NAME: string;
  EVENT_OBJECT_TABLE: string;
  ACTION_TIMING: string;
  EVENT_MANIPULATION: string;
  uses_current_definer: number;
};

function statementsFromSql(source: string): string[] {
  const statements: string[] = [];
  let delimiter = ';';
  let buffer = '';

  for (const line of source.split(/\r?\n/)) {
    const directive = line.trim().match(/^DELIMITER\s+(.+)$/i);
    if (directive) {
      delimiter = directive[1];
      continue;
    }
    if (!buffer && (line.trim() === '' || line.trim().startsWith('--'))) continue;
    buffer += `${line}\n`;
    if (line.trimEnd().endsWith(delimiter)) {
      statements.push(buffer.trim().slice(0, -delimiter.length).trim());
      buffer = '';
    }
  }
  if (buffer.trim()) throw new Error('Incomplete SQL statement in database/advanced_objects.sql.');
  return statements;
}

async function logTriggerDefiners(
  connection: mysql.Connection,
  stage: 'before' | 'after'
) {
  const [rows] = await connection.query<TriggerInspection[]>(`
    SELECT
      TRIGGER_NAME,
      EVENT_OBJECT_TABLE,
      ACTION_TIMING,
      EVENT_MANIPULATION,
      DEFINER = CURRENT_USER() AS uses_current_definer
    FROM information_schema.TRIGGERS
    WHERE TRIGGER_SCHEMA = DATABASE()
      AND EVENT_OBJECT_TABLE IN ('articles', 'team_members')
    ORDER BY EVENT_OBJECT_TABLE, TRIGGER_NAME
  `);

  if (!rows.length) {
    if (stage === 'after') {
      throw new Error('No article/team triggers were found after recreating database objects.');
    }
    console.log(`[database] ${stage}: no article/team triggers found.`);
    return;
  }

  console.log(
    `[database] ${stage} article/team triggers: ${rows
      .map(
        (row) =>
          `${row.EVENT_OBJECT_TABLE}.${row.TRIGGER_NAME} ` +
          `(${row.ACTION_TIMING} ${row.EVENT_MANIPULATION}, ` +
          `current definer: ${row.uses_current_definer === 1 ? 'yes' : 'no'})`
      )
      .join('; ')}`
  );

  if (
    stage === 'after' &&
    rows.some((row) => row.uses_current_definer !== 1)
  ) {
    throw new Error(
      'Recreated article/team triggers do not use the active database account as their definer.'
    );
  }
}

async function main() {
  const rawUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!rawUrl) throw new Error('DIRECT_URL or DATABASE_URL is required.');
  const url = new URL(rawUrl);
  // Prisma resolves sslcert relative to schema.prisma; use the same convention.
  const certificate = url.searchParams.get('sslcert');
  const tlsRequired = certificate || url.searchParams.get('sslaccept') === 'strict' ||
    url.searchParams.get('ssl-mode') === 'REQUIRED' || url.hostname.endsWith('.aivencloud.com');
  const ssl = tlsRequired ? {
    rejectUnauthorized: true,
    ...(certificate ? { ca: await readFile(path.resolve('prisma', certificate), 'utf8') } : {})
  } : undefined;
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ''),
    charset: 'utf8mb4',
    ssl
  });
  const sql = await readFile(path.join(process.cwd(), 'database', 'advanced_objects.sql'), 'utf8');
  try {
    await logTriggerDefiners(connection, 'before');
    for (const statement of statementsFromSql(sql)) await connection.query(statement);
    await logTriggerDefiners(connection, 'after');
    console.log('ACV views, routines, functions and triggers are installed.');
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
