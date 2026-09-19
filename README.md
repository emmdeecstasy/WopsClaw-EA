# WopsClaw - Open Source Telegram Executive Assistant

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-26A5E2?style=flat-square&logo=telegram)](https://core.telegram.org/bots)

## 🚀 Quick Start

### 1. Install

```bash
git clone https://github.com/controlplusacompany/WopsClaw.git
cd WopsClaw
npm install
```

### 2. Set Up Your Bot Token

1. Open Telegram and find `@BotFather`
2. Send `/newbot` to create a new bot
3. Choose a name and username (e.g., `WopsClawBot`)
4. You receive a **bot token** - copy it

5. Create a `.env` file in the root:

```env
BOT_TOKEN=your_telegram_bot_token_here
```

6. Start the bot:

```bash
npm start
# or: node bot.js
```

7. On Telegram, find your bot and send `/start`

### 3. Start Using

In Telegram, try these commands:

| Command | What It Does |
|---------|-------------|
| `/hello` | EA greeting with date |
| `/help` | Show all 13 commands |
| `/ea "your question"` | EA‑aware answers |
| `/commitment "text"` | Save a commitment |
| `/promises` | List all commitments |
| `/remember "text"` | Save a reminder/note |
| `/notes` | View all your notes |
| `/addtask "text"` | Add a task |
| `/done <id>` | Mark task as complete |
| `/search "query"` | Search your data |
| `/wiki "key: value"` | Add to personal wiki |
| `/export-data` | Export all your data as JSON |
| `/delete-data` | Permanently delete all local data |

## 🛡️ Privacy & Security

### By Default: 100% Local-First

- **All data stays on your device** - no cloud dependency
- **No analytics, no telemetry** without your consent
- **`/export-data`** gives you full control - download your JSON data
- **`/delete-data`** permanently wipes all local data

### Optional Cloud Sync (Opt-In)

You can enable cloud sync if desired:

```bash
# Set Supabase credentials (one-time):
set SUPABASE_URL=https://your-project.supabase.io
set SUPABASE_ANON_KEY=your-anon-key
set USE_SUPABASE=true

# Then restart:
npm start
```

- **Supabase PostgreSQL** (500MB free tier)
- Your data syncs when the bot runs
- You can self-host Supabase for zero-trust
- All cloud sync is **completely optional** - disable by removing the env vars

### Data Safety

| Action | What Happens |
|--------|-------------|
| `/export-data` | Exports `user_<id>.json` to JSON string - you choose where to save it |
| `/delete-data` | Deletes `./data/user_<id>.json` permanently |
| No cloud creds set | Data stays entirely on your device |

## 📦 Repository Structure

```
WopsClaw/
├── bot.js                 ← Main Telegram bot (~10KB)
├── package.json           ← MIT-licensed project config
├── .env.example           ← Environment variables template
├── .gitignore             ← Git ignore rules
├── ai/
│   ├── encrypted-db.js    ← JSON file storage (no native modules)
│   ├── knowledge-base.json← EA frameworks, charities, FAQ
│   └── system-prompt.md   ← EA‑aware system prompt
├── data/                  ← User data (gitignored, per-user JSON files)
├── README.md              ← This file
└── scripts/               ← Setup guides (optional)
```

## 📦 Installation

### Option A: Clone & Run (Recommended)

```bash
git clone https://github.com/controlplusacompany/WopsClaw.git
cd WopsClaw
npm install
# Set your bot token:
set BOT_TOKEN=your_telegram_bot_token_here
# Linux/Mac: export BOT_TOKEN=your_telegram_bot_token_here
npm start
```

### Option B: Docker (Future)

Docker support is planned for Phase 3.

### Option C: Self-Hosting

1. Fork the repo on GitHub
2. Modify as desired (MIT licensed - free to modify)
3. Host your own instance
4. Users connect to your bot token

## 📖 Usage

### After Starting the Bot

1. Open Telegram and find your bot (search by username)
2. Send `/start` toinitialize
3. Send `/help` to see all commands

### Command Reference

#### Core Commands

| Command | Description |
|---------|-------------|
| `/hello` | EA greeting with current date |
| `/help` | List all 13 commands with descriptions |
| `/ea <question>` | Answer effective‑altruism questions (QALYs, DALYs, AMF vs GiveDirectly, cause‑area frameworks) |

#### Commitment Tracking

| Command | Description |
|---------|-------------|
| `/commitment "text"` | Save a commitment/promise with a deadline |
| `/promises` | List all your saved commitments |

#### Note‑Taking & Wiki

| Command | Description |
|---------|-------------|
| `/remember "text"` | Save a reminder or note |
| `/wiki "key: value"` | Add a key‑value entry to your personal wiki |
| `/notes` | View all your saved notes and reminders |

#### Task Management

| Command | Description |
|---------|-------------|
| `/addtask "text"` | Add a new task |
| `/done <id>` | Mark task (by ID) as complete |
| `/tasks` *(custom npm script)* | Show count of active (uncompleted) tasks |

#### Search & Discovery

| Command | Description |
|---------|-------------|
| `/search "query"` | Search your notes, tasks, and commitments for the query text |

#### Personal Knowledge

| Command | Description |
|---------|-------------|
| `/wiki "key: value"` | Add an entry to your personal wiki (e.g., `Alice: loves sushi, works at Acme`) |
| *(custom npm scripts available)* | Show commitment/notes counts via `npm run commitments`, `npm run notes`, `npm run tasks` |

#### Data Management

| Command | Description |
|---------|-------------|
| `/export-data` | Export all your data as JSON (includes locale‑date timestamp, version, and your data) |
| `/delete-data` | Permanently delete your local data file `./data/user_<id>.json` |

#### Scheduling

| Command | Description |
|---------|-------------|
| `/schedule "text"` | Log a scheduled event/reminder text |

## 🛡️ Privacy & Data Control

### What Data Is Collected

Only what you explicitly create through the bot's commands:

- Commitments you save via `/commitment`
- Notes/reminders via `/remember`
- Tasks added via `/addtask`
- Wiki entries via `/wiki`
- Search queries (local only)

### What Is NOT Collected

- ❌ No analytics tracking
- ❌ No telemetry sent without opt-in
- ❌ No data sent to external services without your explicit cloud‑sync configuration
- ❌ No third‑party advertising

### Your Rights

- **Export**: `/export-data` gives you a JSON file of all your data that you can keep, back up, or analyze
- **Delete**: `/delete-data` permanently wipes your local data file - this cannot beundone
- **Switch off**: Remove `USE_SUPABASE=true` (or `USE_TURSO=true`) from `.env` at any time to revert to pure local‑first mode
- **Self‑host**: The MIT license means you can fork, modify, and host your own version entirely

### Cloud Sync (Optional)

If you set `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `USE_SUPABASE=true` in `.env`:

- Your data also lives in Supabase (500MB free tier)
- Changes sync when the bot runs
- You can view/manage data via the Supabase dashboard
- To disable: remove the three env vars and restart

## 🛠️ Development & Customization

### For Developers

- **MIT Licensed** - free to use, modify, and distribute
- **No native module rebuilds** - pure Node.js + JSON + Fetch API
- **Easy onboarding** - `npm install` then `npm start`
- **Extensible** - add custom skills in `skills/` directory
- **Cloud‑optional** - Supabase/Turso integration via environment variables

### Adding New Commands

1. Edit `bot.js` and add a new `case` in the command‑switch section
2. Or add an npm script in `package.json` scripts (see below)
3. Run `npm install` (no rebuild needed for shell‑based scripts)

Example npm script addition:

```json
"scripts": {
  "migrate": "node scripts/migrate.js",
  "backup": "node scripts/backup.js"
}
```

### Project Structure for Hacking

```
WopsClaw/
├── bot.js                ← Main bot logic (modify commands here)
├── package.json          ← Scripts & dependencies
├── ai/
│   ├── system-prompt.md  ← EA system prompt (modify EA context)
│   └── knowledge-base.json← EA frameworks, charities, FAQ (modify content)
├── data/                 ← User data (DO NOT commit; gitignored)
├── scripts/              ← Helper scripts (setup, backup, migrate)
└── .env.example          ← Template for users (.env created at install)
```

## 🐞 Troubleshooting

### "BOT_TOKEN environment variable required"

- **Fix**: Set `BOT_TOKEN` in `.env` or as an environment variable:
  - Windows: `set BOT_TOKEN=your_token`
  - Linux/Mac: `export BOT_TOKEN=your_token`

### "Cannot find module 'better-sqlite3'"

- **Fix**: Run `npm install` to install dependencies
- Note: The bot uses JSON file storage by design - `better-sqlite3` is listed but the `ai/encrypted-db.js` uses JSON for maximum compatibility

### Bot doesn't respond

- **Fix**: 
  1. Ensure `npm start` is running
  2. Make sure you're messaging the correct bot username in Telegram
  3. Send `/start` first to initialize the bot
  4. Check that `.env` has `BOT_TOKEN=your_token`

### Data lost after `/delete-data`

- **Expected behavior**: The command permanently deletes `./data/user_<id>.json`
- **Recovery**: Not possible - this is by design for privacy
- **Backup**: Use `/export-data` to create a backup before deleting

### Cloud sync not working

- **Fix**: Ensure all three env vars are set: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `USE_SUPABASE=true`
- Restart the bot after changing `.env`
- See `scripts/setup.md` (generated on first run) for Supabase setup steps

## 📬 Need Help?

- **GitHub Issues**: https://github.com/controlplusacompany/WopsClaw/issues
- **License**: MIT - free to use, modify, and distribute
- **Community**: The Effective Altruism community welcome!

## Version

**WopsClaw v1.0.0** - Core commit tracking, notes, tasks, wiki, search, export/delete

---
*Made with ❤️ for privacy‑focused AI assistants.*
