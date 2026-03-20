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

##  Setup Guide — Get Running in 5 Minutes

### Step 1: Prerequisites

Make sure you have:
- **Node.js v18+** → [Download here](https://nodejs.org)
- **Git** → [Download here](https://git-scm.com)
- A free **MongoDB Atlas** account → [Sign up here](https://cloud.mongodb.com)

Check your Node version:
```bash
node --version   # Should show v18.0.0 or higher
```

---

### Step 2: Clone the Repository

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/lifeverse.git

# Enter the project folder
cd lifeverse
```

---

### Step 3: Install Dependencies

```bash
npm install
# or if you prefer:
yarn install
# or:
bun install
```

This installs everything: Next.js, React, MongoDB driver, animations, etc.

---

### Step 4: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and **create a free account**
2. Click **"Build a Database"** → choose **FREE** tier (M0) → pick any region
3. Create a database user:
   - Click **"Database Access"** → **"Add New Database User"**
   - Set a username + password (save these!)
4. Whitelist your IP:
   - Click **"Network Access"** → **"Add IP Address"** → **"Allow Access from Anywhere"** (for development)
5. Get your connection string:
   - Click **"Database"** → **"Connect"** → **"Connect your application"**
   - Copy the string — it looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

---

### Step 5: Configure Environment Variables

Create a `.env` file in the root of the project:

```bash
# On Mac/Linux:
cp .env.example .env

# On Windows:
copy .env.example .env
```

Now open `.env` and fill in your values:

```env
# Paste your MongoDB connection string here
# Replace <password> with your actual DB password
# Add /lifeverse at the end for the database name
MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/lifeverse?retryWrites=true&w=majority

# Generate a secure secret key (copy the output):
# Run in terminal: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
BETTER_AUTH_SECRET=paste_your_generated_secret_here

# App URLs (keep these as-is for local development)
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Generate your secret key:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output and paste it as your `BETTER_AUTH_SECRET`.

---

### Step 6: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. 🎉

You should see the LifeVerse landing page!

---

### Step 7: Create Your Account

1. Click **"Start Free"** or go to `/auth/register`
2. Create an account — you'll automatically get:
   - 5 starter HabitMon creatures
   - 100 coins
   - Your starter city
3. Start creating quests and earning XP!

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
