import { defaultTrip, ITINERARY_REVISION } from "../data/defaultTrip";
import { getJapaneseName } from "../data/japaneseNames";
import type { ChatMessage, DayPlan, Itinerary, Settings, Spot, SpotWarning, Ticket, Transport } from "../types/trip";
import { deepClone } from "./geo";

export const STORAGE_KEYS = {
  itinerary: "tokyoTrip.itinerary.v1",
  chat: "tokyoTrip.chat.v1",
  settings: "tokyoTrip.settings.v1",
  chatActionSeq: "tokyoTrip.chatActionSeq.v1"
} as const;

export function loadItinerary() {
  const raw = loadJson<Itinerary | null>(STORAGE_KEYS.itinerary, null);
  const repaired = sanitizeItinerary(raw);
  applyItineraryRevision(repaired, raw);
  if (!raw || JSON.stringify(raw) !== JSON.stringify(repaired)) {
    localStorage.setItem(STORAGE_KEYS.itinerary, JSON.stringify(repaired));
  }
  return repaired;
}

export function saveItinerary(itinerary: Itinerary) {
  localStorage.setItem(STORAGE_KEYS.itinerary, JSON.stringify(itinerary));
}

export function loadSettings(): Settings {
  const settings = loadJson<Partial<Settings>>(STORAGE_KEYS.settings, {});
  return {
    claudeKey: String(settings.claudeKey || "").trim(),
    googleMapsKey: String(settings.googleMapsKey || "").trim(),
    syncUrl: String(settings.syncUrl || "").trim(),
    syncAnonKey: String(settings.syncAnonKey || "").trim(),
    syncTripId: String(settings.syncTripId || "tokyo-2026").trim(),
    syncEditCode: String(settings.syncEditCode || "").trim()
  };
}

export function saveSettings(settings: Settings) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function loadChat() {
  return loadJson<ChatMessage[]>(STORAGE_KEYS.chat, []);
}

export function saveChat(chat: ChatMessage[]) {
  localStorage.setItem(STORAGE_KEYS.chat, JSON.stringify(chat));
}

export function loadChatActionSeq() {
  return Number(localStorage.getItem(STORAGE_KEYS.chatActionSeq) || 1);
}

export function saveChatActionSeq(value: number) {
  localStorage.setItem(STORAGE_KEYS.chatActionSeq, String(value));
}

export async function loadRemoteItinerary() {
  const response = await fetch("/api/itinerary");
  if (!response.ok) throw new Error(`GET /api/itinerary failed: ${response.status}`);
  return response.json() as Promise<Itinerary>;
}

export async function saveRemoteItinerary(itinerary: Itinerary) {
  const response = await fetch("/api/itinerary", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itinerary)
  });
  if (!response.ok) throw new Error(`PUT /api/itinerary failed: ${response.status}`);
  return response.json();
}

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function sanitizeItinerary(raw: unknown): Itinerary {
  const base = ensureItineraryJapaneseNames(deepClone(defaultTrip));
  if (!raw || typeof raw !== "object") return base;
  const candidate = raw as Partial<Itinerary>;
  const next: Itinerary = {
    trip: sanitizeTrip(candidate.trip, base.trip),
    days: sanitizeDays(candidate.days, base.days)
  };
  return next.days.length ? next : base;
}

function applyItineraryRevision(itinerary: Itinerary, raw: Itinerary | null) {
  if (raw?.trip?.itineraryRevision === ITINERARY_REVISION) return;
  itinerary.trip = deepClone(defaultTrip.trip);
  itinerary.days = deepClone(defaultTrip.days);
}

function sanitizeTrip(rawTrip: unknown, fallbackTrip: Itinerary["trip"]): Itinerary["trip"] {
  const trip = rawTrip && typeof rawTrip === "object" ? (rawTrip as Partial<Itinerary["trip"]>) : {};
  return {
    title: String(trip.title || fallbackTrip.title).trim(),
    dates: String(trip.dates || fallbackTrip.dates).trim(),
    hotel: String(trip.hotel || fallbackTrip.hotel).trim(),
    travelers: Number.isFinite(Number(trip.travelers)) && Number(trip.travelers) > 0 ? Number(trip.travelers) : fallbackTrip.travelers,
    itineraryRevision: String(trip.itineraryRevision || fallbackTrip.itineraryRevision || ITINERARY_REVISION).trim()
  };
}

function sanitizeDays(rawDays: unknown, fallbackDays: DayPlan[]) {
  if (!Array.isArray(rawDays) || !rawDays.length) return deepClone(fallbackDays);
  const days = rawDays
    .map((rawDay, index) => {
      const fallbackDay = fallbackDays[index] || fallbackDays[0];
      if (!rawDay || typeof rawDay !== "object") return deepClone(fallbackDay);
      const day = rawDay as Partial<DayPlan>;
      return {
        id: Number(day.id) || fallbackDay.id,
        date: String(day.date || fallbackDay.date).trim(),
        label: String(day.label || fallbackDay.label).trim(),
        note: String(day.note || fallbackDay.note).trim(),
        spots: sanitizeSpots(day.spots, fallbackDay.spots)
      };
    })
    .filter(day => Array.isArray(day.spots) && day.spots.length);
  return days.length ? days : deepClone(fallbackDays);
}

function sanitizeSpots(rawSpots: unknown, fallbackSpots: Spot[]) {
  if (!Array.isArray(rawSpots) || !rawSpots.length) return deepClone(fallbackSpots);
  const spots = rawSpots.map((spot, index) => sanitizeSpot(spot, fallbackSpots[index] || fallbackSpots[0])).filter(Boolean) as Spot[];
  return spots.length ? spots : deepClone(fallbackSpots);
}

export function sanitizeSpot(rawSpot: unknown, fallbackSpot?: Spot): Spot {
  if (!rawSpot || typeof rawSpot !== "object") return deepClone(fallbackSpot || defaultTrip.days[0].spots[0]);
  const spot = rawSpot as Partial<Spot>;
  return {
    id: String(spot.id || `spot-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`),
    name: String(spot.name || fallbackSpot?.name || "未命名地点").trim(),
    nameJa: String(spot.nameJa || getJapaneseName(spot.name) || fallbackSpot?.nameJa || getJapaneseName(fallbackSpot?.name) || "").trim(),
    icon: String(spot.icon || fallbackSpot?.icon || "📍").trim(),
    time: String(spot.time || fallbackSpot?.time || "12:00").trim(),
    duration: Number.isFinite(Number(spot.duration)) ? Number(spot.duration) : Number(fallbackSpot?.duration || 60),
    lat: Number.isFinite(Number(spot.lat)) ? Number(spot.lat) : Number(fallbackSpot?.lat || 35.6812),
    lng: Number.isFinite(Number(spot.lng)) ? Number(spot.lng) : Number(fallbackSpot?.lng || 139.7671),
    category: String(spot.category || fallbackSpot?.category || "景点").trim(),
    address: String(spot.address || fallbackSpot?.address || "").trim(),
    desc: String(spot.desc || fallbackSpot?.desc || "").trim(),
    transport: sanitizeTransport(spot.transport, fallbackSpot?.transport),
    ticket: sanitizeTicket(spot.ticket, fallbackSpot?.ticket),
    bestTime: String(spot.bestTime || fallbackSpot?.bestTime || "按当天动线安排").trim(),
    tips: Array.isArray(spot.tips) && spot.tips.length ? spot.tips.map(item => String(item).trim()).filter(Boolean) : fallbackSpot?.tips ? deepClone(fallbackSpot.tips) : ["加入前建议确认营业时间"],
    warning: sanitizeWarning(spot.warning, fallbackSpot?.warning)
  };
}

function sanitizeTransport(rawTransport: unknown, fallbackTransport?: Transport): Transport {
  const transport = rawTransport && typeof rawTransport === "object" ? (rawTransport as Partial<Transport>) : {};
  const fallback: Partial<Transport> = fallbackTransport || {};
  return {
    from: String(transport.from || fallback.from || "上一站").trim(),
    method: String(transport.method || fallback.method || "🚶 步行/电车").trim(),
    duration: String(transport.duration || fallback.duration || "待确认").trim(),
    cost: String(transport.cost || fallback.cost || "待确认").trim()
  };
}

function sanitizeTicket(rawTicket: unknown, fallbackTicket?: Ticket): Ticket {
  const ticket = rawTicket && typeof rawTicket === "object" ? (rawTicket as Partial<Ticket>) : {};
  const fallback: Partial<Ticket> = fallbackTicket || {};
  return {
    price: String(ticket.price || fallback.price || "按项目").trim(),
    reservation: ticket.reservation == null ? Boolean(fallback.reservation) : Boolean(ticket.reservation),
    url: String(ticket.url || fallback.url || "").trim()
  };
}

function sanitizeWarning(rawWarning: unknown, fallbackWarning?: SpotWarning | null): SpotWarning | null {
  if (!rawWarning && !fallbackWarning) return null;
  const warning = rawWarning && typeof rawWarning === "object" ? (rawWarning as Partial<SpotWarning>) : fallbackWarning || {};
  if (!warning.text && !warning.level) return null;
  return {
    level: String(warning.level || fallbackWarning?.level || "yellow").trim(),
    text: String(warning.text || fallbackWarning?.text || "").trim()
  };
}

function ensureItineraryJapaneseNames(itinerary: Itinerary) {
  itinerary.days.forEach(day => {
    day.spots.forEach(spot => {
      if (!spot.nameJa) spot.nameJa = getJapaneseName(spot.name);
    });
  });
  return itinerary;
}
