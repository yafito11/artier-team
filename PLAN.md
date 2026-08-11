# PLAN.md — Artier Team Development Plan

**Versi:** 1.0
**Tanggal:** 11 Agustus 2026
**Status:** Draft — Menunggu Review

---

## 1. Execution Order (Fase Eksekusi)

Berdasarkan prompt.md Section 5, urutan eksekusi yang benar:

| Fase | Deskripsi | Dependencies |
|------|-----------|--------------|
| **Fase 0** | Design-System HTML statis (tokens + komponen) | ✅ Tidak ada — bisa mulai sekarang |
| **Fase 1** | Setup Next.js + Tailwind 4 + shadcn/ui + migrasi token | Fase 0 selesai |
| **Fase 2** | Install AI Elements per komponen sesuai mapping | Fase 1 selesai |
| **Fase 3** | Setup AI SDK v7 (provider adapter, /models auto-detect) | Fase 2 selesai |
| **Fase 4** | Postgres schema + migration + CRUD Agent/Sub Agent/Skill/Agent Team | Fase 3 selesai |
| **Fase 5** | Agent Builder via Prompt | Fase 4 selesai |
| **Fase 6** | OpenSandbox integration + CLI execution | Fase 5 selesai |
| **Fase 7** | Automation/cron scheduling | Fase 6 selesai |

---

## 2. Breakdown Task per Milestone

### M1 — Core Chat + Provider Config

| Task | Fase | Status |
|------|------|--------|
| [ ] Bangun HTML statis: tokens.css (color, spacing, radius, shadow, font, z-index) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Bangun HTML statis: base.css (reset, typography, utilities) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Bangun HTML statis: sidebar panel (New Chat, Search, Agent list, Agent Team, Skill, Automation, toggle) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Bangun HTML statis: composer (PromptInput, attachment button, dropdown Agent Team, Manage Model, Send) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Bangun HTML statis: conversation/message stream (user vs assistant bubbles, timestamp, actions) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Bangun HTML statis: style-guide.html (showcase semua komponen) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Setup Next.js App Router + Tailwind 4 + shadcn/ui init | Fase 1 | ⏳ Tunggu Fase 0 |
| [ ] Migrasi tokens.css → globals.css (mapping 1:1 CSS variables) | Fase 1 | ⏳ Tunggu Fase 0 |
| [ ] Install AI Elements: conversation, message, prompt-input, model-selector | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Porting sidebar + composer dari HTML ke React components | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Porting conversation stream dari HTML ke React components | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Setup AI SDK v7 provider adapter (OpenAI-compatible) | Fase 3 | ⏳ Tunggu Fase 2 |
| [ ] Setup AI SDK v7 provider adapter (Anthropic-compatible) | Fase 3 | ⏳ Tunggu Fase 2 |
| [ ] Implement /models auto-detect endpoint + UI checklist | Fase 3 | ⏳ Tunggu Fase 2 |
| [ ] Chat streaming endpoint (POST /api/chat) dengan streamText | Fase 3 | ⏳ Tunggu Fase 2 |
| [ ] Deploy awal Docker Compose (app + Postgres) ke Oracle Cloud | Fase 1 | ⏳ Tunggu Fase 1 |

### M2 — Agent & Sub Agent Manual Builder

| Task | Fase | Status |
|------|------|--------|
| [ ] Postgres schema: providers, models, agents, agent_teams, skills | Fase 4 | ⏳ Tunggu Fase 3 |
| [ ] CRUD API: /api/agents, /api/agent-teams, /api/skills | Fase 4 | ⏳ Tunggu Fase 4 |
| [ ] Install AI Elements: agent (card read-only + editable form) | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Bangun HTML statis: agent-list.html (card grid/list) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Bangun HTML statis: agent-form.html (manual form + toggle "Builder via Prompt") | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Porting agent list + form ke React components | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Integrasikan Agent/Sub Agent selection di chat (via /nama-agent slash command) | Fase 3 | ⏳ Tunggu Fase 3 |
| [ ] Model selection per Agent (override Manage Model global) | Fase 3 | ⏳ Tunggu Fase 3 |

### M3 — Agent Builder via Prompt

| Task | Fase | Status |
|------|------|--------|
| [ ] Bangun HTML statis: agent-form.html (mode "Agent Builder via Prompt") | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Implement POST /api/builder/generate (Single Agent + Agent Team) | Fase 5 | ⏳ Tunggu Fase 4 |
| [ ] Install AI Elements: prompt-input, confirmation (preview + approve) | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Porting Agent Builder UI (prompt input → preview → save) | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Integrasi LLM generate: struktur JSON sesuai skema Agent/AgentTeam | Fase 5 | ⏳ Tunggu Fase 4 |
| [ ] Validasi + save hasil generate ke Postgres | Fase 5 | ⏳ Tunggu Fase 4 |

### M4 — Skill Engine + Sandbox CLI

| Task | Fase | Status |
|------|------|--------|
| [ ] Bangun HTML statis: skill-list.html (list + tombol Create Skill) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Bangun HTML statis: skill-form.html (prompt-only vs cli-executable) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Bangun HTML statis: tool-execution-demo.html (status running/success/error + confirmation) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Install AI Elements: tool, confirmation, code-block | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Porting skill list + form ke React components | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Porting tool execution card ke React components | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Setup OpenSandbox runtime (Docker mode) di Docker Compose | Fase 6 | ⏳ Tunggu Fase 5 |
| [ ] Implement POST /api/skills/:id/execute (CLI execution via OpenSandbox) | Fase 6 | ⏳ Tunggu Fase 5 |
| [ ] Streaming output command ke chat bubble (AI SDK Terminal UI primitive) | Fase 6 | ⏳ Tunggu Fase 5 |
| [ ] Tool approval flow (AI SDK v7 agent-level tool approvals) | Fase 6 | ⏳ Tunggu Fase 5 |

### M5 — Agent Team Mode (Org Chat)

| Task | Fase | Status |
|------|------|--------|
| [ ] Bangun HTML statis: agent-team-org.html (org chart Lead → Sub Agent) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Install AI Elements: canvas (React Flow) untuk org structure | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Porting Agent Team org structure ke React (React Flow nodes) | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Dropdown Agent Team selection di Composer | Fase 2 | ⏳ Tunggu Fase 1 |
| [ ] Orkestrasi Agent → Sub Agent (AI SDK v7 WorkflowAgent + subagents) | Fase 3 | ⏳ Tunggu Fase 3 |
| [ ] Routing: Agent Team mode → hanya agent dalam team yang aktif | Fase 3 | ⏳ Tunggu Fase 3 |
| [ ] Model per Agent/Sub Agent (bukan Manage Model global) | Fase 3 | ⏳ Tunggu Fase 3 |

### M6 — Automation (Scheduled Task/Cron)

| Task | Fase | Status |
|------|------|--------|
| [ ] Bangun HTML statis: automation-list.html (list + status badge) | Fase 0 | 🟢 Bisa mulai sekarang |
| [ ] Postgres schema: automations table | Fase 4 | ⏳ Tunggu Fase 3 |
| [ ] CRUD API: /api/automations | Fase 4 | ⏳ Tunggu Fase 4 |
| [ ] Cron scheduler (node-cron atau similar) + Docker Compose service | Fase 7 | ⏳ Tunggu Fase 6 |
| [ ] Execution logging + status update (last_run, next_run) | Fase 7 | ⏳ Tunggu Fase 6 |
| [ ] Porting automation list ke React components | Fase 2 | ⏳ Tunggu Fase 1 |

---

## 3. Proposed Folder Structure

```
artier-team/
├── design-system/                    # Fase 0: HTML statis
│   ├── tokens.css                    # Design tokens (CSS variables)
│   ├── base.css                      # Reset, typography, utilities
│   ├── components/                   # CSS per komponen
│   │   ├── button.css
│   │   ├── sidebar.css
│   │   ├── composer.css
│   │   ├── conversation.css
│   │   ├── message.css
│   │   ├── tool-execution.css
│   │   ├── code-block.css
│   │   ├── agent-card.css
│   │   ├── form.css
│   │   ├── modal.css
│   │   └── badge.css
│   ├── pages/
│   │   ├── index.html                # Chatbot Mode (sidebar + composer kosong)
│   │   ├── chat-session.html         # Chat aktif + message stream
│   │   ├── agent-team-org.html       # Org structure view
│   │   ├── agent-list.html           # Agent card grid
│   │   ├── agent-form.html           # Create/edit Agent + Builder via Prompt
│   │   ├── skill-list.html           # Skill list
│   │   ├── skill-form.html           # Create/edit Skill
│   │   ├── automation-list.html      # Automation list
│   │   ├── provider-settings.html    # Manage Provider + auto-detect model
│   │   └── tool-execution-demo.html  # Tool/skill execution card demo
│   └── style-guide.html              # Showcase semua komponen
│
├── src/                              # Fase 1+: Next.js App Router
│   ├── app/                          # App Router pages
│   │   ├── layout.tsx                # Root layout (sidebar + theme provider)
│   │   ├── page.tsx                  # Home/chatbot mode
│   │   ├── chat/[sessionId]/page.tsx # Chat aktif
│   │   ├── agents/page.tsx           # Agent list
│   │   ├── agents/[id]/page.tsx      # Agent detail/edit
│   │   ├── agents/builder/page.tsx   # Agent Builder via Prompt
│   │   ├── teams/page.tsx            # Agent Team list
│   │   ├── teams/[id]/page.tsx       # Agent Team detail + org structure
│   │   ├── skills/page.tsx           # Skill list
│   │   ├── skills/[id]/page.tsx      # Skill detail/edit
│   │   ├── automations/page.tsx      # Automation list
│   │   └── settings/providers/page.tsx # Provider config + auto-detect
│   │
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui primitives
│   │   ├── ai-elements/              # Installed AI Elements
│   │   ├── sidebar/                  # Sidebar panel custom
│   │   ├── composer/                 # Composer (PromptInput + dropdowns)
│   │   ├── chat/                     # Conversation + Message stream
│   │   ├── agents/                   # Agent cards, forms, builder
│   │   ├── teams/                    # Agent Team org structure (React Flow)
│   │   ├── skills/                   # Skill cards, forms, execution
│   │   ├── automations/              # Automation list
│   │   └── settings/                 # Provider config UI
│   │
│   ├── lib/                          # Utilities & configurations
│   │   ├── db/                       # Drizzle ORM setup + schema
│   │   │   ├── schema/               # Table definitions
│   │   │   │   ├── providers.ts
│   │   │   │   ├── models.ts
│   │   │   │   ├── agents.ts
│   │   │   │   ├── agent-teams.ts
│   │   │   │   ├── skills.ts
│   │   │   │   ├── sessions.ts
│   │   │   │   ├── messages.ts
│   │   │   │   └── automations.ts
│   │   │   ├── index.ts              # Drizzle client
│   │   │   └── migrations/           # Generated migrations
│   │   │
│   │   ├── ai/                       # AI SDK v7 setup
│   │   │   ├── providers/            # Provider adapters
│   │   │   │   ├── openai-compatible.ts
│   │   │   │   └── anthropic-compatible.ts
│   │   │   ├── models.ts             # Model registry + auto-detect logic
│   │   │   ├── workflow.ts           # WorkflowAgent setup
│   │   │   └── tools.ts              # Tool definitions (Skill execution)
│   │   │
│   │   ├── sandbox/                  # OpenSandbox client
│   │   │   ├── client.ts             # OpenSandbox API client
│   │   │   └── executor.ts           # CLI execution wrapper
│   │   │
│   │   ├── scheduler/                # Automation/cron
│   │   │   └── cron.ts               # node-cron scheduler
│   │   │
│   │   └── utils.ts                  # Shared utilities
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-chat.ts               # AI SDK useChat wrapper
│   │   └── use-agents.ts             # Agent CRUD hooks
│   │
│   └── types/                        # TypeScript types
│       ├── agent.ts
│       ├── skill.ts
│       ├── team.ts
│       └── provider.ts
│
├── drizzle.config.ts                 # Drizzle ORM config
├── docker-compose.yml                # app + postgres + opensandbox + cloudflared
├── Dockerfile                        # Next.js app
├── next.config.ts                    # Next.js config
├── tailwind.config.ts                # Tailwind config (extend tokens)
├── package.json
└── .env.local                        # Environment variables (provider keys, DB URL)
```

---

## 4. Dependencies per Fase

### Fase 0 — Design-System HTML
```
# Tidak perlu npm install — cukup Tailwind via CDN (opsional)
# Semua file murni HTML + CSS
```

### Fase 1 — Setup Next.js + Tailwind + shadcn
```json
{
  "dependencies": {
    "next": "latest",
    "react": "^19",
    "react-dom": "^19",
    "tailwindcss": "^4",
    "postcss": "latest",
    "@shadcn/ui": "latest"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest"
  }
}
```

### Fase 2 — Install AI Elements
```bash
npx ai-elements@latest add conversation
npx ai-elements@latest add message
npx ai-elements@latest add prompt-input
npx ai-elements@latest add model-selector
npx ai-elements@latest add agent
npx ai-elements@latest add tool
npx ai-elements@latest add confirmation
npx ai-elements@latest add code-block
npx ai-elements@latest add canvas        # React Flow for org structure
npx ai-elements@latest add reasoning     # optional
```

### Fase 3 — Setup AI SDK v7
```json
{
  "dependencies": {
    "ai": "^4.0",
    "@ai-sdk/openai": "latest",
    "@ai-sdk/anthropic": "latest",
    "@ai-sdk/provider": "latest"
  }
}
```

### Fase 4 — Database & ORM
```json
{
  "dependencies": {
    "drizzle-orm": "latest",
    "postgres": "latest",
    "drizzle-kit": "latest"
  }
}
```

### Fase 5 — Agent Builder (no new deps, uses AI SDK from Fase 3)

### Fase 6 — OpenSandbox
```json
{
  "dependencies": {
    "opensandbox": "latest"
  }
}
```

### Fase 7 — Automation/Cron
```json
{
  "dependencies": {
    "node-cron": "latest"
  },
  "devDependencies": {
    "@types/node-cron": "latest"
  }
}
```

---

## 5. Risiko & Blockers

| # | Risk/Blocker | Likelihood | Impact | Mitigation |
|---|-------------|------------|--------|------------|
| 1 | **KVM support tidak tersedia di Oracle Cloud Free Tier ARM shape** — Firecracker microVM OpenSandbox butuh KVM/nested virtualization | Medium | Tinggi | Fase 0-5 tidak terpengaruh. Saat Fase 6, fallback ke Docker runtime mode (bukan Firecracker). Jika tetap gagal, pertimbangkan tunda CLI execution ke fase 2 dan fokus prompt-only skills dulu. |
| 2 | **Anthropic-compatible adapter format berbeda dari OpenAI** — request/response format, streaming protocol, tool calling format tidak identik | Medium | Sedang | Buat dua adapter terpisah (sudah direncanakan di PRD). Validasi dengan 2 provider real sebelum M1 selesai. Catat: Anthropic streaming pakai SSE format berbeda dari OpenAI. |
| 3 | **AI Elements komponen belum stabil/berubah API** — library "copy-to-codebase" bisa berubah tanpa notice | Medium | Sedang | Lock versi AI Elements di package.json. Saat install, catat versi yang dipakai. Siapkan fallback: komponen custom di atas shadcn/ui jika AI Elements tidak tersedia untuk kebutuhan spesifik. |
| 4 | **Oracle Cloud Free Tier resource terbatas** (4 OCPU ARM + 24GB RAM) — app + Postgres + OpenSandbox mungkin tipis | Low | Sedang | Gunakan Docker Compose dengan resource limits. OpenSandbox mode Docker (bukan K8s). Monitoring via docker stats. Jika tidak cukup, pertimbangkan pisahkan Postgres ke Always Free Autonomous Database Oracle. |
| 5 | **AI SDK v7 rilis baru (25 Juni 2026)** — mungkin ada breaking changes atau bug | Low | Tinggi | Cek changelog/migration guide. Mulai dengan fitur stabil (streamText, useChat). WorkflowAgent dan subagents adalah fitur baru — siapkan fallback manual orchestration jika perlu. |
| 6 | **Auto-detect /models endpoint tidak konsisten antar provider** — beberapa provider mungkin tidak expose /v1/models atau format respons beda | High | Sedang | Implement fallback: user input model name manual jika auto-detect gagal. Test dengan minimal 2 provider real (OpenRouter untuk OpenAI-compatible, Anthropic langsung). |
| 7 | **OpenSandbox tidak punya official SDK TypeScript** — mungkin perlu REST client manual | Medium | Rendah | Bisa REST client sederhana ke OpenSandbox API. Cek dokumentasi API di GitHub Alibaba. |

---

## 6. Task Dependency Matrix

### 🟢 Bisa Dikerjakan Sekarang (Tanpa Dependency)
- [ ] Design-System HTML: tokens.css
- [ ] Design-System HTML: base.css
- [ ] Design-System HTML: sidebar panel
- [ ] Design-System HTML: composer
- [ ] Design-System HTML: conversation/message stream
- [ ] Design-System HTML: tool execution card demo
- [ ] Design-System HTML: agent-list.html
- [ ] Design-System HTML: agent-form.html (manual + builder via prompt mode)
- [ ] Design-System HTML: agent-team-org.html (org chart)
- [ ] Design-System HTML: skill-list.html
- [ ] Design-System HTML: skill-form.html
- [ ] Design-System HTML: automation-list.html
- [ ] Design-System HTML: provider-settings.html
- [ ] Design-System HTML: style-guide.html

### ⏳ Harus Menunggu Task Sebelumnya
| Task | Depends On |
|------|-----------|
| Setup Next.js + Tailwind + shadcn | Design-System HTML selesai |
| Migrasi token → globals.css | Setup Next.js selesai |
| Install AI Elements | Tailwind + shadcn selesai |
| Porting HTML → React components | AI Elements terinstall |
| Setup AI SDK v7 provider adapter | Porting komponen selesai |
| /models auto-detect | Provider adapter selesai |
| Chat streaming endpoint | AI SDK v7 setup selesai |
| Postgres schema + migration | AI SDK v7 setup selesai |
| CRUD Agent/Sub Agent/Skill | Schema selesai |
| Agent Builder via Prompt | CRUD selesai |
| OpenSandbox integration | Agent Builder selesai |
| Automation/cron | OpenSandbox selesai |

---

## 7. Open Questions

> Bagian ini mencatat bagian PRD yang ambigu atau kurang jelas — jangan ditebak sendiri.

| # | Question | Context (PRD Ref) | Status |
|---|----------|-------------------|--------|
| 1 | **Session/Chat vs Task memory**: PRD menyebut "Chat session: memory percakapan berjalan bebas, context window rolling" vs "Task session: memory terikat ke satu task spesifik". Apakah Task session di-reset setelah task selesai, atau tetap persist? Bagaimana cara user "close/complete" sebuah Task? | PRD §5.4, §10.3 | ⏳ Pending |
| 2 | **Agent invocation di Chatbot mode**: PRD menyebut "Bisa memanggil Agent, Sub Agent, atau Skill spesifik untuk suatu task (mirip tool-calling / routing)". Apakah ini via /nama-agent slash command, atau otomatis (LLM decide)? Jika otomatis, bagaimana cara user override? | PRD §3.1 | ⏳ Pending |
| 3 | **Skill CLI execution approval flow**: PRD menyebut "tool approval: pakai fitur native AI SDK v7 untuk Skill CLI berisiko tinggi — minta konfirmasi user". Siapa yang menentukan skill mana "berisiko tinggi"? Apakah ada flag per skill, atau semua CLI skill butuh approval? | PRD §8 | ⏳ Pending |
| 4 | **Agent Team max 5 agent**: PRD menyebut "Maksimal 5 Agent Team per user/workspace" dan "max total 5 agent per team (termasuk lead)". Apakah maksimal 5 Agent Team (top-level teams), atau maksimal 5 agent DALAM satu team? Keduanya disebut dalam PRD §3.1 dan §5.2. | PRD §3.1, §5.2 | ⏳ Pending |
| 5 | **Domain final**: PRD menyebut "artier.yafira.web.id atau domain terpisah — TBD". Apakah sudah diputuskan? | PRD §7 | ⏳ Pending |
| 6 | **Auth**: PRD menyebut "Simple session-based auth (single user: Yafie)" sebagai opsional fase awal. Apakah M1 harus sudah ada auth, atau bisa tanpa auth di tahap awal (langsung akses)? | PRD §4.1 | ⏳ Pending |
| 7 | **Provider API key encryption**: PRD menyebut "enkripsi at-rest di kolom api_key_encrypted". Algoritma enkripsi apa yang dipakai? Apakah perlu key management terpisah (vault), atau cukup AES-GCM dengan env variable secret? | PRD §9.2 | ⏳ Pending |
| 8 | **OpenSandbox API detail**: Perlu riset lebih lanjut apakah OpenSandbox sudah punya npm package/SDK atau perlu REST client manual. Cek GitHub repository Alibaba. | PRD §4.1 | ⏳ Pending |

---

## 8. Checklist Validasi per Milestone

### M1 — Core Chat + Provider Config
- [ ] Design-System HTML selesai + visual disetujui
- [ ] Next.js + Tailwind + shadcn jalan lokal
- [ ] Chat streaming (user → assistant) berfungsi
- [ ] Provider config CRUD berfungsi
- [ ] Auto-detect /models berhasil ke minimal 2 provider real
- [ ] Deploy ke Oracle Cloud + Cloudflare Tunnel sukses

### M2 — Agent & Sub Agent Manual Builder
- [ ] CRUD Agent/Sub Agent berfungsi (Postgres)
- [ ] Agent/Sub Agent muncul di sidebar
- [ ] Agent invocation di chat berfungsi (/nama-agent)
- [ ] Model override per Agent berfungsi

### M3 — Agent Builder via Prompt
- [ ] Prompt tunggal → generate Agent lengkap (Single Agent)
- [ ] Prompt tunggal → generate Agent Team lengkap (Lead + Sub Agent)
- [ ] Preview hasil generate sebelum save
- [ ] Edit manual setelah generate

### M4 — Skill Engine + Sandbox CLI
- [ ] Skill CRUD berfungsi (prompt-only + cli-executable)
- [ ] CLI execution via OpenSandbox berfungsi
- [ ] Streaming output ke chat berfungsi
- [ ] Tool approval flow berfungsi

### M5 — Agent Team Mode (Org Chat)
- [ ] Dropdown Agent Team selection di Composer berfungsi
- [ ] Org structure visualization (React Flow) berfungsi
- [ ] Orkestrasi Agent → Sub Agent berfungsi
- [ ] Routing: hanya agent dalam team yang aktif

### M6 — Automation (Scheduled Task/Cron)
- [ ] CRUD Automation berfungsi
- [ ] Cron scheduler berfungsi
- [ ] Task terjadwal berjalan otomatis
- [ ] Status tracking (last_run, next_run)

---

## 9. Catatan Teknis Penting

1. **Design-System → React mapping**: Semua CSS variable di tokens.css HARUS dipetakan 1:1 ke globals.css saat migrasi ke Next.js. Jangan ubah nama variabel.

2. **AI Elements install pattern**: Setiap komponen diinstall satu per satu via npx ai-elements@latest add <nama>. Hanya install komponen yang benar-benar dipakai (sesuai tabel pemetaan di prompt.md §3).

3. **Comment mapping**: Di HTML statis, beri comment <!-- AI-ELEMENTS: <component-name> --> di atas setiap section yang nanti dipetakan ke komponen React — memudahkan migrasi.

4. **OpenSandbox runtime**: Di Oracle Cloud Free Tier, gunakan Docker runtime mode (bukan K8s/Firecracker). Upgrade ke Firecracker hanya jika nested virtualization tersedia.

5. **Backup**: PostgreSQL backup via pg_dump → MEGA 20GB. API Key jangan pernah masuk backup plaintext.

---

**End of PLAN.md**
