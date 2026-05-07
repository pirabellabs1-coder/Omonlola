// Server-only data store.
//
// Two backends are supported:
//  1. Vercel KV (Upstash Redis) — used in production when KV_REST_API_URL is set.
//  2. File system JSON — fallback for local dev (and as last-resort in prod).
//
// Local dev uses .data/<name>.json, prod fallback uses /tmp/.data which is the
// only writable directory on Vercel serverless. NOTE: /tmp is ephemeral, so
// data won't persist across cold starts. Use Vercel KV for persistence.

import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

const USE_KV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

const ROOT = process.env.NODE_ENV === "production"
  ? "/tmp/.omolo-data"
  : path.join(process.cwd(), ".data");

const locks = new Map<string, Promise<void>>();

async function withLock<T>(file: string, fn: () => Promise<T>): Promise<T> {
  const prev = locks.get(file) ?? Promise.resolve();
  let release!: () => void;
  const next = new Promise<void>((res) => (release = res));
  locks.set(file, prev.then(() => next));
  try {
    await prev;
    return await fn();
  } finally {
    release();
    if (locks.get(file) === next) locks.delete(file);
  }
}

function filePath(name: string) {
  return path.join(ROOT, `${name}.json`);
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch (err: unknown) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    if (err instanceof SyntaxError) return fallback;
    throw err;
  }
}

async function writeJson<T>(file: string, data: T) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = file + ".tmp";
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

// Lazy-load Vercel KV — keeps the bundle light when KV isn't used.
type KVClient = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<unknown>;
};

let kvClient: KVClient | null = null;
async function getKV(): Promise<KVClient> {
  if (kvClient) return kvClient;
  const mod = await import("@vercel/kv");
  kvClient = mod.kv as unknown as KVClient;
  return kvClient;
}

const KV_PREFIX = "omolo:";

export type Identifiable = { id: number };

/* ============= Public API ============= */

export async function listAll<T extends Identifiable>(name: string): Promise<T[]> {
  if (USE_KV) {
    const kv = await getKV();
    const data = await kv.get<T[]>(`${KV_PREFIX}${name}`);
    return data ?? [];
  }
  return withLock(name, () => readJson<T[]>(filePath(name), []));
}

export async function appendItem<T extends Identifiable>(name: string, item: T): Promise<T> {
  if (USE_KV) {
    const kv = await getKV();
    const arr = (await kv.get<T[]>(`${KV_PREFIX}${name}`)) ?? [];
    arr.unshift(item);
    await kv.set(`${KV_PREFIX}${name}`, arr);
    return item;
  }
  return withLock(name, async () => {
    const arr = await readJson<T[]>(filePath(name), []);
    arr.unshift(item);
    await writeJson(filePath(name), arr);
    return item;
  });
}

export async function updateItem<T extends Identifiable>(
  name: string,
  id: number,
  patch: Partial<T>
): Promise<T | null> {
  if (USE_KV) {
    const kv = await getKV();
    const arr = (await kv.get<T[]>(`${KV_PREFIX}${name}`)) ?? [];
    const idx = arr.findIndex((it) => it.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...patch, id: arr[idx].id };
    await kv.set(`${KV_PREFIX}${name}`, arr);
    return arr[idx];
  }
  return withLock(name, async () => {
    const arr = await readJson<T[]>(filePath(name), []);
    const idx = arr.findIndex((it) => it.id === id);
    if (idx === -1) return null;
    arr[idx] = { ...arr[idx], ...patch, id: arr[idx].id };
    await writeJson(filePath(name), arr);
    return arr[idx];
  });
}

export async function deleteItem<T extends Identifiable>(name: string, id: number): Promise<T | null> {
  if (USE_KV) {
    const kv = await getKV();
    const arr = (await kv.get<T[]>(`${KV_PREFIX}${name}`)) ?? [];
    const idx = arr.findIndex((it) => it.id === id);
    if (idx === -1) return null;
    const [removed] = arr.splice(idx, 1);
    await kv.set(`${KV_PREFIX}${name}`, arr);
    return removed;
  }
  return withLock(name, async () => {
    const arr = await readJson<T[]>(filePath(name), []);
    const idx = arr.findIndex((it) => it.id === id);
    if (idx === -1) return null;
    const [removed] = arr.splice(idx, 1);
    await writeJson(filePath(name), arr);
    return removed;
  });
}

export async function replaceAll<T extends Identifiable>(name: string, items: T[]): Promise<void> {
  if (USE_KV) {
    const kv = await getKV();
    await kv.set(`${KV_PREFIX}${name}`, items);
    return;
  }
  return withLock(name, () => writeJson(filePath(name), items));
}

export async function getKey<T>(name: string, fallback: T): Promise<T> {
  if (USE_KV) {
    const kv = await getKV();
    const data = await kv.get<T>(`${KV_PREFIX}${name}`);
    return data ?? fallback;
  }
  return withLock(name, () => readJson<T>(filePath(name), fallback));
}

export async function setKey<T>(name: string, value: T): Promise<void> {
  if (USE_KV) {
    const kv = await getKV();
    await kv.set(`${KV_PREFIX}${name}`, value);
    return;
  }
  return withLock(name, () => writeJson(filePath(name), value));
}

export function newId(): number {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}
