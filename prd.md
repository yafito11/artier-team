# PRD: Artier Team

**Versi:** 1.0
**Tanggal:** 11 Agustus 2026
**Author:** Yafie Yulianto — Yafira Digital Studio
**Status:** Draft untuk pengembangan

---

## 1. Identitas & Misi

**Nama Produk:** Artier Team

**Tagline:** Multi-Agent System Platform — Bangun Tim AI Anda Sendiri

**Deskripsi Singkat:**
Artier Team adalah aplikasi web berbasis multi-agent system yang memungkinkan user membuat, mengorkestrasi, dan menjalankan Agent, Sub Agent, dan Skill secara mandiri — baik dalam mode chatbot bebas (general orchestrator) maupun dalam mode Agent Team terstruktur (org-chart style, mirip Paperclip). Mendukung multi-provider LLM (OpenAI-compatible & Anthropic-compatible) dengan auto-detect model, serta eksekusi command CLI/terminal secara aman lewat sandbox terisolasi (OpenSandbox, Firecracker-based).

**Misi:**
Memberikan Yafie (dan calon user Artier ecosystem lainnya) sebuah platform self-hosted, provider-agnostic, untuk membangun tim AI agent yang bisa bekerja otonom menjalankan task nyata (coding, riset, automasi CLI) tanpa vendor lock-in ke satu provider LLM tertentu, dan tanpa bergantung pada infrastruktur cloud tertutup seperti Vercel Sandbox.

**Rujukan Utama:** Paperclip (konsep Agent/Sub Agent, org structure, agent builder via prompt).

**Target User:** Yafie sendiri (dogfooding internal untuk Yafira Digital Studio & Artier ecosystem), berpotensi dirilis sebagai produk terpisah di masa depan (SaaS/self-hosted license) di bawah lini Artier.

---

## 2. Reward & Punishment (Milestone & Kriteria Sukses)

Karena Artier Team adalah produk internal tools (bukan agent otonom finansial seperti Yafira AI), skema reward/punishment di sini berbentuk **milestone gating** untuk pengembangan bertahap:

| Milestone | Kriteria Sukses | Jika Gagal |
|---|---|---|
| **M1 — Core Chat + Provider Config** | Chatbot jalan, bisa connect ke minimal 2 provider (OpenAI-compat & Anthropic-compat), auto-detect model via `/models` endpoint sukses | Stop, debug koneksi provider sebelum lanjut ke M2 |
| **M2 — Agent & Sub Agent Manual Builder** | Bisa create Agent/Sub Agent lewat form (nama, deskripsi, model, instruksi markdown), tersimpan di Postgres, bisa dipanggil dari chat via `/nama-agent` | Rollback ke M1, evaluasi skema data model Agent |
| **M3 — Agent Builder via Prompt** | Prompt tunggal berhasil generate Agent lengkap (nama+deskripsi+instruksi+model suggestion) atau Agent Team lengkap (max 5 agent + org structure) | Fallback ke manual form only, agent builder jadi fase 2 |
| **M4 — Skill Engine + Sandbox CLI** | Skill bisa dibuat, dan Agent bisa menjalankan command CLI di dalam OpenSandbox dengan output streaming ke chat | Isolasi sandbox tidak sempurna → tunda fitur CLI, jalankan skill non-CLI dulu |
| **M5 — Agent Team Mode (Org Chat)** | Dropdown/slash command pilih Agent Team, orkestrasi Agent→Sub Agent jalan sesuai instruksi masing-masing, hasil kembali ke chat | Turunkan kompleksitas: sementara jalankan 1 level (Agent saja tanpa Sub Agent) |
| **M6 — Automation (Scheduled Task/Cron)** | Task terjadwal bisa dibuat dan berjalan otomatis memanggil Agent/Agent Team | Automation jadi fase 2, fokus real-time chat dulu |

**Deadline internal:** M1–M4 ditarget selesai dalam 6–8 minggu (dikerjakan sela-sela mengajar & kerja Yafira Studio lainnya). Tidak ada punishment finansial — ini adalah tooling internal, bukan agent yang harus profit.

---

## 3. Produk & Platform

### 3.1 Dua Mode Interaksi Utama

**A. Chatbot Mode (General Orchestrator)**
- Chat biasa seperti chatbot pada umumnya.
- Bisa memanggil Agent, Sub Agent, atau Skill spesifik untuk suatu task (mirip tool-calling / routing).
- Model yang dipakai = model dari **Manage Model** (global default), kecuali user secara eksplisit memanggil Agent tertentu yang punya model sendiri.

**B. Agent Team Mode**
- Diaktifkan lewat dropdown di Composer Chat (menggantikan posisi "Ask before changes") atau via slash command (`/nama-team`).
- Saat aktif, **hanya** Agent/Sub Agent yang terdaftar dalam Agent Team tersebut yang bekerja — orchestrator umum non-aktif.
- Setiap Agent/Sub Agent dalam Team menjalankan model miliknya sendiri (bukan Manage Model global).
- Maksimal **5 Agent Team** per user/workspace.
- Struktur mirip org chart: 1 Lead Agent + beberapa Sub Agent per Team.

### 3.2 Building Block

| Entity | Deskripsi |
|---|---|
| **Agent** | Unit kerja utama. Punya: Nama, Deskripsi, Model (provider+model spesifik), Instruksi (Markdown/system prompt), daftar Skill yang boleh dipakai. |
| **Sub Agent** | Sama seperti Agent, tapi terikat di bawah Agent tertentu dalam sebuah Agent Team, dipanggil oleh Lead Agent. |
| **Skill** | Kapabilitas reusable — bisa berupa instruksi/prompt template, atau **CLI executor** yang menjalankan command di terminal sandbox. Skill bisa dipakai lintas Agent. |
| **Agent Team** | Kumpulan 1 Lead Agent + N Sub Agent (max total 5 agent per team) yang bekerja sebagai satu kesatuan untuk domain task tertentu. |
| **Automation** | Scheduled task / cron job yang memanggil Agent, Sub Agent, atau Agent Team pada waktu tertentu tanpa trigger manual. |

### 3.3 Dua Cara Membuat Agent/Sub Agent/Skill

1. **Manual Form** — isi field: Nama, Deskripsi, Model (pilih provider+model), Instruksi Markdown, (untuk Skill: tipe — prompt-only atau CLI-executable + command template).
2. **Agent Builder via Prompt** — user pilih "Single Agent" atau "Agent Team", masukkan satu prompt deskripsi kebutuhan, sistem otomatis men-generate:
   - Untuk Single Agent: nama, deskripsi, instruksi markdown lengkap, rekomendasi model.
   - Untuk Agent Team: struktur org (Lead + Sub Agent), masing-masing dengan nama/deskripsi/instruksi/model, lengkap dan siap pakai (bisa diedit manual setelahnya).

### 3.4 Provider & Model Configuration

- User input: **Base URL**, **API Key**, lalu sistem **auto-detect model** dengan hit endpoint `{base_url}/models` (standar OpenAI-compatible `/v1/models`; untuk Anthropic-compatible pakai endpoint setara/model list yang tersedia).
- Hasil auto-detect ditampilkan sebagai checklist — user **select** model mana saja yang mau ditampilkan/dipakai di aplikasi (tidak semua model hasil fetch otomatis aktif).
- Mendukung multi-provider bersamaan (bisa tambah banyak koneksi provider, masing-masing dengan model list sendiri).
- Provider type: `openai-compatible` dan `anthropic-compatible` (dua adapter berbeda karena format request/response beda).

### 3.5 Platform & Deployment

- Self-hosted, deploy di **Oracle Cloud Free Tier (Always Free)**.
- **Cloudflare** sebagai reverse proxy + DNS untuk akses via domain sendiri (`artier.yafira.web.id` atau domain terpisah — TBD).
- Database: **PostgreSQL 16**, dijalankan via **Docker**.

---

## 4. Tech Stack & Arsitektur

### 4.1 Ringkasan Riset Teknologi

| Komponen | Pilihan | Catatan Riset |
|---|---|---|
| **Agent Runtime / Orchestration** | **AI SDK v7** (Vercel) | Rilis 25 Juni 2026. Fokus produksi: typed tool context, agent-level tool approvals, `WorkflowAgent` untuk durable/resumable agent execution, subagents primitive native, terminal UI support, sandbox integration built-in, telemetry, MCP support. Ini pas banget untuk kebutuhan Agent+Sub Agent+Skill karena `WorkflowAgent` dan subagents sudah jadi primitif resmi, bukan hasil workaround. |
| **Framework perbandingan (bukan dipakai)** | eve, LangGraph, Mastra, OpenAI Agents SDK | Disebut sebagai kompetitor AI SDK di ekosistem TypeScript agent — AI SDK v7 dipilih karena native TypeScript, tidak terikat framework besar, dan portable ke Next.js atau non-Next.js. |
| **Sandbox CLI Execution** | **OpenSandbox** (Alibaba, Apache 2.0, open-source) | Dipilih sebagai pengganti Vercel Sandbox karena Vercel Sandbox terbatas ke infrastruktur Vercel sendiri (tidak bisa dipasang di VPS/Oracle Cloud milik sendiri, dan paket Hobby punya limit ketat). OpenSandbox: unified API untuk jalankan untrusted code, runtime Docker (dev) atau Kubernetes (production), mendukung gVisor, Kata Containers, dan Firecracker microVM sebagai secure runtime pilihan. Self-hostable penuh di Oracle Cloud VPS milik sendiri. |
| **Database** | PostgreSQL 16 (Docker) | Standar Yafira Studio. Simpan: Agent, Sub Agent, Skill, Agent Team, Session (Chat/Task), Message history, Provider config, Automation schedule. |
| **Frontend** | Next.js (App Router) + AI SDK UI hooks + AI Elements | Selaras dengan arsitektur Next.js standar Vercel AI SDK; AI Elements dipakai untuk komponen chat siap pakai (prompt input, message list, dsb) supaya development cepat, lalu dikustom ulang sesuai desain Paperclip-like sidebar. |
| **Terminal UI (untuk output CLI Skill)** | AI SDK v7 Terminal UI primitive | Streaming output command CLI langsung ke dalam chat bubble, real-time. |
| **Auth (opsional fase awal)** | Simple session-based auth (single user: Yafie) | Karena awal self-hosted personal use, multi-user/role bisa ditunda ke fase 2. |
| **Deployment** | Docker Compose (app + Postgres + OpenSandbox runtime) di Oracle Cloud Free Tier | Cloudflare Tunnel atau Cloudflare Proxy DNS untuk expose domain tanpa buka port publik langsung (lebih aman untuk VPS Always Free). |

### 4.2 Arsitektur Tingkat Tinggi

```
┌─────────────────────────────────────────────────────────┐
│                     Cloudflare (DNS/Proxy)                │
└───────────────────────────┬─────────────────────────────┘
                             │
┌───────────────────────────▼─────────────────────────────┐
│           Next.js App (Artier Team) — Oracle Cloud VPS     │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  Frontend    │  │  API Routes   │  │  AI SDK v7 Core   │ │
│  │  (AI Elements│  │  (Agent CRUD, │  │  - generateText/  │ │
│  │  + custom    │  │  Provider     │  │    streamText      │ │
│  │  sidebar)    │  │  Config,      │  │  - WorkflowAgent   │ │
│  │              │  │  Automation)  │  │  - Subagents        │ │
│  └─────────────┘  └──────┬───────┘  │  - Tool Approval    │ │
│                           │           └────────┬──────────┘ │
└───────────────────────────┼────────────────────┼────────────┘
                             │                    │
                 ┌───────────▼──────────┐   ┌─────▼──────────────┐
                 │  PostgreSQL 16       │   │  OpenSandbox         │
                 │  (Docker)             │   │  (Docker/K8s,        │
                 │  Agent/SubAgent/Skill │   │  Firecracker runtime) │
                 │  /Team/Session/Msg    │   │  CLI execution        │
                 └───────────────────────┘   └───────────────────────┘
                             │
                 ┌───────────▼──────────────────────┐
                 │  Provider Adapters                 │
                 │  - OpenAI-compatible (base_url+key) │
                 │  - Anthropic-compatible (base_url+key)│
                 │  Auto-detect via /models endpoint   │
                 └─────────────────────────────────────┘
```

---

## 5. Agent & Mode Operasi

### 5.1 Skema Data Agent

```
Agent {
  id, nama, deskripsi,
  provider_id (FK ke Provider Config),
  model_name,
  instruksi_markdown,
  skills: [Skill.id],
  jenis: "standalone" | "team_lead" | "sub_agent",
  parent_team_id (nullable, jika sub_agent),
  created_via: "manual" | "prompt_builder"
}
```

### 5.2 Skema Data Agent Team

```
AgentTeam {
  id, nama, deskripsi,
  lead_agent_id,
  sub_agents: [Agent.id],  // max total 5 agent termasuk lead
  slash_command,            // contoh: /dev-team
}
```

### 5.3 Skema Data Skill

```
Skill {
  id, nama, deskripsi,
  tipe: "prompt" | "cli_executable",
  instruksi_markdown,        // jika tipe prompt
  command_template,          // jika tipe cli_executable, dieksekusi lewat OpenSandbox
  created_via: "manual" | "prompt_builder"
}
```

### 5.4 Mode Operasi Model

| Kondisi | Model yang Dipakai |
|---|---|
| Chatbot mode, tanpa Agent Team dipilih | Model dari **Manage Model** (global default), meskipun Agent lain punya model sendiri |
| Chatbot mode, memanggil Agent spesifik (`@agent` atau tool-call) | Model milik Agent tersebut |
| Agent Team mode aktif | Setiap Agent/Sub Agent dalam Team pakai model masing-masing sesuai konfigurasi |

### 5.5 Agent Builder via Prompt — Alur

1. User klik "Create Agent" → pilih "Buat dengan Prompt".
2. Pilih target: **Single Agent** atau **Agent Team**.
3. Masukkan prompt kebutuhan (contoh: "Buatkan saya tim untuk automasi konten Instagram: 1 lead yang koordinasi, 1 sub agent nulis caption, 1 sub agent cari referensi trending").
4. Sistem (pakai LLM dari Manage Model / provider default) generate struktur JSON lengkap sesuai skema 5.1/5.2, lalu user preview & bisa edit sebelum save.
5. Save → langsung muncul di sidebar (Agent list / Agent Team dropdown).

---

## 6. Infrastructure & Docker

### 6.1 Docker Compose Services

```yaml
services:
  artier-app:        # Next.js app (AI SDK v7)
  postgres:           # PostgreSQL 16
  opensandbox:         # OpenSandbox runtime (Docker mode untuk awal, K8s untuk scale)
  cloudflared:          # Cloudflare Tunnel (opsional, untuk expose tanpa buka port)
```

### 6.2 Resource Constraint (Oracle Cloud Always Free)

- Oracle Cloud Free Tier: umumnya 4 OCPU (Ampere ARM) + 24GB RAM (shape VM.Standard.A1.Flex) — cukup untuk app + Postgres + OpenSandbox ringan.
- OpenSandbox jalan mode **Docker runtime** (bukan Kubernetes) di fase awal untuk hemat resource; upgrade ke K8s runtime hanya jika scale dibutuhkan (multi-user).
- Perlu monitoring resource ketat karena Firecracker microVM tetap butuh KVM support — pastikan Oracle Cloud shape yang dipakai mendukung nested virtualization/KVM.

### 6.3 Networking

- Cloudflare Tunnel direkomendasikan dibanding expose port langsung → mengurangi attack surface di VPS Always Free.
- Domain custom di-pointing ke Cloudflare, lalu tunnel ke VPS Oracle Cloud.

---

## 7. Domain, Email & API Routing

- **Domain:** subdomain di bawah `yafira.web.id` (contoh: `artier-team.yafira.web.id`) untuk fase awal, atau domain terpisah untuk lini Artier jika sudah matang jadi produk (`artier.app` — cek ketersediaan).
- **Email:** tidak dibutuhkan di fase awal (single-user internal tool). Jika nanti multi-user/SaaS, integrasikan dengan Docker Mailserver standar Yafira Studio untuk notifikasi Automation.
- **API Routing:**
  - `/api/providers` — CRUD provider config (base_url, api_key, tipe)
  - `/api/providers/:id/models` — trigger auto-detect model
  - `/api/agents` — CRUD Agent/Sub Agent
  - `/api/agent-teams` — CRUD Agent Team
  - `/api/skills` — CRUD Skill
  - `/api/skills/:id/execute` — trigger CLI execution via OpenSandbox
  - `/api/automations` — CRUD scheduled task
  - `/api/sessions` — CRUD Chat/Task session (Group vs Project)
  - `/api/builder/generate` — endpoint Agent Builder via Prompt

---

## 8. Token Governance & Provider Management

- Karena multi-provider BYOK (Bring Your Own Key), tidak ada token governance terpusat seperti Yafira AI — user (Yafie) bertanggung jawab langsung atas biaya masing-masing provider yang dikonfigurasi.
- Rekomendasi: tampilkan indikator token usage per session (jika provider mengembalikan usage di response) sebagai visibility, bukan hard limit di fase awal.
- Guardrail teknis:
  - Max iterasi loop Agent (mencegah infinite tool-calling): default 10 iterasi per task (selaras standar `agent loop max 10 iterations` dari PRD Artier IDE Lite).
  - Timeout eksekusi CLI Skill di OpenSandbox: default 120 detik (selaras standar OpenCode CLI guardrail Yafira Studio), bisa dikustom per Skill.
  - Tool approval: pakai fitur native AI SDK v7 (`agent-level tool approvals`) untuk Skill CLI berisiko tinggi — minta konfirmasi user sebelum eksekusi command tertentu (opsional per-skill, mirip "Ask before changes" tapi granular).

---

## 9. Database, Backup & Checklist

### 9.1 Skema Database Inti (PostgreSQL 16)

- `providers` (id, nama, base_url, api_key_encrypted, tipe, created_at)
- `models` (id, provider_id, model_name, is_selected)
- `agents` (id, nama, deskripsi, provider_id, model_name, instruksi_md, jenis, parent_team_id, created_via)
- `agent_teams` (id, nama, deskripsi, lead_agent_id, slash_command)
- `skills` (id, nama, deskripsi, tipe, instruksi_md, command_template, created_via)
- `sessions` (id, tipe: "chat"|"task", scope: "group"|"project", nama, agent_team_id_nullable, created_at)
- `messages` (id, session_id, role, content, tool_calls, created_at)
- `automations` (id, nama, target_type: "agent"|"agent_team", target_id, cron_expr, last_run, next_run, status)

### 9.2 Backup

- Backup PostgreSQL harian via `pg_dump` → simpan ke MEGA 20GB (standar Yafira Studio) + GitHub Private repo untuk config non-sensitif (skema, bukan data user/API key).
- API Key provider **jangan** pernah masuk ke backup plaintext — enkripsi at-rest di kolom `api_key_encrypted`.

### 9.3 Checklist Sebelum Rilis M1

- [ ] Docker Compose lengkap (app, Postgres, OpenSandbox) jalan lokal
- [ ] Provider config CRUD + auto-detect `/models` tervalidasi ke minimal 2 provider real (contoh: OpenRouter/NaraRouter untuk OpenAI-compatible, Anthropic API langsung untuk Anthropic-compatible)
- [ ] Chatbot dasar bisa kirim-terima pesan streaming
- [ ] Sidebar: Agent, Agent Team (dropdown+org structure), Skill, Automation, toggle Chat/Task, New Chat or Task, Search — semua render sesuai wireframe
- [ ] Composer: PromptInput, tombol attach (+), tombol Send, Manage Model, dropdown Agent Team
- [ ] Deploy awal ke Oracle Cloud Free Tier + Cloudflare Tunnel sukses diakses via domain

---

## 10. UI/UX — Referensi Layout (dari Wireframe & Deskripsi Yafie)

### 10.1 Sidebar Panel

1. **New Chat or Task** — satu tombol, gabungan create baru untuk Chat maupun Task.
2. **Search** — cari session lama.
3. **Agent** — daftar semua Agent (flat list, semua Agent berkumpul di sini terlepas dari Team-nya).
4. **Agent Team** — dropdown menu; saat diklik, expand menampilkan org structure (Lead → Sub Agent) untuk masing-masing Team.
5. **Skill** — daftar semua Skill yang pernah dibuat + tombol "Create Skill".
6. **Automation** — daftar scheduled task/cron job.
7. **Toggle Group Chat / Group Task** — mirip toggle "Project/Group" di wireframe; menentukan sesi disimpan sebagai Chat (memory percakapan bebas) atau Task (memory terpisah, terstruktur per pekerjaan).

### 10.2 Composer (Panel Utama)

- **PromptInput** (textarea utama)
- **Tombol (+) attachment** — kiri bawah, untuk lampirkan file/context
- **Dropdown Agent Team** — menggantikan posisi "Ask before changes" pada referensi wireframe; pilih Agent Team aktif atau kosongkan untuk mode Chatbot biasa
- **Manage Model** — kanan, untuk atur model default (dipakai saat Agent Team tidak dipilih)
- **Tombol Send**

### 10.3 Perbedaan Memory: Chat vs Task

- **Chat session**: memory percakapan berjalan bebas, context window rolling, cocok untuk tanya-jawab/orkestrasi ad-hoc.
- **Task session**: memory terikat ke satu task spesifik (biasanya dipicu Agent Team atau Automation), disimpan terpisah agar tidak campur dengan histori Chat biasa — selaras kebutuhan "Project vs Group" pada referensi wireframe.

---

## Catatan Penutup

PRD ini adalah fondasi awal untuk pengembangan Artier Team. Rekomendasi urutan eksekusi: mulai dari **M1 (Core Chat + Provider Config)** karena ini fondasi yang divalidasi semua fitur lain di atasnya, terutama karena auto-detect model via `/models` endpoint adalah differentiator utama dibanding hardcode model list seperti kebanyakan tool sejenis.

Rekomendasi riset lanjutan sebelum mulai coding: cek dokumentasi resmi OpenSandbox (GitHub Alibaba) untuk API detail eksekusi command dan opsi runtime (Docker vs K8s) yang paling cocok dengan resource Oracle Cloud Free Tier yang tersedia, serta pastikan shape VM Oracle Cloud yang dipakai mendukung KVM/nested virtualization untuk Firecracker microVM OpenSandbox bisa jalan optimal.