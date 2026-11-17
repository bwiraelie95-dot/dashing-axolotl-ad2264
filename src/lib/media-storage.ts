import { getStore } from "@netlify/blobs";
import { mkdir, readFile, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
// Opt-in persistent local development storage. Production always uses Netlify Blobs.
const local = () =>
  process.env.ACV_LOCAL_MEDIA === "1" &&
  process.env.NODE_ENV !== "production" &&
  !process.env.NETLIFY;
const directory = path.join(process.cwd(), ".local-db", "media");
function file(key: string) {
  if (!/^[a-zA-Z0-9_.-]+$/.test(key) || key === "." || key === "..")
    throw new Error("Invalid media key");
  return path.join(directory, key);
}
export async function putMedia(
  key: string,
  bytes: ArrayBuffer,
  metadata: Record<string, string | number>,
) {
  if (!local())
    return getStore({ name: "acv-media", consistency: "strong" }).set(
      key,
      bytes,
      { metadata, onlyIfNew: true },
    );
  await mkdir(directory, { recursive: true, mode: 0o700 });
  await writeFile(file(key), Buffer.from(bytes), { flag: "wx", mode: 0o600 });
  await writeFile(file(key) + ".json", JSON.stringify(metadata), {
    flag: "wx",
    mode: 0o600,
  });
}
export async function readMedia(key: string) {
  if (!local())
    return getStore({
      name: "acv-media",
      consistency: "strong",
    }).getWithMetadata(key, { type: "blob", consistency: "strong" });
  try {
    const [bytes, meta] = await Promise.all([
      readFile(file(key)),
      readFile(file(key) + ".json", "utf8"),
    ]);
    const metadata = JSON.parse(meta);
    return {
      data: new Blob([bytes], { type: metadata.contentType }),
      metadata,
      etag: undefined,
    };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw e;
  }
}
export async function removeMedia(key: string) {
  if (!local())
    return getStore({ name: "acv-media", consistency: "strong" }).delete(key);
  await Promise.all(
    [file(key), file(key) + ".json"].map((name) =>
      unlink(name).catch((e) => {
        if (e.code !== "ENOENT") throw e;
      }),
    ),
  );
}
