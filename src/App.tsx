import { useEffect, useMemo, useState } from "react";
import { defaultTrip } from "./data/defaultTrip";
import { getJapaneseName } from "./data/japaneseNames";
import { optionalSpots } from "./data/optionalSpots";
import { ChatAssistant } from "./components/ChatAssistant";
import { DayTabs } from "./components/DayTabs";
import { ItinerarySearch } from "./components/ItinerarySearch";
import { MapPanel } from "./components/MapPanel";
import { OptionalSpotLibrary } from "./components/OptionalSpotLibrary";
import { SettingsModal } from "./components/SettingsModal";
import { SpotDetailSheet } from "./components/SpotDetailSheet";
import { SpotFormModal } from "./components/SpotFormModal";
import { Timeline } from "./components/Timeline";
import { callClaude, isAffirmativeMessage } from "./lib/ai";
import { canWriteCloud, isCloudSyncConfigured, loadCloudItinerary, saveCloudItinerary } from "./lib/cloudSync";
import { deepClone, findSpotByNameLoose, getAllSpots, iconForCategory, normalizeNameForMatch, suggestNextTime } from "./lib/geo";
import { getKnownSpotTemplate, knownTemplateToResult, normalizeGooglePlace, overpassSearch } from "./lib/placeSearch";
import { loadChat, loadChatActionSeq, loadItinerary, loadSettings, sanitizeItinerary, sanitizeSpot, saveChat, saveChatActionSeq, saveItinerary, saveSettings } from "./lib/storage";
import type { ChatAction, ChatMessage, DayPlan, Itinerary, PlaceResult, Settings, Spot } from "./types/trip";

type ModalMode = "closed" | "spot" | "time" | "menu";

export default function App() {
  const [itinerary, setItinerary] = useState<Itinerary>(() => loadItinerary());
  const [settings, setSettings] = useState<Settings>(() => loadSettings());
  const [chat, setChat] = useState<ChatMessage[]>(() => loadChat());
  const [chatActionSeq, setChatActionSeq] = useState(() => loadChatActionSeq());
  const [activeDayId, setActiveDayId] = useState(1);
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("closed");
  const [modalSpotId, setModalSpotId] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState("");
  const [placeKeyword, setPlaceKeyword] = useState("");
  const [placeResults, setPlaceResults] = useState<PlaceResult[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [placeError, setPlaceError] = useState("");
  const [syncStatus, setSyncStatus] = useState("本机模式");

  const activeDay = useMemo(() => itinerary.days.find(day => day.id === activeDayId) || itinerary.days[0], [itinerary, activeDayId]);
  const allSpots = useMemo(() => getAllSpots(itinerary.days), [itinerary]);
  const selectedSpot = selectedSpotId ? allSpots.find(spot => spot.id === selectedSpotId) || null : null;
  const selectedDay = selectedSpotId ? itinerary.days.find(day => day.spots.some(spot => spot.id === selectedSpotId)) || activeDay : activeDay;

  useEffect(() => {
    void pullCloudItinerary(settings);
  }, [settings.syncUrl, settings.syncAnonKey, settings.syncTripId]);

  async function pullCloudItinerary(nextSettings = settings) {
    if (!isCloudSyncConfigured(nextSettings)) {
      setSyncStatus("本机模式");
      return;
    }
    setSyncStatus("读取云端...");
    try {
      const doc = await loadCloudItinerary(nextSettings);
      if (!doc?.itinerary) {
        if (canWriteCloud(nextSettings)) {
          const created = await saveCloudItinerary(nextSettings, itinerary);
          setSyncStatus(`云端已初始化 #${created.revision}`);
        } else {
          setSyncStatus("云端暂无行程");
        }
        return;
      }
      const repaired = sanitizeItinerary(doc.itinerary);
      setItinerary(repaired);
      saveItinerary(repaired);
      setSyncStatus(`云端已同步 #${doc.revision}`);
    } catch (err) {
      setSyncStatus(err instanceof Error ? err.message : "云端读取失败");
    }
  }

  async function pushCloudItinerary(next: Itinerary) {
    if (!isCloudSyncConfigured(settings)) {
      setSyncStatus("本机模式");
      return;
    }
    if (!canWriteCloud(settings)) {
      setSyncStatus("云端只读");
      return;
    }
    setSyncStatus("保存云端...");
    try {
      const doc = await saveCloudItinerary(settings, next);
      setSyncStatus(`云端已同步 #${doc.revision}`);
    } catch (err) {
      setSyncStatus(err instanceof Error ? err.message : "云端保存失败");
    }
  }

  function commit(next: Itinerary, message?: string) {
    setItinerary(next);
    saveItinerary(next);
    void pushCloudItinerary(next);
    if (message) showToast(message);
  }

  function syncLabel() {
    if (!isCloudSyncConfigured(settings)) return "本机模式";
    if (!settings.syncEditCode) return syncStatus === "本机模式" ? "云端只读" : syncStatus;
    return syncStatus;
  }

  function saveAppSettings(next: Settings) {
    setSettings(next);
    saveSettings(next);
    setSettingsOpen(false);
    showToast("设置已保存");
    void pullCloudItinerary(next);
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  }

  function updateDay(dayId: number, updater: (day: DayPlan) => void, message?: string) {
    const next = deepClone(itinerary);
    const day = next.days.find(item => item.id === dayId);
    if (!day) return;
    updater(day);
    commit(next, message);
  }

  function selectSpot(spotId: string, openSheet = false) {
    setSelectedSpotId(spotId);
    if (openSheet) setDetailOpen(true);
    window.setTimeout(() => document.querySelector(`[data-spot-id="${CSS.escape(spotId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 40);
  }

  function addLibrarySpot(item: Spot) {
    updateDay(activeDay.id, day => {
      const copy = deepClone(item);
      copy.id = `custom-${Date.now()}`;
      copy.time = suggestNextTime(day);
      copy.transport = { from: day.spots.at(-1)?.name || "上一站", method: "🚃 电车/步行", duration: "待确认", cost: "待确认" };
      day.spots.push(copy);
      setSelectedSpotId(copy.id);
    }, `${item.name} 已加入 ${activeDay.label}`);
  }

  function removeSpot(spotId: string, confirmRemoval = true) {
    const spot = allSpots.find(item => item.id === spotId);
    if (!spot) return;
    if (confirmRemoval && !confirm(`确认从行程移除「${spot.name}」？`)) return;
    const next = deepClone(itinerary);
    next.days.forEach(day => {
      day.spots = day.spots.filter(item => item.id !== spotId);
    });
    setDetailOpen(false);
    setModalMode("closed");
    setSelectedSpotId(next.days.find(day => day.id === activeDayId)?.spots[0]?.id || null);
    commit(next, confirmRemoval ? "已移除景点" : undefined);
  }

  function moveSpotWithinDay(spotId: string, delta: number) {
    const day = itinerary.days.find(item => item.spots.some(spot => spot.id === spotId));
    if (!day) return;
    updateDay(day.id, draft => {
      const index = draft.spots.findIndex(item => item.id === spotId);
      const nextIndex = index + delta;
      if (index < 0 || nextIndex < 0 || nextIndex >= draft.spots.length) {
        showToast("已经到边界了");
        return;
      }
      const [spot] = draft.spots.splice(index, 1);
      draft.spots.splice(nextIndex, 0, spot);
    }, "顺序已调整");
    setModalMode("closed");
  }

  function moveSpotToDay(spotId: string, targetDayId: number) {
    const next = deepClone(itinerary);
    const sourceDay = next.days.find(day => day.spots.some(spot => spot.id === spotId));
    const targetDay = next.days.find(day => day.id === targetDayId);
    if (!sourceDay || !targetDay) return;
    if (sourceDay.id === targetDay.id) {
      showToast("景点已在这个 Day");
      return;
    }
    const index = sourceDay.spots.findIndex(item => item.id === spotId);
    const [spot] = sourceDay.spots.splice(index, 1);
    spot.transport = { ...spot.transport, from: targetDay.spots.at(-1)?.name || "上一站" };
    targetDay.spots.push(spot);
    setActiveDayId(targetDay.id);
    setSelectedSpotId(spot.id);
    setModalMode("closed");
    commit(next, `已移动到 ${targetDay.label}`);
  }

  function reorderActiveDay(from: number, to: number) {
    if (from === to) return;
    updateDay(activeDay.id, day => {
      const [spot] = day.spots.splice(from, 1);
      day.spots.splice(to, 0, spot);
    }, "拖拽排序已保存");
  }

  function saveSpotForm(spot: Spot, targetDayId: number) {
    const next = deepClone(itinerary);
    next.days.forEach(day => {
      day.spots = day.spots.filter(item => item.id !== spot.id);
    });
    const target = next.days.find(day => day.id === targetDayId) || next.days[0];
    target.spots.push(sanitizeSpot(spot));
    setActiveDayId(target.id);
    setSelectedSpotId(spot.id);
    setModalMode("closed");
    commit(next, "已保存景点");
  }

  function saveTime(spotId: string, time: string, duration: number) {
    const next = deepClone(itinerary);
    const spot = getAllSpots(next.days).find(item => item.id === spotId);
    if (!spot) return;
    spot.time = time || spot.time;
    spot.duration = Number(duration || spot.duration || 60);
    setModalMode("closed");
    setSelectedSpotId(spotId);
    commit(next, "时间已更新");
  }

  async function copyText(text: string, message = "已复制") {
    try {
      await navigator.clipboard.writeText(text);
      showToast(message);
    } catch {
      showToast(text);
    }
  }

  function resetItinerary() {
    if (!confirm("确认重置为默认东京行程？本地编辑会被清除。")) return;
    const repaired = sanitizeItinerary(defaultTrip);
    setActiveDayId(1);
    setSelectedSpotId(null);
    commit(repaired, "已恢复默认行程");
  }

  async function searchItineraryPlaces() {
    const keyword = placeKeyword.trim();
    if (!keyword) {
      showToast("请输入想搜索的地点");
      return;
    }
    const origin = activeDay.spots.at(-1) || { name: "柏悦酒店", lat: 35.6856, lng: 139.6907 } as Spot;
    setPlaceLoading(true);
    setPlaceError("");
    setPlaceResults([]);
    try {
      const known = getKnownSpotTemplate(keyword);
      if (known) {
        setPlaceResults([knownTemplateToResult(known, origin)]);
      } else {
        setPlaceResults(await overpassSearch(keyword, origin.lat, origin.lng, 2500));
      }
    } catch (err) {
      setPlaceError(err instanceof Error ? err.message : "地点搜索暂不可用，请稍后再试。");
    } finally {
      setPlaceLoading(false);
    }
  }

  function addSearchResultToDay(result: PlaceResult, origin?: Spot, keyword = placeKeyword) {
    const anchor = origin || activeDay.spots.at(-1) || ({ name: "柏悦酒店" } as Spot);
    updateDay(activeDay.id, day => {
      const spot: Spot = {
        id: `search-${Date.now()}`,
        name: result.name,
        nameJa: result.nameJa || getJapaneseName(result.name) || result.name,
        icon: iconForCategory(result.category),
        time: suggestNextTime(day),
        duration: 60,
        lat: result.lat,
        lng: result.lng,
        category: result.category || "地点",
        address: result.address || "",
        desc: result.desc || `通过主页搜索「${keyword}」加入的地点，距离 ${anchor.name} 约 ${Math.round(result.distance || 0)}m。`,
        transport: { from: anchor.name, method: "🚶 步行/电车", duration: "待确认", cost: "待确认" },
        ticket: { price: "按项目", reservation: false, url: "" },
        bestTime: "按当天动线安排",
        tips: ["搜索数据可能不完整，出发前建议确认营业时间和预约要求"],
        warning: null
      };
      day.spots.push(spot);
      setSelectedSpotId(spot.id);
      setModalSpotId(spot.id);
      setModalMode("time");
    }, `${result.name} 已加入 ${activeDay.label}`);
  }

  function nextActionId() {
    const value = `action-${chatActionSeq}`;
    const next = chatActionSeq + 1;
    setChatActionSeq(next);
    saveChatActionSeq(next);
    return value;
  }

  async function sendChat(text: string) {
    if (!settings.claudeKey) {
      showToast("请先在设置中填写 Claude API Key");
      setSettingsOpen(true);
      return;
    }
    let nextChat: ChatMessage[] = [...chat, { role: "user", content: text }];
    setChat(nextChat);
    saveChat(nextChat);
    if (isAffirmativeMessage(text) && applyLatestPendingAction(nextChat)) return;
    const loading: ChatMessage = { role: "assistant", content: "正在查询行程..." };
    nextChat = [...nextChat, loading];
    setChat(nextChat);
    setSending(true);
    try {
      const reply = await callClaude({ latestText: text, chat: nextChat, itinerary, claudeKey: settings.claudeKey, nextId: nextActionId });
      nextChat = nextChat.map(item => item === loading ? { role: "assistant", content: reply.reply, actions: reply.actions } : item);
    } catch (err) {
      nextChat = nextChat.map(item => item === loading ? { role: "assistant", content: `Claude 调用失败：${err instanceof Error ? err.message : "浏览器可能阻止了前端直连 Anthropic API。后续可改为 /api/chat 后端代理。"}`, actions: [] } : item);
    } finally {
      setSending(false);
      setChat(nextChat);
      saveChat(nextChat);
    }
  }

  function applyLatestPendingAction(sourceChat = chat) {
    const latest = [...sourceChat].reverse().find(item => item.role === "assistant" && item.actions?.some(action => action.status === "pending"));
    const action = latest?.actions?.find(item => item.status === "pending");
    if (!action) return false;
    executeChatAction(action.id);
    return true;
  }

  function executeChatAction(actionId: string) {
    const action = chat.flatMap(item => item.actions || []).find(item => item.id === actionId);
    if (!action || action.status !== "pending") return;
    const next = deepClone(itinerary);
    if (action.type === "add_spot") {
      const day = next.days.find(item => item.id === action.proposal.dayId);
      if (day) {
        const spot = hydrateProposedSpot(action.proposal.spot, day);
        const index = action.proposal.insertAfterSpotId ? day.spots.findIndex(item => item.id === action.proposal.insertAfterSpotId) : -1;
        day.spots.splice(index >= 0 ? index + 1 : day.spots.length, 0, spot);
        setActiveDayId(day.id);
        setSelectedSpotId(spot.id);
      }
    }
    if (action.type === "replace_day") {
      const day = next.days.find(item => item.id === action.proposal.dayId);
      if (day) {
        day.spots = action.proposal.spots.map(item => hydrateProposedSpot(item, day));
        setActiveDayId(day.id);
        setSelectedSpotId(day.spots[0]?.id || null);
      }
    }
    if (action.type === "reorder_day") {
      const day = next.days.find(item => item.id === action.proposal.dayId);
      if (day) {
        const current = [...day.spots];
        day.spots = action.proposal.orderedSpots.map(item => current.find(spot => spot.id === item.spotId) || findSpotByNameLoose(current, item.name || "")).filter(Boolean).map((spot, index) => ({ ...deepClone(spot!), time: action.proposal.orderedSpots[index]?.time || spot!.time, duration: Number(action.proposal.orderedSpots[index]?.duration || spot!.duration) }));
      }
    }
    if (action.type === "update_spot") {
      const spot = getAllSpots(next.days).find(item => item.id === action.proposal.spotId);
      if (spot) Object.assign(spot, action.proposal.updates);
    }
    if (action.type === "remove_spot") {
      next.days.forEach(day => day.spots = day.spots.filter(spot => spot.id !== action.proposal.spotId));
    }
    commit(next, "AI 建议已应用");
    const nextChat = chat.map(item => ({ ...item, actions: item.actions?.map(a => a.id === actionId ? { ...a, status: "applied" as const } : a) }));
    setChat(nextChat);
    saveChat(nextChat);
  }

  function hydrateProposedSpot(raw: Partial<Spot> & { spotId?: string; name: string }, day: DayPlan): Spot {
    const existing = raw.spotId ? day.spots.find(item => item.id === raw.spotId) : findSpotByNameLoose(allSpots, raw.name);
    return sanitizeSpot({ ...existing, ...raw, id: raw.spotId || existing?.id || `ai-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` }, existing || day.spots[0]);
  }

  function openSpotModal(mode: ModalMode, spotId?: string | null) {
    setModalSpotId(spotId || null);
    setModalMode(mode);
  }

  const modalSpot = modalSpotId ? allSpots.find(spot => spot.id === modalSpotId) || null : null;
  const mapLabel = settings.googleMapsKey ? "Google Maps" : "Leaflet";
  return (
    <>
      <main className="app">
        <section className="hero">
          <p className="eyebrow">Private Tokyo Companion</p>
          <h1>{itinerary.trip.title}</h1>
          <div className="hero-meta">
            <div className="meta-pill"><strong>日期</strong><span>{itinerary.trip.dates}</span></div>
            <div className="meta-pill"><strong>酒店</strong><span>{itinerary.trip.hotel}</span></div>
            <div className="meta-pill"><strong>人数</strong><span>{itinerary.trip.travelers}人</span></div>
            <div className="meta-pill"><strong>地图</strong><span>{mapLabel}</span></div>
            <div className="meta-pill"><strong>同步</strong><span>{syncLabel()}</span></div>
          </div>
          <div className="hero-actions">
            <button className="btn secondary" onClick={() => setSettingsOpen(true)}>⚙ 设置</button>
            <button className="btn green" onClick={() => void pullCloudItinerary(settings)}>⇅ 同步</button>
            <button className="btn amber" onClick={() => openSpotModal("spot")}>＋ 添加</button>
            <button className="btn ghost" onClick={resetItinerary}>↺ 重置</button>
          </div>
        </section>
        <DayTabs days={itinerary.days} activeDayId={activeDayId} onSelect={dayId => { setActiveDayId(dayId); setSelectedSpotId(itinerary.days.find(day => day.id === dayId)?.spots[0]?.id || null); }} />
        <Timeline day={activeDay} selectedSpotId={selectedSpotId} onSelect={selectSpot} onMenu={spotId => openSpotModal("menu", spotId)} onTime={spotId => openSpotModal("time", spotId)} onReorder={reorderActiveDay} />
        <ItinerarySearch value={placeKeyword} results={placeResults} loading={placeLoading} error={placeError} dayLabel={activeDay.label} onChange={setPlaceKeyword} onSearch={searchItineraryPlaces} onAdd={addSearchResultToDay} />
        <OptionalSpotLibrary spots={optionalSpots} onAdd={addLibrarySpot} />
      </main>
      <MapPanel day={activeDay} selectedSpotId={selectedSpotId} settings={settings} onSelectSpot={spotId => selectSpot(spotId, false)} onAddPoi={addSearchResultToDay} onToast={showToast} />
      <SpotDetailSheet spot={selectedSpot} open={detailOpen} onClose={() => setDetailOpen(false)} onMap={spotId => { setSelectedSpotId(spotId); }} onCopy={copyText} onRemove={removeSpot} />
      <SpotFormModal mode={modalMode} spot={modalSpot} day={selectedDay} days={itinerary.days} onClose={() => setModalMode("closed")} onEdit={spotId => openSpotModal("spot", spotId)} onSaveSpot={saveSpotForm} onSaveTime={saveTime} onMove={moveSpotWithinDay} onMoveDay={moveSpotToDay} onDelete={removeSpot} />
      <SettingsModal open={settingsOpen} settings={settings} onClose={() => setSettingsOpen(false)} onSave={saveAppSettings} />
      <ChatAssistant open={chatOpen} chat={chat} sending={sending} onOpen={() => setChatOpen(true)} onClose={() => setChatOpen(false)} onClear={() => { if (confirm("确认清空对话历史？")) { setChat([]); saveChat([]); } }} onSend={sendChat} onApplyAction={executeChatAction} onSpotClick={name => {
        const spot = allSpots.find(item => normalizeNameForMatch(item.name).includes(normalizeNameForMatch(name)) || normalizeNameForMatch(name).includes(normalizeNameForMatch(item.name)));
        if (spot) selectSpot(spot.id, true);
      }} />
      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </>
  );
}
