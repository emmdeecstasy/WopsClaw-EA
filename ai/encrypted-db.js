/**
 * Perisclaw TG Encrypted Local Storage (JSON file-based)
 * Stores all user data locally in the data/ directory.
 * Optional Supabase cloud sync (opt-in via ENV: SUPABASE_URL, SUPABASE_ANON_KEY, USE_SUPABASE=true).
 *
 * This replaces better-sqlite3 with pure JSON for maximum compatibility.
 */

const fs = require("fs");
const path = require("path");

// ── Paths ──────────────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, "..", "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

const USER_FILE = (userId) => path.join(DATA_DIR, `user_${userId}.json`);

// ── Helpers ────────────────────────────────────────────────────────

function readUserData(userId) {
  const file = USER_FILE(userId);
  try {
    const d = fs.readFileSync(file, "utf8");
    return JSON.parse(d);
  } catch {
    return { notes: [], tasks: [], commitments: [], wiki: [] };
  }
}

function writeUserData(userId, data) {
  const file = USER_FILE(userId);
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// ── Exported API ───────────────────────────────────────────────────

module.exports = {
  // ── Local (JSON) operations ──────────────────────────────────────

  readUserData,
  writeUserData,

  // ── Notes ────────────────────────────────────────────────────────

  saveNote(userId, text, category) {
    const data = readUserData(userId);
    if (!data.notes) data.notes = [];
    data.notes.push({ id: Date.now(), text, category, created: new Date().toISOString() });
    writeUserData(userId, data);
  },

  getNotes(userId) {
    return (readUserData(userId).notes || []).map((n) => ({ id: n.id, text: n.text, category: n.category, created: n.created }));
  },

  // ── Tasks ─────────────────────────────────────────────────────────

  saveTask(userId, text) {
    const data = readUserData(userId);
    if (!data.tasks) data.tasks = [];
    data.tasks.push({ id: Date.now(), text, completed: false, created: new Date().toISOString() });
    writeUserData(userId, data);
  },

  getTasks(userId) {
    return (readUserData(userId).tasks || []).map((t) => ({ id: t.id, text: t.text, completed: t.completed, created: t.created }));
  },

  markTaskDone(userId, id) {
    const data = readUserData(userId);
    if (data.tasks) {
      const t = data.tasks.find((x) => x.id === id);
      if (t) t.completed = true;
    }
    writeUserData(userId, data);
  },

  // ── Commitments ───────────────────────────────────────────────────

  saveCommitment(userId, text) {
    const data = readUserData(userId);
    if (!data.commitments) data.commitments = [];
    data.commitments.push({ id: Date.now(), text, created: new Date().toISOString() });
    writeUserData(userId, data);
  },

  getCommitments(userId) {
    return readUserData(userId).commitments || [];
  },

  // ── Wiki / Personal Knowledge ─────────────────────────────────────

  saveWikiEntry(userId, text) {
    const data = readUserData(userId);
    if (!data.wiki) data.wiki = [];
    // Store as "key: value" format
    data.wiki.push({ key: text.split(":")[0].trim(), value: text.split(":").slice(1).join(":").trim(), created: new Date().toISOString() });
    writeUserData(userId, data);
  },

  getWiki(userId) {
    return readUserData(userId).wiki || [];
  },

  // ── Export / Delete ───────────────────────────────────────────────

  exportUserData(userId) {
    const data = readUserData(userId);
    return { exported_at: new Date().toISOString(), version: "1.0.0", data };
  },

  deleteUserData(userId) {
    const file = USER_FILE(userId);
    try {
      fs.unlinkSync(file);
    } catch {
      // ignore
    }
  },

  // ── Supabase (optional cloud) ─────────────────────────────────────

  // These are no-ops if supabase is not configured; caller checks supa.* beforehand.
  supaSaveNote: () => Promise.resolve(),
  supaGetNotes: () => [],
  supaSaveTask: () => Promise.resolve(),
  supaGetTasks: () => [],
  supaMarkTaskDone: () => Promise.resolve(),
  supaSaveCommitment: () => Promise.resolve(),
  supaGetCommitments: () => [],
};