import type { CloudDocument, Itinerary, Settings } from "../types/trip";

export function isCloudSyncConfigured(settings: Settings) {
  return Boolean(settings.syncUrl && settings.syncAnonKey && settings.syncTripId);
}

export function canWriteCloud(settings: Settings) {
  return isCloudSyncConfigured(settings) && Boolean(settings.syncEditCode);
}

export async function loadCloudItinerary(settings: Settings): Promise<CloudDocument | null> {
  if (!isCloudSyncConfigured(settings)) return null;
  const response = await callSupabaseRpc(settings, "get_trip_document", {
    p_id: settings.syncTripId
  });
  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(await readSupabaseError(response, "云端读取失败"));
  }
  const data = await response.json();
  return normalizeRpcDocument(data);
}

export async function saveCloudItinerary(settings: Settings, itinerary: Itinerary): Promise<CloudDocument> {
  if (!canWriteCloud(settings)) throw new Error("请先填写云同步编辑码");
  const response = await callSupabaseRpc(settings, "save_trip_document", {
    p_id: settings.syncTripId,
    p_itinerary: itinerary,
    p_edit_code: settings.syncEditCode
  });
  if (!response.ok) {
    throw new Error(await readSupabaseError(response, "云端保存失败"));
  }
  return normalizeRpcDocument(await response.json())!;
}

async function callSupabaseRpc(settings: Settings, name: string, body: unknown) {
  const baseUrl = settings.syncUrl.replace(/\/+$/, "");
  return fetch(`${baseUrl}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: settings.syncAnonKey,
      Authorization: `Bearer ${settings.syncAnonKey}`
    },
    body: JSON.stringify(body)
  });
}

function normalizeRpcDocument(data: unknown): CloudDocument | null {
  const value = Array.isArray(data) ? data[0] : data;
  if (!value || typeof value !== "object") return null;
  const doc = value as CloudDocument;
  if (!doc.itinerary) return null;
  return doc;
}

async function readSupabaseError(response: Response, fallback: string) {
  const data = await response.json().catch(() => null);
  return data?.message || data?.error_description || data?.hint || `${fallback}：HTTP ${response.status}`;
}
