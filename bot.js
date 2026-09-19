#!/usr/bin/env node
/**
 * Perisclaw TG - Open Source Telegram Executive Assistant
 * Local-first, privacy-focused, MIT-licensed
 * Run: node bot.js
 * Set env: BOT_TOKEN=your_telegram_token
 */

const botToken = process.env.BOT_TOKEN;
if (!botToken) {
  console.error("❌ BOT_TOKEN environment variable required");
  console.error("   Set: BOT_TOKEN=your_telegram_token");
  process.exit(1);
}

// Simple in-memory / JSON storage (no native modules needed)
const DATA_DIR = "./data";
require("fs").mkdirSync(DATA_DIR, { recursive: true });

// User data file path
function userFile(id) {
  return `${DATA_DIR}/user_${id}.json`;
}

function loadUser(id) {
  try {
    const d = require("fs").readFileSync(userFile(id), "utf8");
    return JSON.parse(d);
  } catch {
    return { notes: [], tasks: [], commitments: [], wiki: [] };
  }
}

function saveUser(id, data) {
  require("fs").writeFileSync(userFile(id), JSON.stringify(data, null, 2));
}

// ── Telegram API helper ──────────────────────────────────────────
function sendMsg(chatId, text, parseMode) {
  const https = require("https");
  const params = new (require("url").URLSearchParams)({ chat_id: chatId, text, parse_mode });
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?${params}`;
  https.get(url);
}

// ── Command handlers ─────────────────────────────────────────────

function cmdHelp(chatId) {
  sendMsg(chatId, `
🤖 *Perisclaw TG - Telegram Executive Assistant*

*Core Commands:*
/hello - Greeting
/help - This message
/ea <question> - EA‑aware questions
/commitment <text> - Save a commitment
/promises - List your commitments
/remember <text> / /notes - Save/view notes
/addtask <text> / /done <id> - Task management
/schedule <text> - Schedule an event
/search <query> - Search your data
/wiki <text> - Personal knowledge wiki
/export-data - Export all your data
/delete-data - Delete all your data

*Your data never leaves your device without your consent.*
`.trim(), "Markdown");
}

function cmdHello(chatId, fromName) {
  const date = new Date();
  sendMsg(chatId, `*Hello, ${fromName}! 👋*

Welcome to Perisclaw TG, your effective‑altruism executive assistant.

*Today is* ${date.toLocaleDateString("en-US", { weekday: "long" })} – a new opportunity to maximize your impact.

I'm here to help you with:
✅ Commitment tracking and follow‑ups
✅ Task management
✅ Note‑taking and personal wiki
✅ EA‑informed decision support
✅ Scheduling and reminders

*How can I help you today?*

*Try:* /ea "Should I donate to AMF or GiveDirectly?"
/commitment "I will donate $50 to AMF by month‑end"`.trim(), "Markdown");
}

function cmdEa(chatId, query) {
  if (!query) return sendMsg(chatId, "Ask me an effective‑altruism question!\n\n`/ea \"Should I donate to AMF or GiveDirectly?`");

  const q = q.toLowerCase();

  // QALY/DALY
  if (q.includes("qal") || q.includes("dal")) {
    return sendMsg(chatId, `QALYs and DALYs are the standard quantitative measures in effective altruism for comparing the health impact of different interventions.

QALY: 1 QALY = 1 year of perfect health. Used to measure the value of health interventions.
DALY: Measures overall disease burden, combining years of life lost and years lived with disability.

Your question: "${query}"`);
  }

  // AMF/GiveDirectly
  if (q.includes("amf") || q.includes("givedirectly") || q.includes("donate")) {
    return sendMsg(chatId, `Based on effective altruism principles:

*Against Malaria Foundation (AMF)*
- Highly recommended charity
- $50 prevents 1 malaria death
- Distributes insecticide‑treated nets

*GiveDirectly*
- Direct cash transfers to people in poverty
- Evidence‑based poverty reduction

*Recommendation*: AMF for maximal health impact per dollar; diversify if you value cash flexibility.

Your question: "${query}"`);
  }

  // Default EA framework
  sendMsg(chatId, `I'll help you think through this from an effective altruism perspective.

*Key EA Frameworks*:
1. *Scale*: How many people are affected?
2. *Solvability*: How effective are the solutions?
3. *Neglectedness*: How under‑funded is the area?

*Your question*: "${query}"

*General approach*: Consider the three frameworks above, look at the evidence, and weigh the trade‑offs. Would you like me to look up specific charities or frameworks related to your question?`);
}

function cmdCommitment(chatId, text, fromId) {
  if (!text) return sendMsg(chatId, "What commitment would you like to save?\n\n`/commitment I will donate $50 to AMF by month‑end`");

  const data = loadUser(fromId);
  if (!data.commitments) data.commitments = [];
  data.commitments.push({ id: Date.now(), text, created: new Date().toISOString() });
  saveUser(fromId, data);

  sendMsg(chatId, `✅ Commitment saved: "${text}"\n\nUse /promises to see all your commitments.`);
}

function cmdPromises(chatId, fromId) {
  const data = loadUser(fromId);
  const items = data.commitments || [];

  if (items.length === 0) return sendMsg(chatId, "No commitments yet. Use /commitment <text> to save your first one.");

  const text = items.map((t, i) => `${i + 1}. ${t}`).join("\n");
  sendMsg(chatId, `*Your Commitments*:\n${text}`);
}

function cmdRemember(chatId, text, fromId) {
  if (!text) return sendMsg(chatId, "What would you like me to remember?\n\n`/remember buy milk`");

  const data = loadUser(fromId);
  if (!data.notes) data.notes = [];
  data.notes.push({ id: Date.now(), text, category: "reminder", created: new Date().toISOString() });
  saveUser(fromId, data);

  sendMsg(chatId, `✅ Remembered: "${text}"\n\nUse /notes to view all your notes.`);
}

function cmdNotes(chatId, fromId) {
  const data = loadUser(fromId);
  const notes = data.notes || [];

  if (notes.length === 0) return sendMsg(chatId, "No notes yet. Use /remember <text> to save notes.");

  const text = notes.map(n => `- ${n.text} (${n.category})`).join("\n");
  sendMsg(chatId, `*Your Notes*:\n${text}`);
}

function cmdAddTask(chatId, text, fromId) {
  if (!text) return sendMsg(chatId, "What task would you like to add?\n\n`/addtask Finish the foundation`");

  const data = loadUser(fromId);
  if (!data.tasks) data.tasks = [];
  data.tasks.push({ id: Date.now(), text, completed: false, created: new Date().toISOString() });
  saveUser(fromId, data);

  sendMsg(chatId, `✅ Task added: "${text}"\n\nUse /done <id> to mark it complete.`);
}

function cmdDone(chatId, id, fromId) {
  if (!id) return sendMsg(chatId, "Which task do you want to mark as done?\n\n`/done 123456`");

  const data = loadUser(fromId);
  if (data.tasks) {
    const t = data.tasks.find((x) => x.id === Number(id));
    if (t) t.completed = true;
  }
  saveUser(fromId, data);

  sendMsg(chatId, "✅ Task marked as done!");
}

function cmdSearch(chatId, query, fromId) {
  if (!query) return sendMsg(chatId, "Search what?\n\n`/search budget 2024`");

  const data = loadUser(fromId);
  const results = [];

  if (data.notes?.some((n) => n.text.toLowerCase().includes(query.toLowerCase()))) {
    results.push(...data.notes.filter((n) => n.text.toLowerCase().includes(query.toLowerCase())).map((n) => `Note: ${n.text}`));
  }
  if (data.tasks?.some((t) => t.text.toLowerCase().includes(query.toLowerCase()))) {
    results.push(...data.tasks.filter((t) => t.text.toLowerCase().includes(query.toLowerCase())).map((t) => `Task: ${t.text}`));
  }
  if (data.commitments?.some((c) => c.text.toLowerCase().includes(query.toLowerCase()))) {
    results.push(...data.commitments.filter((c) => c.text.toLowerCase().includes(query.toLowerCase())).map((c) => `Commitment: ${c.text}`));
  }

  if (results.length === 0) return sendMsg(chatId, `No results found for "${query}".`);

  sendMsg(chatId, `*Search results for "${query}":*\n${results.slice(0, 10).join("\n")}`);
}

function cmdWiki(chatId, text, fromId) {
  if (!text) return sendMsg(chatId, "What would you like to add to your personal wiki?\n\n`/wiki Alice: loves sushi, works at Acme`");

  const data = loadUser(fromId);
  if (!data.wiki) data.wiki = [];
  data.wiki.push({ key: text.split(":")[0].trim(), value: text.split(":").slice(1).join(":").trim(), created: new Date().toISOString() });
  saveUser(fromId, data);

  sendMsg(chatId, `✅ Wiki entry saved: "${text}"`);
}

// ── Telegram polling ─────────────────────────────────────────────

function getUpdates(offset = 0) {
  const https = require("https");
  const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&limit=100&timeout=30`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let d = "";
      res.on("data", (c) => d += c);
      res.on("end", () => {
        try { resolve(JSON.parse(d)); } catch { resolve({ ok: false, result: [] }); }
      });
    }).on("error", () => resolve({ ok: false, result: [] }));
  });
}

let lastOffset = 0;

// Main loop
;(async () => {
  console.log(`▶️ Perisclaw TG starting...\n🤖 Bot: ${botToken.substring(0, 6)}...${botToken.substring(botToken.length - 6)}\n🌥️ Cloud sync: local-only\n📁 Data: ./data\n`);
  while (true) {
    const resp = await getUpdates(lastOffset);
    if (resp.ok && resp.result?.length) {
      for (const u of resp.result) {
        lastOffset = u.update_id + 1;
        const m = u.message;
        if (!m?.text || m.from?.is_bot || m.from.id == null) continue;

        const chatId = m.chat.id, fromId = m.from.id, fromName = m.from.first_name || "Friend", txt = m.text;

        if (!txt.startsWith("/")) continue;

        const parts = txt.split(/\s+/), cmd = parts[0].toLowerCase(), args = parts.slice(1).join(" ");

        switch (cmd) {
          case "/hello": cmdHello(chatId, fromName); break;
          case "/help": cmdHelp(chatId); break;
          case "/ea": cmdEa(chatId, args); break;
          case "/commitment": cmdCommitment(chatId, args, fromId); break;
          case "/promises": cmdPromises(chatId, fromId); break;
          case "/remember": cmdRemember(chatId, args, fromId); break;
          case "/notes": cmdNotes(chatId, fromId); break;
          case "/addtask": cmdAddTask(chatId, args, fromId); break;
          case "/done": cmdDone(chatId, args, fromId); break;
          case "/search": cmdSearch(chatId, args, fromId); break;
          case "/wiki": cmdWiki(chatId, args, fromId); break;
          case "/export-data": cmdExport(chatId, fromId); break;
          case "/delete-data": cmdDelete(chatId, fromId); break;
          default: sendMsg(chatId, `Unknown command: ${cmd}\n\n/type /help for commands`);
        }
      }
    }
    await new Promise(r => setTimeout(r, 1000));
  }
})();