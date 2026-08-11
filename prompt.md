# Artier Team — Riset AI Elements & Prompt Design-System (HTML)

**Versi:** 1.0
**Tanggal:** 11 Agustus 2026
**Tujuan file:** (1) Memetakan komponen **AI Elements** (Vercel) yang relevan untuk tiap halaman Artier Team, dan (2) menyediakan **prompt siap-pakai** untuk coding agent agar membangun **design-system berbasis HTML statis** terlebih dahulu, sebelum masuk ke implementasi Next.js + AI SDK v7 + AI Elements yang sebenarnya.

---

## 1. Kenapa HTML Design-System Dulu?

AI Elements adalah library **copy-to-codebase** (bukan npm package biasa) berbasis React 19 + Tailwind 4 + shadcn/ui, diinstall lewat `npx ai-elements@latest add <component>`. Karena strukturnya "copy-paste ke project", styling-nya ikut CSS variables dari tema shadcn yang sudah ada di project. Artinya: **desain visual (warna, spacing, tipografi, radius, shadow) harus ditentukan dulu di level design token**, sebelum komponen React di-generate — supaya begitu AI Elements di-install, mereka otomatis mewarisi tema Artier Team, bukan tema default shadcn generik.

Maka strategi yang dipakai:
1. Bangun **HTML/CSS statis** dulu (design-system + halaman utama) — cepat divalidasi visual, tidak perlu setup Next.js/build tools.
2. Tentukan **CSS variables** (color tokens, spacing scale, radius, shadow, font) yang nantinya **persis** dipetakan ke `globals.css`/theme shadcn saat masuk fase Next.js.
3. Setelah desain HTML disetujui, baru migrasi tiap section ke komponen React + install AI Elements yang sesuai via CLI, styling tinggal "nempel" karena token sudah didefinisikan sejak awal.

---

## 2. Ringkasan Riset: AI Elements (Vercel)

- **Basis:** dibangun di atas shadcn/ui (bukan pengganti, tapi ekstensi) — pakai Radix UI + Tailwind CSS 4 + `cn()` utility dari shadcn.
- **Distribusi:** registry custom (`elements.ai-sdk.dev`), diinstall satu-per-satu via `npx ai-elements add <nama-komponen>` — jadi kita **hanya install komponen yang benar-benar dipakai**, tidak perlu seluruh library.
- **Kompatibilitas AI SDK v7:** AI Elements dirancang bekerja langsung dengan `useChat`/`useCompletion` hook dari AI SDK, dan `MessageResponse` dioptimalkan untuk streaming token — cocok dengan arsitektur `streamText`/`WorkflowAgent` di AI SDK v7 yang sudah ditetapkan di PRD Artier Team.
- **Rendering:** Markdown streaming pakai **Streamdown**, syntax highlighting pakai **Shiki**, diagram/canvas pakai **React Flow** (`@xyflow/react`) — relevan untuk fitur org structure Agent Team.
- **Kategori komponen tersedia** (per riset terbaru, termasuk rilis AI Code Elements & AI Voice Elements):
  - **Prompt & Input:** PromptInput (dengan attachment, validation), Suggestion
  - **Percakapan:** Conversation, Message (+branching), MessageResponse
  - **Interaksi AI:** Reasoning, Tool, Confirmation (approval flow — cocok untuk "Ask Before Changes"/tool approval Skill CLI), Sources, InlineCitation
  - **Kode & Konten:** CodeBlock (header, filename, multi-bahasa), JSXPreview, Commit, EnvironmentVariables (value masking)
  - **Workflow & Agent:** Agent (menampilkan konfigurasi ToolLoopAgent: model, instructions, tools, output schema), Canvas (workflow visual berbasis React Flow)
  - **Utility:** ModelSelector, OpenInChat, Context, Checkpoint, WebPreview, Sandbox
  - **Voice (opsional, fase 2):** Persona, SpeechInput, VoiceSelector, MicSelector, AudioPlayer, Transcription

---

## 3. Pemetaan Komponen AI Elements per Halaman Artier Team

| Halaman/Section Artier Team | Komponen AI Elements yang Dipakai | Catatan |
|---|---|---|
| **Chat/Task Composer** (panel utama) | `PromptInput`, `Suggestion` | PromptInput menangani attachment (tombol +), validasi input, dan integrasi langsung ke `useChat`. Dropdown Agent Team & Manage Model dibuat custom (bukan bawaan AI Elements) menempel di slot PromptInput toolbar. |
| **Chat Message Stream** | `Conversation`, `Message` (+branching), `MessageResponse` | `Conversation` sebagai container scroll; `Message` untuk bubble user/assistant; `MessageResponse` untuk streaming markdown jawaban Agent. |
| **Reasoning Agent (opsional, jika model expose reasoning)** | `Reasoning` | Collapsible panel menampilkan chain-of-thought/reasoning token dari model reasoning-capable. |
| **Tool Call / Skill Execution Display** | `Tool`, `Confirmation` | `Tool` menampilkan pemanggilan Skill (nama, parameter, status, output). `Confirmation` dipakai untuk approval flow saat Skill CLI berisiko (selaras "tool approval" di PRD section 8). |
| **CLI Output / Terminal Skill** | `CodeBlock`, AI SDK v7 **Terminal UI primitive** (bukan bagian AI Elements, tapi kompatibel dipakai bersamaan) | `CodeBlock` untuk menampilkan command + output statis; Terminal UI primitive AI SDK v7 untuk streaming real-time command yang sedang berjalan di OpenSandbox. |
| **Citation/Sumber (jika Agent browsing/riset)** | `Sources`, `InlineCitation` | Untuk Agent yang melakukan web research dan mengutip sumber. |
| **Agent List Page (Sidebar → Agent)** | `Agent` (component konfigurasi) dipakai versi **read-only card** untuk listing, versi **editable** untuk form create/edit | Menampilkan nama, deskripsi, model, instruksi, daftar tools/skill per Agent. |
| **Agent Team — Org Structure View** | `Canvas` (React Flow based) | Visualisasi Lead Agent → Sub Agent sebagai node diagram, cocok untuk representasi org-chart Agent Team (mirip Paperclip). |
| **Agent Builder via Prompt (modal/page)** | `PromptInput` + `Agent` component (preview hasil generate) + `Confirmation` (konfirmasi sebelum save) | Alur: user isi prompt → preview hasil generate pakai `Agent` component → `Confirmation` untuk approve/save. |
| **Manage Model / Provider Config** | `ModelSelector`, `EnvironmentVariables` (untuk masking API Key) | `ModelSelector` untuk pilih model dari hasil auto-detect `/models`; `EnvironmentVariables` component cocok dipakai ulang untuk menampilkan API Key dengan masking + toggle visibility + copy. |
| **Skill List & Skill Detail (CLI type)** | `Commit`-style card (dimodifikasi) untuk histori eksekusi, `CodeBlock` untuk command template | `Commit` component aslinya untuk git commit, tapi struktur (hash/message/author/timestamp/changed files) bisa diadaptasi jadi "execution history" Skill (execution id/command/user/timestamp/output). |
| **Automation List (Cron/Scheduled Task)** | Custom table/list (tidak ada komponen AI Elements khusus cron) + `Checkpoint` untuk menandai run terakhir | `Checkpoint` dipakai representasikan checkpoint run automation (last run, next run, status). |
| **Web Preview (jika Skill hasilkan output web/artifact)** | `WebPreview` | Preview hasil kerja Agent berupa halaman web/artifact di iframe sandbox. |
| **Sandbox Session Indicator** | `Sandbox` component | Menampilkan status sandbox aktif (OpenSandbox session) — running/idle/stopped. |
| **Voice Input (fase 2, opsional)** | `SpeechInput`, `MicSelector`, `Persona` | Tidak masuk MVP (M1–M6), disiapkan sebagai referensi jika Artier Team nanti dapat fitur voice command. |

---

## 4. Prompt untuk Coding Agent — Bangun Design-System HTML Terlebih Dahulu

> **Instruksi:** Copy seluruh isi di dalam blok berikut ini dan berikan langsung ke coding agent (Claude Code / OpenCode CLI) sebagai prompt awal proyek Artier Team.

```
Kamu adalah coding agent yang bertugas membangun DESIGN SYSTEM berbasis HTML statis (belum React/Next.js) untuk aplikasi bernama "Artier Team" — sebuah platform multi-agent AI system (chatbot + agent team orchestrator) mirip Paperclip.

TUJUAN TAHAP INI:
Bangun HANYA design-system dan halaman UI statis dalam HTML + CSS murni (boleh pakai Tailwind CSS via CDN untuk mempercepat, tapi TANPA framework JS seperti React/Vue/Next.js). Tidak perlu logika backend, tidak perlu state management, tidak perlu koneksi API sungguhan — cukup markup dan styling yang solid, rapi, dan konsisten, karena hasil ini akan jadi acuan visual saat nanti komponen di-porting ke React + AI Elements (Vercel) + AI SDK v7.

KENAPA HARUS HTML DULU:
AI Elements dari Vercel adalah library "copy-to-codebase" berbasis shadcn/ui yang mewarisi tema dari CSS variables project. Supaya nanti saat AI Elements di-install, semua komponen otomatis konsisten dengan desain Artier Team (bukan tema default shadcn generik), kita perlu mendefinisikan design token (warna, spacing, radius, shadow, tipografi) DULU lewat HTML/CSS statis, baru nanti dipetakan 1:1 ke CSS variables shadcn saat migrasi ke Next.js.

REFERENSI VISUAL:
Aplikasi mirip Paperclip / Zed-style AI IDE dashboard — dark theme sebagai default, sidebar kiri ramping untuk navigasi, panel utama untuk composer chat. Style harus terasa profesional, modern, developer-tool aesthetic (bukan playful/childish), inspirasi: Linear, Zed, Cursor, Raycast.

STRUKTUR OUTPUT YANG DIMINTA:

1. FOLDER STRUCTURE:
   /design-system
     /tokens.css          -> semua CSS variables (color, spacing, radius, shadow, font, z-index)
     /base.css            -> reset, typography base, utility classes umum
     /components/         -> tiap komponen UI jadi file CSS terpisah (button.css, sidebar.css, composer.css, dst)
     /pages/
       index.html          -> Halaman utama Chatbot Mode (referensi wireframe: sidebar + composer kosong)
       chat-session.html    -> Halaman chat dengan riwayat pesan aktif (Conversation + Message stream)
       agent-team-org.html   -> Halaman Agent Team dengan visualisasi Org Structure (Lead -> Sub Agent)
       agent-list.html       -> Halaman list semua Agent (card grid/list)
       agent-form.html        -> Form create/edit Agent (manual) + toggle ke mode "Agent Builder via Prompt"
       skill-list.html        -> Halaman list Skill + tombol Create Skill
       skill-form.html         -> Form create Skill (tipe: prompt-only vs cli-executable)
       automation-list.html     -> Halaman list Automation/scheduled task
       provider-settings.html    -> Halaman Manage Provider (base_url, api_key, auto-detect model checklist)
       tool-execution-demo.html   -> Contoh visual bubble chat saat Agent memanggil Skill/Tool (dengan status running/success/error dan confirmation approval)
     style-guide.html        -> Satu halaman showcase SEMUA komponen sekaligus (button variants, badge, card, modal, dropdown, dll) sebagai referensi visual cepat

2. DESIGN TOKENS (tokens.css) — wajib definisikan sebagai CSS variables:
   - Color palette: background (base/elevated/overlay), foreground (primary/secondary/muted), border, accent/brand color, success, warning, danger, info
   - Dark mode sebagai default (siapkan juga variabel untuk light mode toggle walau tidak wajib diimplementasi penuh di tahap ini)
   - Spacing scale (4px base grid: 4/8/12/16/24/32/48/64)
   - Border radius scale (sm/md/lg/full)
   - Shadow scale (sm/md/lg untuk elevation card, dropdown, modal)
   - Typography: font family (gunakan font sans yang readable untuk UI, contoh: Inter atau system-ui), font size scale (xs-3xl), font weight scale, line-height
   - Z-index scale (dropdown, modal, toast, tooltip)

3. KOMPONEN UI YANG WAJIB DIBUAT (karena akan dipetakan ke AI Elements nanti):
   
   a. Sidebar Panel (kiri, ramping, collapsible):
      - Tombol "New Chat or Task" (satu tombol gabungan)
      - Search bar
      - Section "Agent" (flat list semua agent, avatar/icon + nama)
      - Section "Agent Team" (dropdown/accordion, expand menampilkan org structure ringkas: Lead + jumlah sub agent)
      - Section "Skill" (list + tombol "Create Skill")
      - Section "Automation" (list scheduled task dengan status badge: active/paused)
      - Toggle switch "Group Chat / Group Task" di posisi bawah sidebar
      - Footer: avatar user + settings icon

   b. Composer (panel utama bawah, sticky):
      - PromptInput: textarea auto-grow, placeholder "Ask Artier Team anything, @ to add context, / for commands"
      - Tombol (+) attachment di kiri dalam composer
      - Dropdown "Agent Team" (posisi menggantikan referensi "Ask before changes") — saat diklik expand pilihan: [Tanpa Agent Team / Team A / Team B / dst]
      - Dropdown "Manage Model" di kanan
      - Tombol Send (ikon panah, disabled state saat input kosong)

   c. Conversation/Message Stream:
      - Container scroll dengan padding nyaman
      - Message bubble user (rata kanan, background accent subtle) vs Message bubble assistant (rata kiri, background elevated)
      - Avatar kecil di tiap bubble (icon agent atau user)
      - Timestamp kecil, muted color
      - Markdown rendering style (heading, list, code inline, blockquote) di dalam bubble assistant
      - Actions row di bawah tiap bubble assistant: copy, regenerate, thumbs up/down (icon button kecil, muncul on-hover)

   d. Tool/Skill Execution Card (dalam chat bubble):
      - Header: nama skill/tool + status badge (running/success/error) dengan warna sesuai token
      - Body collapsible: parameter input (key-value list) + output (bisa berupa CodeBlock style monospace)
      - Jika butuh approval: tampilkan Confirmation card terpisah dengan tombol "Approve" / "Deny"

   e. CodeBlock:
      - Header dengan filename/bahasa + tombol copy
      - Body monospace dengan syntax highlight styling dasar (boleh pakai warna token, tidak perlu real syntax highlighter di tahap HTML ini)
      - Line numbers opsional

   f. Agent Card (untuk agent-list.html):
      - Avatar/icon, nama, deskripsi singkat (truncate 2 baris)
      - Badge model yang dipakai (contoh: "GPT-5-mini" atau "Claude Sonnet 5")
      - Badge jenis: Standalone / Team Lead / Sub Agent
      - Tombol edit & delete (icon button)

   g. Agent Team Org Structure (agent-team-org.html):
      - Layout hierarki visual: 1 node Lead Agent di atas, garis connector turun ke beberapa node Sub Agent di bawah
      - Tiap node = card kecil (avatar, nama, role singkat)
      - Style seperti org chart perusahaan tapi minimalis, warna node Lead beda (accent) dari Sub Agent (neutral)

   h. Form Components (agent-form.html, skill-form.html, provider-settings.html):
      - Text input, textarea (untuk instruksi markdown — beri styling seperti code editor ringan: monospace font, background sedikit beda)
      - Select/dropdown custom styled
      - Toggle switch (untuk provider tipe: OpenAI-compatible vs Anthropic-compatible)
      - Radio card group (untuk pilihan "Manual Form" vs "Agent Builder via Prompt")
      - Checklist item (untuk provider-settings.html: list model hasil auto-detect dengan checkbox select)
      - Tombol Save (primary) & Cancel (secondary)

   i. Modal/Dialog:
      - Overlay dark semi-transparent
      - Panel modal center, style konsisten dengan card
      - Dipakai untuk konfirmasi delete, preview hasil Agent Builder sebelum save

   j. Badge/Status Indicator:
      - Varian warna: success (hijau), warning (kuning), danger (merah), info (biru), neutral (abu)
      - Dipakai di: status automation, status tool execution, status sandbox (running/idle/stopped)

   k. Toast/Notification (opsional tapi buatkan style-nya di style-guide.html):
      - Posisi bottom-right atau top-right, auto-dismiss style

ATURAN TEKNIS:
- Semua warna, spacing, radius, shadow, font HARUS merujuk ke CSS variables dari tokens.css — JANGAN hardcode hex value di file component manapun.
- Beri nama CSS variable yang jelas dan predictable, contoh: --color-bg-base, --color-bg-elevated, --color-fg-primary, --color-fg-muted, --color-border, --color-accent, --color-accent-foreground, --color-success, --color-warning, --color-danger, --radius-sm, --radius-md, --radius-lg, --shadow-sm, --shadow-md, --space-1 s/d --space-16, --font-size-xs s/d --font-size-3xl.
- Gunakan semantic HTML (nav, aside, main, section, header) — bukan div bertumpuk tanpa makna.
- Pastikan struktur HTML/class-naming rapi (boleh pakai BEM atau utility-first Tailwind, pilih salah satu secara konsisten di seluruh file, jangan campur).
- Responsive tidak wajib sempurna di tahap ini (fokus desktop-first, karena Artier Team adalah developer tool), tapi sidebar harus punya collapsed state yang terlihat masuk akal.
- Beri comment di HTML menandai bagian mana yang nanti akan dipetakan ke komponen AI Elements tertentu, contoh: <!-- AI-ELEMENTS: Conversation + Message --> di atas section chat stream, <!-- AI-ELEMENTS: PromptInput --> di atas composer, <!-- AI-ELEMENTS: Tool + Confirmation --> di atas tool execution card, dst — supaya saat migrasi ke React nanti jelas mapping-nya.
- Buat file style-guide.html berisi SEMUA variant komponen di atas dalam satu halaman scrollable, dikelompokkan per section dengan heading jelas — ini jadi "katalog visual" utama.

DELIVERABLE AKHIR:
Sebuah folder /design-system yang bisa dibuka langsung di browser (buka index.html atau style-guide.html), tanpa build step, tanpa npm install (kecuali Tailwind via CDN script tag jika dipilih), yang menunjukkan seluruh tampilan visual Artier Team secara lengkap dan konsisten, siap dijadikan acuan saat porting ke Next.js + AI SDK v7 + AI Elements pada tahap berikutnya.

Setelah selesai, jangan lanjut ke implementasi React/Next.js — cukup sampai design-system HTML ini saja dan tunggu review/approval visual terlebih dahulu.
```

---

## 5. Langkah Setelah Design-System HTML Disetujui

1. Setup project Next.js (App Router) baru, install Tailwind CSS 4 + shadcn/ui init.
2. Pindahkan seluruh isi `tokens.css` ke `globals.css` sebagai CSS variables tema shadcn (mapping 1:1, jangan ubah nama variabel supaya tidak perlu re-mapping komponen).
3. Install AI Elements satu per satu sesuai tabel pemetaan di Section 3 (`npx ai-elements@latest add conversation`, `add message`, `add prompt-input`, dst) — komponen otomatis akan mewarisi tema karena token sudah didefinisikan di langkah 2.
4. Porting tiap halaman HTML statis ke page/component React, ganti markup statis dengan komponen AI Elements yang sesuai comment `<!-- AI-ELEMENTS: ... -->` yang sudah ditandai.
5. Sambungkan ke AI SDK v7 (`useChat`, `WorkflowAgent`, subagents) sesuai arsitektur di PRD Artier Team section 4–5.

---

## Catatan

- Beberapa komponen (dropdown Agent Team, toggle Group Chat/Task, Org Structure Agent Team) **tidak punya padanan langsung** di AI Elements — ini wajar karena AI Elements fokus ke pola chat/agent umum, bukan fitur spesifik Artier Team. Komponen-komponen ini tetap dibangun custom di atas primitif shadcn/ui (Dropdown Menu, Switch, dan React Flow untuk Canvas/org chart), mengikuti styling token yang sama.
- `Canvas` (React Flow based) adalah pilihan paling masuk akal untuk visualisasi Org Structure Agent Team dibanding bikin dari nol, karena sudah terintegrasi ke ekosistem AI Elements dan mendukung custom node styling.