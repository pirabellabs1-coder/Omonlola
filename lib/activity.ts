import "server-only";
import { appendItem, listAll, newId, replaceAll } from "./store";
import { STORE, type ActivityEntry } from "./types";

const MAX = 200;

export async function logActivity(action: string, target: string, details?: string) {
  const entry: ActivityEntry = {
    id: newId(),
    at: new Date().toISOString(),
    action,
    target,
    details
  };
  await appendItem<ActivityEntry>(STORE.activity, entry);
  // Trim if too long
  const all = await listAll<ActivityEntry>(STORE.activity);
  if (all.length > MAX) {
    await replaceAll<ActivityEntry>(STORE.activity, all.slice(0, MAX));
  }
}
