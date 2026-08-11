<div align="center">

<!-- Animated Header SVG -->
<svg width="600" height="160" viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#a78bfa;stop-opacity:1">
        <animate attributeName="stop-color" values="#a78bfa;#60a5fa;#a78bfa" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="50%" style="stop-color:#60a5fa;stop-opacity:1">
        <animate attributeName="stop-color" values="#60a5fa;#34d399;#60a5fa" dur="3s" repeatCount="indefinite"/>
      </stop>
      <stop offset="100%" style="stop-color:#34d399;stop-opacity:1">
        <animate attributeName="stop-color" values="#34d399;#a78bfa;#34d399" dur="3s" repeatCount="indefinite"/>
      </stop>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background particles -->
  <circle cx="50" cy="30" r="2" fill="#a78bfa" opacity="0.4">
    <animate attributeName="cy" values="30;10;30" dur="4s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="150" cy="80" r="1.5" fill="#60a5fa" opacity="0.3">
    <animate attributeName="cy" values="80;60;80" dur="3s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="450" cy="40" r="2.5" fill="#34d399" opacity="0.4">
    <animate attributeName="cy" values="40;20;40" dur="5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="530" cy="90" r="1.5" fill="#a78bfa" opacity="0.3">
    <animate attributeName="cy" values="90;70;90" dur="3.5s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="300" cy="20" r="1" fill="#f472b6" opacity="0.3">
    <animate attributeName="cy" values="20;5;20" dur="4.5s" repeatCount="indefinite"/>
  </circle>
  <circle cx="550" cy="30" r="1.5" fill="#fbbf24" opacity="0.3">
    <animate attributeName="cy" values="30;15;30" dur="3.2s" repeatCount="indefinite"/>
  </circle>

  <!-- Title text -->
  <text x="300" y="75" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="52" font-weight="800" fill="url(#grad1)" filter="url(#glow)">
    ARTIER TEAM
    <animate attributeName="opacity" values="1;0.85;1" dur="2s" repeatCount="indefinite"/>
  </text>

  <!-- Subtitle -->
  <text x="300" y="115" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="16" fill="#94a3b8" letter-spacing="4">
    MULTI-AGENT AI SYSTEM PLATFORM
  </text>

  <!-- Underline animation -->
  <line x1="150" y1="130" x2="450" y2="130" stroke="url(#grad1)" stroke-width="2" stroke-dasharray="300" stroke-dashoffset="300">
    <animate attributeName="stroke-dashoffset" from="300" to="0" dur="1.5s" fill="freeze" begin="0.5s"/>
  </line>

  <!-- Orbiting dots -->
  <circle r="4" fill="#a78bfa">
    <animateMotion dur="6s" repeatCount="indefinite" path="M300,75 m-120,0 a120,20 0 1,1 240,0 a120,20 0 1,1 -240,0"/>
  </circle>
  <circle r="3" fill="#60a5fa">
    <animateMotion dur="6s" repeatCount="indefinite" path="M300,75 m-120,0 a120,20 0 1,1 240,0 a120,20 0 1,1 -240,0" begin="2s"/>
  </circle>
  <circle r="3.5" fill="#34d399">
    <animateMotion dur="6s" repeatCount="indefinite" path="M300,75 m-120,0 a120,20 0 1,1 240,0 a120,20 0 1,1 -240,0" begin="4s"/>
  </circle>
</svg>

<!-- Badges -->
<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"/>
  &nbsp;
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  &nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  &nbsp;
  <img src="https://img.shields.io/badge/AI SDK-7.0-FF6B6B?style=for-the-badge&logo=openai&logoColor=white" alt="AI SDK"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Drizzle-ORM-1C1C1C?style=for-the-badge&logoColor=white" alt="Drizzle"/>
  &nbsp;
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"/>
</p>

<br/>

<!-- Animated Architecture SVG -->
<svg width="700" height="220" viewBox="0 0 700 220" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nodeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#334155"/>
      <stop offset="100%" style="stop-color:#1e293b"/>
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Connection lines (animated) -->
  <line x1="175" y1="110" x2="350" y2="50" stroke="#a78bfa" stroke-width="2" stroke-dasharray="5,5" opacity="0.5">
    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
  </line>
  <line x1="175" y1="110" x2="350" y2="110" stroke="#60a5fa" stroke-width="2" stroke-dasharray="5,5" opacity="0.5">
    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
  </line>
  <line x1="175" y1="110" x2="350" y2="170" stroke="#34d399" stroke-width="2" stroke-dasharray="5,5" opacity="0.5">
    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
  </line>

  <line x1="525" y1="50" x2="580" y2="110" stroke="#a78bfa" stroke-width="2" stroke-dasharray="5,5" opacity="0.5">
    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
  </line>
  <line x1="525" y1="110" x2="580" y2="110" stroke="#60a5fa" stroke-width="2" stroke-dasharray="5,5" opacity="0.5">
    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
  </line>
  <line x1="525" y1="170" x2="580" y2="110" stroke="#34d399" stroke-width="2" stroke-dasharray="5,5" opacity="0.5">
    <animate attributeName="stroke-dashoffset" from="10" to="0" dur="1s" repeatCount="indefinite"/>
  </line>

  <!-- User node -->
  <rect x="50" y="85" width="110" height="50" rx="12" fill="url(#nodeGrad)" filter="url(#shadow)" stroke="#475569" stroke-width="1"/>
  <text x="105" y="105" text-anchor="middle" font-family="system-ui" font-size="12" fill="#e2e8f0" font-weight="600">User</text>
  <text x="105" y="122" text-anchor="middle" font-family="system-ui" font-size="10" fill="#94a3b8">Browser</text>
  <circle cx="140" cy="110" r="5" fill="#34d399">
    <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
  </circle>

  <!-- Agent nodes -->
  <rect x="350" y="25" width="175" height="50" rx="12" fill="url(#nodeGrad)" filter="url(#shadow)" stroke="#a78bfa" stroke-width="1"/>
  <text x="437" y="45" text-anchor="middle" font-family="system-ui" font-size="12" fill="#e2e8f0" font-weight="600">Agent Builder</text>
  <text x="437" y="62" text-anchor="middle" font-family="system-ui" font-size="10" fill="#a78bfa">AI-Powered</text>

  <rect x="350" y="85" width="175" height="50" rx="12" fill="url(#nodeGrad)" filter="url(#shadow)" stroke="#60a5fa" stroke-width="1"/>
  <text x="437" y="105" text-anchor="middle" font-family="system-ui" font-size="12" fill="#e2e8f0" font-weight="600">Chat Engine</text>
  <text x="437" y="122" text-anchor="middle" font-family="system-ui" font-size="10" fill="#60a5fa">Streaming AI</text>

  <rect x="350" y="145" width="175" height="50" rx="12" fill="url(#nodeGrad)" filter="url(#shadow)" stroke="#34d399" stroke-width="1"/>
  <text x="437" y="165" text-anchor="middle" font-family="system-ui" font-size="12" fill="#e2e8f0" font-weight="600">Skills & Teams</text>
  <text x="437" y="182" text-anchor="middle" font-family="system-ui" font-size="10" fill="#34d399">Orchestration</text>

  <!-- Database node -->
  <rect x="580" y="85" width="110" height="50" rx="12" fill="url(#nodeGrad)" filter="url(#shadow)" stroke="#f472b6" stroke-width="1"/>
  <text x="635" y="105" text-anchor="middle" font-family="system-ui" font-size="12" fill="#e2e8f0" font-weight="600">PostgreSQL</text>
  <text x="635" y="122" text-anchor="middle" font-family="system-ui" font-size="10" fill="#f472b6">Drizzle ORM</text>
  <circle cx="585" cy="110" r="5" fill="#f472b6">
    <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" begin="0.5s"/>
    <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" begin="0.5s"/>
  </circle>

  <!-- Labels -->
  <text x="262" y="50" text-anchor="middle" font-family="system-ui" font-size="9" fill="#64748b" transform="rotate(-12 262 50)">generate</text>
  <text x="262" y="110" text-anchor="middle" font-family="system-ui" font-size="9" fill="#64748b">stream</text>
  <text x="262" y="170" text-anchor="middle" font-family="system-ui" font-size="9" fill="#64748b" transform="rotate(12 262 170)">manage</text>
</svg>

<br/>

### **Open-source multi-agent AI platform** where you build, orchestrate, and deploy AI agents with a visual builder, real-time chat, and multi-provider support.

<br/>
</div>

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### Core

- **Agent Builder** — Describe your agent in plain language, AI generates config + tools + system prompt
- **Real-Time Chat** — Streaming responses with reasoning, tool calls, and Markdown rendering
- **Skills System** — Create reusable skill templates, execute independently or compose into agents
- **Team Orchestration** — Group agents into teams with routing strategies (round-robin, least-loaded, etc.)
- **Chat Persistence** — Sessions saved to PostgreSQL, full history with session management

</td>
<td width="50%" valign="top">

### Platform

- **Multi-Provider** — OpenAI, Anthropic, Google, Mistral, OpenRouter, custom endpoints
- **OpenSandbox** — Secure code execution environment for agents
- **Automations** — Schedule recurring tasks with cron-based scheduler
- **Dark Mode** — Full dark theme with violet/blue/green accent palette
- **Type-Safe** — End-to-end TypeScript with Drizzle ORM

</td>
</tr>
</table>

---

## Tech Stack

<table>
<tr>
<td align="center" width="14%">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" width="40" alt="Next.js"/>
  <br/><b>Next.js 16</b>
  <br/><small>App Router</small>
</td>
<td align="center" width="14%">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="40" alt="React"/>
  <br/><b>React 19</b>
  <br/><small>Server Components</small>
</td>
<td align="center" width="14%">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40" alt="TypeScript"/>
  <br/><b>TypeScript</b>
  <br/><small>5.8</small>
</td>
<td align="center" width="14%">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" width="40" alt="Tailwind"/>
  <br/><b>Tailwind</b>
  <br/><small>v4</small>
</td>
<td align="center" width="14%">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" width="40" alt="PostgreSQL"/>
  <br/><b>PostgreSQL</b>
  <br/><small>16</small>
</td>
<td align="center" width="14%">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg" width="40" alt="OpenAI"/>
  <br/><b>AI SDK 7</b>
  <br/><small>Streaming</small>
</td>
<td align="center" width="14%">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/drizzle/drizzle-original.svg" width="40" alt="Drizzle"/>
  <br/><b>Drizzle</b>
  <br/><small>ORM</small>
</td>
</tr>
</table>

---

## Project Structure

```
artier-team/
├── design-system/              # HTML/CSS prototypes
│   ├── base.css
│   ├── tokens.css
│   ├── components/             # Component styles
│   └── pages/                  # Static page prototypes
│
└── artier-team-app/            # Next.js application
    ├── src/
    │   ├── app/                # Route pages (App Router)
    │   │   ├── chat/           # Chat interface
    │   │   ├── agents/         # Agent list + builder + form
    │   │   ├── skills/         # Skills management
    │   │   ├── teams/          # Team orchestration
    │   │   ├── automations/    # Automation scheduler
    │   │   └── api/            # API routes
    │   ├── components/
    │   │   ├── chat/           # ChatView, Message, ToolExecution
    │   │   ├── composer/       # Input composer
    │   │   ├── sidebar/        # Navigation sidebar
    │   │   ├── ai-elements/    # AI UI primitives (Canvas, Reasoning, etc.)
    │   │   └── ui/             # shadcn/ui components
    │   └── lib/
    │       ├── ai/             # Providers, models
    │       ├── db/             # Schema, connection
    │       ├── sandbox/        # OpenSandbox client
    │       └── scheduler/      # Cron jobs
    ├── drizzle/                # Migrations
    └── .env.local              # Environment config
```

---

## Quick Start

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** 16+
- AI Provider API key (OpenAI / Anthropic / OpenRouter / etc.)

### Setup

```bash
# Clone the repository
git clone https://github.com/yafito11/artier-team.git
cd artier-team/artier-team-app

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your database URL and API keys

# Run database migrations
npx drizzle-kit push

# Start development server
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Chat | `/chat` | Real-time AI chat with streaming, reasoning, session history |
| Agents | `/agents` | Browse, create, and manage AI agents |
| Agent Builder | `/agents/builder` | AI-powered agent configuration generator |
| New Agent | `/agents/new` | Manual agent form with model/provider selection |
| Skills | `/skills` | Reusable skill templates with execute endpoint |
| Teams | `/teams` | Agent groups with routing strategies |
| Automations | `/automations` | Scheduled recurring tasks |

---

## API Routes

| Endpoint | Methods | Description |
|----------|---------|-------------|
| `/api/chat` | POST | Streaming chat completion |
| `/api/sessions` | GET, POST | Chat session CRUD |
| `/api/sessions/[id]` | GET, PATCH, DELETE | Single session management |
| `/api/agents/[id]` | GET, PATCH, DELETE | Agent CRUD |
| `/api/skills/[id]` | GET, PATCH, DELETE | Skill CRUD |
| `/api/skills/[id]/execute` | POST | Execute a skill |
| `/api/teams/[id]` | GET, PATCH, DELETE | Team CRUD |
| `/api/providers` | GET | AI provider list |
| `/api/models` | GET | Available models |
| `/api/builder/generate` | POST | AI agent config generation |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/artier_team

# AI Providers (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
OPENROUTER_API_KEY=sk-or-...

# OpenSandbox
SANDBOX_API_URL=http://localhost:3001
```

---

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">

<!-- Animated footer wave -->
<svg width="400" height="40" viewBox="0 0 400 40" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,20 Q50,5 100,20 T200,20 T300,20 T400,20" fill="none" stroke="#a78bfa" stroke-width="2" opacity="0.5">
    <animate attributeName="d" values="M0,20 Q50,5 100,20 T200,20 T300,20 T400,20;M0,20 Q50,35 100,20 T200,20 T300,20 T400,20;M0,20 Q50,5 100,20 T200,20 T300,20 T400,20" dur="4s" repeatCount="indefinite"/>
  </path>
  <path d="M0,22 Q50,7 100,22 T200,22 T300,22 T400,22" fill="none" stroke="#60a5fa" stroke-width="1.5" opacity="0.3">
    <animate attributeName="d" values="M0,22 Q50,7 100,22 T200,22 T300,22 T400,22;M0,22 Q50,37 100,22 T200,22 T300,22 T400,22;M0,22 Q50,7 100,22 T200,22 T300,22 T400,22" dur="5s" repeatCount="indefinite"/>
  </path>
  <path d="M0,18 Q50,3 100,18 T200,18 T300,18 T400,18" fill="none" stroke="#34d399" stroke-width="1" opacity="0.2">
    <animate attributeName="d" values="M0,18 Q50,3 100,18 T200,18 T300,18 T400,18;M0,18 Q50,33 100,18 T200,18 T300,18 T400,18;M0,18 Q50,3 100,18 T200,18 T300,18 T400,18" dur="6s" repeatCount="indefinite"/>
  </path>
</svg>

<br/>

**Artier Team** — Built with passion for AI agents

[⬆ Back to Top](#artier-team-)

</div>
