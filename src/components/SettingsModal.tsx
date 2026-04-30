import { useEffect, useState } from "react";
import type { Settings } from "../types/trip";

interface Props {
  open: boolean;
  settings: Settings;
  onClose: () => void;
  onSave: (settings: Settings) => void;
}

export function SettingsModal({ open, settings, onClose, onSave }: Props) {
  const [draft, setDraft] = useState(settings);
  useEffect(() => setDraft(settings), [settings, open]);
  return (
    <>
      <div className={`overlay-backdrop${open ? " show" : ""}`} onClick={onClose} />
      <section className={`modal${open ? " show" : ""}`}>
        <h2>设置</h2>
        <form className="form-grid" onSubmit={event => {
          event.preventDefault();
          onSave({
            claudeKey: draft.claudeKey.trim(),
            googleMapsKey: draft.googleMapsKey.trim(),
            syncUrl: draft.syncUrl.trim(),
            syncAnonKey: draft.syncAnonKey.trim(),
            syncTripId: draft.syncTripId.trim() || "tokyo-2026",
            syncEditCode: draft.syncEditCode.trim()
          });
        }}>
          <div className="field">
            <label>Claude API Key</label>
            <input name="claudeKey" type="password" value={draft.claudeKey} placeholder="sk-ant-..." onChange={event => setDraft({ ...draft, claudeKey: event.target.value })} />
          </div>
          <div className="field">
            <label>Google Maps API Key</label>
            <input name="googleMapsKey" type="password" value={draft.googleMapsKey} placeholder="AIza..." onChange={event => setDraft({ ...draft, googleMapsKey: event.target.value })} />
          </div>
          <div className="field">
            <label>Supabase Project URL</label>
            <input name="syncUrl" value={draft.syncUrl} placeholder="https://xxxx.supabase.co" onChange={event => setDraft({ ...draft, syncUrl: event.target.value })} />
          </div>
          <div className="field">
            <label>Supabase Anon Key</label>
            <input name="syncAnonKey" type="password" value={draft.syncAnonKey} placeholder="eyJ..." onChange={event => setDraft({ ...draft, syncAnonKey: event.target.value })} />
          </div>
          <div className="two-col">
            <div className="field">
              <label>Trip ID</label>
              <input name="syncTripId" value={draft.syncTripId || "tokyo-2026"} onChange={event => setDraft({ ...draft, syncTripId: event.target.value })} />
            </div>
            <div className="field">
              <label>云同步编辑码</label>
              <input name="syncEditCode" type="password" value={draft.syncEditCode} placeholder="只给同行人" onChange={event => setDraft({ ...draft, syncEditCode: event.target.value })} />
            </div>
          </div>
          <div className="detail-block">
            <p>Key 只会保存在本机 localStorage，不会写入源码或上传服务器。Claude Key 用于 AI 对话；Google Maps Key 用于 Google Maps 和 Places 搜索，不填也会使用 Leaflet/OpenStreetMap 基础地图。</p>
          </div>
          <div className="detail-block">
            <p>云同步会把行程 JSON 保存到你配置的 Supabase 项目。编辑码用于写入校验；不填编辑码时只读取云端行程，不会写云端。</p>
          </div>
          <div className="modal-actions">
            <button className="btn ghost" type="button" onClick={onClose}>取消</button>
            <button className="btn" type="submit">保存</button>
          </div>
        </form>
      </section>
    </>
  );
}
