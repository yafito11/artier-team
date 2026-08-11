# Prompt Planning — Artier Team (OpenCode Desktop)

```
Kamu bertugas membuat PLANNING (bukan coding dulu) untuk proyek "Artier Team".

Baca dan pahami dua file referensi ini sebagai sumber kebenaran:
1. prd.md — spesifikasi produk lengkap (fitur, entity, arsitektur, tech stack)
2. prompt.md — riset komponen AI Elements + rencana design-system HTML

TUGAS KAMU SEKARANG:
Buat rencana kerja (planning) dalam bentuk file PLAN.md yang berisi:

1. Breakdown task per milestone (M1-M6 sesuai PRD), tiap task cukup 1 baris actionable checklist (bukan penjelasan panjang).
2. Urutan eksekusi yang benar dimulai dari: design-system HTML statis (sesuai prompt di Artier_Team_Design_System_Prompt.md) -> setup Next.js + Tailwind + shadcn -> migrasi token -> install AI Elements per komponen -> setup AI SDK v7 (provider adapter, /models auto-detect) -> Postgres schema & migration -> CRUD Agent/Sub Agent/Skill/Agent Team -> Agent Builder via prompt -> OpenSandbox integration -> Automation/cron.
3. Struktur folder project yang diusulkan (app router Next.js, lokasi schema Postgres, lokasi provider adapter, lokasi skill executor).
4. Daftar dependency/package utama yang perlu diinstall di setiap tahap (jangan install sekarang, cukup daftar).
5. Identifikasi risiko/blocker teknis yang paling mungkin muncul duluan (contoh: KVM support di Oracle Cloud untuk OpenSandbox, auth adapter beda format OpenAI vs Anthropic) dan mitigasinya.
6. Tandai dengan jelas task mana yang BISA dikerjakan sekarang tanpa dependency lain, vs task yang harus menunggu task sebelumnya selesai.

ATURAN:
- Jangan mulai menulis kode apapun di tahap ini.
- Jangan buat asumsi baru di luar PRD — kalau ada bagian PRD yang ambigu/kurang jelas, catat sebagai "Open Question" di akhir PLAN.md, jangan ditebak sendiri.
- Output akhir cukup satu file PLAN.md, ringkas dan actionable, bukan naratif panjang.

Setelah PLAN.md selesai, tunggu review saya sebelum lanjut eksekusi tahap pertama.
```