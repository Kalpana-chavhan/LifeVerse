# 🎮 LifeVerse : Gamify Your Entire Reality

Made by : kalpanachavhan347@gmail.com


**Turn your real life into an epic MMORPG.** Every habit, every quest, every achievement — your actual life becomes a game. Earn XP for doing laundry. Evolve creatures by studying. Build a city by saving money.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

##  What Is This?

Imagine Pokémon, The Sims, and Habitica had a baby, and that baby grew up to be obsessed with productivity. That's LifeVerse!

Every single thing you do in real life — studying, exercising, saving money, drinking water — turns into quests, levels you up, evolves your creatures, and builds your city.

---

##  Features

| Feature | Description |
|---|---|
| ⚔️ **LifeQuest Engine** | Turn ANY habit into an RPG quest with XP + coin rewards |
| 💜 **HabitMon Creatures** | 5 creatures that evolve based on your real-life habits |
| 🏙️ **FocusCity Builder** | Build a city that grows as YOU grow |
| 📚 **Study Arena** | Pomodoro timer + boss battles |
| 💰 **BudgetQuest** | Finance tracking with progress bars and coins |
| 💪 **HealthHero** | Water, sleep, steps, and mood tracking |
| 🎲 **Mini Games** | Memory Match, Math Rush, Reaction Test — earn coins |
| 🛡️ **LifeClans** | Team up with friends for group challenges |
| 🏆 **Leaderboard** | Compete globally by XP, streak, or quests |

---

##  Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes (App Router)
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT + bcrypt (custom, no third-party dependency)
- **State**: Zustand (with localStorage persistence)
- **Fonts**: Press Start 2P (pixel), Orbitron (display), Rajdhani (body)

---


## 📁 Project Structure

```
lifeverse/
├── src/
│   ├── app/                    # Next.js App Router pages + API
│   │   ├── api/                # Backend API routes
│   │   │   ├── auth/           # login, register, logout, me
│   │   │   ├── quests/         # Quest CRUD + completion
│   │   │   ├── creatures/      # HabitMon management
│   │   │   ├── city/           # FocusCity builder
│   │   │   ├── finance/        # Transactions + savings
│   │   │   ├── health/         # Health tracking
│   │   │   ├── clans/          # Clan system
│   │   │   └── user/           # Leaderboard
│   │   ├── dashboard/          # Main dashboard
│   │   ├── quests/             # Quest management UI
│   │   ├── creatures/          # HabitMon UI
│   │   ├── city/               # FocusCity UI
│   │   ├── study/              # Study Arena + Pomodoro
│   │   ├── finance/            # BudgetQuest UI
│   │   ├── health/             # HealthHero UI
│   │   ├── games/              # Mini games arcade
│   │   ├── clan/               # Clans system UI
│   │   ├── leaderboard/        # Global rankings
│   │   ├── profile/            # User profile
│   │   └── auth/               # Login + Register pages
│   ├── components/
│   │   └── layout/             # Sidebar, Topbar, DashboardLayout
│   ├── lib/                    # Utilities
│   │   ├── mongodb.ts          # DB connection
│   │   ├── auth.ts             # JWT + bcrypt auth
│   │   └── utils.ts            # XP math, helpers
│   ├── models/                 # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Quest.ts
│   │   ├── Creature.ts
│   │   ├── Finance.ts
│   │   ├── Health.ts
│   │   ├── City.ts
│   │   └── Clan.ts
│   ├── store/                  # Zustand global state
│   │   └── index.ts
│   └── hooks/
│       └── useAuth.ts
├── public/                     # Static assets
├── .env.example                # Environment template
├── .env                        # YOUR secrets (never commit!)
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---


## 📄 License

MIT — do whatever you want with it!

---



Built with love by **Kalpana**.

---

<div align="center">
  <strong>⭐ If you like LifeVerse, star the repo! ⭐</strong>
</div>
