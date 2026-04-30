export type WarningLevel = "red" | "yellow" | "green" | string;

export interface SpotWarning {
  level: WarningLevel;
  text: string;
}

export interface Transport {
  from: string;
  method: string;
  duration: string;
  cost: string;
}

export interface Ticket {
  price: string;
  reservation: boolean;
  url: string;
}

export interface Spot {
  id: string;
  name: string;
  nameJa?: string;
  icon: string;
  time: string;
  duration: number;
  lat: number;
  lng: number;
  category: string;
  address: string;
  desc: string;
  transport: Transport;
  ticket: Ticket;
  bestTime: string;
  tips: string[];
  warning?: SpotWarning | null;
}

export interface DayPlan {
  id: number;
  date: string;
  label: string;
  note: string;
  spots: Spot[];
}

export interface TripMeta {
  title: string;
  dates: string;
  hotel: string;
  travelers: number;
  itineraryRevision?: string;
}

export interface Itinerary {
  trip: TripMeta;
  days: DayPlan[];
}

export interface Settings {
  claudeKey: string;
  googleMapsKey: string;
  syncUrl: string;
  syncAnonKey: string;
  syncTripId: string;
  syncEditCode: string;
}

export interface CloudDocument {
  id: string;
  itinerary: Itinerary;
  revision: number;
  updated_at: string;
}

export interface PlaceResult {
  id: string;
  name: string;
  nameJa?: string;
  lat: number;
  lng: number;
  category: string;
  address?: string;
  distance: number;
  rating?: number | null;
  openNow?: boolean | null;
  desc?: string;
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  actions?: ChatAction[];
}

export interface AddSpotProposal {
  dayId: number;
  insertAfterSpotId?: string;
  spot: Partial<Spot> & { name: string };
}

export interface ReorderDayProposal {
  dayId: number;
  orderedSpots: Array<{ spotId?: string; name?: string; time?: string; duration?: number | null }>;
}

export interface ReplaceDayProposal {
  dayId: number;
  spots: Array<Partial<Spot> & { spotId?: string; name: string }>;
}

export interface UpdateSpotProposal {
  spotId: string;
  updates: Partial<Spot>;
}

export type ChatAction =
  | { id: string; status: "pending" | "applied"; type: "add_spot"; title: string; reason: string; proposal: AddSpotProposal }
  | { id: string; status: "pending" | "applied"; type: "reorder_day"; title: string; reason: string; proposal: ReorderDayProposal }
  | { id: string; status: "pending" | "applied"; type: "replace_day"; title: string; reason: string; proposal: ReplaceDayProposal }
  | { id: string; status: "pending" | "applied"; type: "update_spot"; title: string; reason: string; proposal: UpdateSpotProposal }
  | { id: string; status: "pending" | "applied"; type: "remove_spot"; title: string; reason: string; proposal: { spotId: string } };
