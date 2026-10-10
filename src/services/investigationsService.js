// All investigation reads and writes go through this file.
// Demonstration mode keeps data in the browser (localStorage) so you can try
// the UI. Live mode calls the proposed Express endpoints.
// NOTE: the endpoint shapes below are proposed contracts, not an existing backend.

import { apiRequest, isDemoMode } from "./apiClient";
import { mockInvestigations } from "../data/mockInvestigations";
import { createId } from "../utils/ids";

const STORAGE_KEY = "osint_demo_investigations_v1"; // sample data only, never secrets
const wait = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

function loadDemoStore() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // Storage blocked or corrupted: fall back to the sample list.
  }
  return mockInvestigations.map((item) => ({ ...item }));
}

let demoStore = loadDemoStore();

function persistDemoStore() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStore));
  } catch {
    // Ignore: the app still works for this session.
  }
}

function touch(item, changes) {
  return { ...item, ...changes, updatedAt: new Date().toISOString() };
}

export const investigationsService = {
  async list({ signal } = {}) {
    if (!isDemoMode) return apiRequest("/api/investigations", { signal });
    await wait();
    return demoStore.map((item) => ({ ...item }));
  },

  // Saves an unfinished investigation. Nothing is executed.
  async saveDraft(payload) {
    return this._create(payload, "draft");
  },

  // Creates the investigation and asks the backend to run it.
  // In demonstration mode NOTHING runs: the record is only queued locally.
  async launch(payload) {
    const created = await this._create(payload, "queued");
    if (!isDemoMode) await apiRequest(`/api/investigations/${created.id}/run`, { method: "POST" });
    return created;
  },

  async _create(payload, status) {
    if (!isDemoMode) {
      return apiRequest("/api/investigations", { method: "POST", body: { ...payload, status } });
    }
    await wait();
    const now = new Date().toISOString();
    const record = {
      ...payload,
      id: createId("investigation"),
      isSample: false,
      status,
      createdAt: now,
      updatedAt: now,
      lastRunAt: null,
      entityCount: 0,
      evidenceCount: 0,
      exposureCount: 0,
    };
    demoStore = [record, ...demoStore];
    persistDemoStore();
    return record;
  },

  async rename(id, name) {
    if (!isDemoMode) {
      return apiRequest(`/api/investigations/${id}`, { method: "PATCH", body: { name } });
    }
    await wait(150);
    demoStore = demoStore.map((item) => (item.id === id ? touch(item, { name }) : item));
    persistDemoStore();
  },

  async archive(id) {
    if (!isDemoMode) {
      return apiRequest(`/api/investigations/${id}`, { method: "PATCH", body: { status: "archived" } });
    }
    await wait(150);
    demoStore = demoStore.map((item) => (item.id === id ? touch(item, { status: "archived" }) : item));
    persistDemoStore();
  },

  // Copies the configuration only. Findings, entities and evidence are NOT copied.
  async duplicate(id) {
    if (!isDemoMode) return apiRequest(`/api/investigations/${id}/duplicate`, { method: "POST" });
    await wait(150);
    const original = demoStore.find((item) => item.id === id);
    if (!original) return null;
    const now = new Date().toISOString();
    const copy = {
      ...original,
      id: createId("investigation"),
      isSample: false,
      name: `${original.name} (copy)`,
      status: "draft",
      createdAt: now,
      updatedAt: now,
      lastRunAt: null,
      entityCount: 0,
      evidenceCount: 0,
      exposureCount: 0,
    };
    demoStore = [copy, ...demoStore];
    persistDemoStore();
    return copy;
  },

  // Removes the investigation record only. Shared entities and evidence that other
  // investigations reference must stay (the backend enforces this).
  async remove(id) {
    if (!isDemoMode) return apiRequest(`/api/investigations/${id}`, { method: "DELETE" });
    await wait(150);
    demoStore = demoStore.filter((item) => item.id !== id);
    persistDemoStore();
  },

  // Demo-only helper so users can return to the original sample list.
  resetDemoData() {
    demoStore = mockInvestigations.map((item) => ({ ...item }));
    persistDemoStore();
  },
};
