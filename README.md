# 🎮 LifeVerse — Gamify Your Entire Reality

> *Made with 💜 by Kalpana*

**Turn your real life into an epic MMORPG.** Every habit, every quest, every achievement — your actual life becomes a game. Earn XP for doing laundry. Evolve creatures by studying. Build a city by saving money.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 🚀 What Is This?

Imagine Pokémon, The Sims, and Habitica had a baby, and that baby grew up to be obsessed with productivity. That's LifeVerse!

Every single thing you do in real life — studying, exercising, saving money, drinking water — turns into quests, levels you up, evolves your creatures, and builds your city.

---

## ✨ Features

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

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes (App Router)
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT + bcrypt (custom, no third-party dependency)
- **State**: Zustand (with localStorage persistence)
- **Fonts**: Press Start 2P (pixel), Orbitron (display), Rajdhani (body)

---

## 📦 Setup Guide — Get Running in 5 Minutes

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

### Step 4: Set Up MongoDB Atlas (Free!)

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

## 🎨 Customizing LifeVerse as Your Own

### Change the Author Name
In `src/app/page.tsx`, find:
```tsx
<p className="text-gray-500 mb-10 font-body">Made with 💜 by Kalpana</p>
```
Change `Kalpana` to your name.

### Change Colors / Theme
Edit `tailwind.config.js` — the `neon` colors:
```js
neon: {
  purple: '#b44fff',  // Main accent — change this
  cyan: '#00f5ff',    // Secondary accent
  green: '#39ff14',   // Success color
  // ... etc
}
```

### Change the App Name
1. `src/app/layout.tsx` — update `metadata.title`
2. `src/components/layout/Sidebar.tsx` — update the `LIFEVERSE` text
3. `src/app/page.tsx` — update the hero text

### Add New Quest Categories
In `src/app/quests/page.tsx`, add to the `CATEGORIES` array and `CAT_ICONS` object.

### Add New Buildings
In `src/app/api/city/route.ts`, add entries to the `BUILDINGS` array:
```ts
{ type: 'dojo', name: 'Dojo', emoji: '🥋', unlockLevel: 9, category: 'fitness', description: 'Master of martial arts' }
```

### Add New HabitMon Creatures
In `src/models/Creature.ts`, add to `CREATURE_SPECIES`:
```ts
creativity: { name: 'Artiso', emojis: ['🥚', '🎨', '🖼️', '🌌'], color: '#ff6b00' }
```

### Change XP Formula
In `src/lib/utils.ts`, modify `calculateLevel()`:
```ts
export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1  // Change 100 to make leveling faster/slower
}
```

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

## 🚢 Deploying to Production

### Deploy to Vercel (Recommended — Free!)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial LifeVerse commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lifeverse.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **"New Project"** → Import your GitHub repo

3. Add Environment Variables in Vercel dashboard:
   - `MONGODB_URI` — your MongoDB connection string
   - `BETTER_AUTH_SECRET` — your secret key
   - `BETTER_AUTH_URL` — your Vercel URL (e.g. `https://lifeverse.vercel.app`)
   - `NEXT_PUBLIC_APP_URL` — same as above

4. Click **Deploy!** Your app will be live in ~2 minutes.

5. **Important:** Update MongoDB Atlas Network Access to allow Vercel IPs (or use "Allow from anywhere" with `0.0.0.0/0`).

---

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
- Check your `MONGODB_URI` in `.env` — make sure the password is correct
- Check MongoDB Atlas Network Access — your IP must be whitelisted
- Make sure you added `/lifeverse` at the end of the connection string

**"Module not found" errors**
- Run `npm install` again
- Delete `node_modules` and `.next`, then run `npm install`

**"JWT_SECRET is not defined"**
- Make sure your `.env` file has `BETTER_AUTH_SECRET` set

**Page shows blank / 404**
- Make sure the dev server is running (`npm run dev`)
- Check the terminal for error messages

**Styles not loading**
- Run `npm run dev` (not just `node server.js`)
- Make sure `postcss.config.js` exists

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/new-game`
3. Commit changes: `git commit -m 'Add Word Scramble game'`
4. Push: `git push origin feature/new-game`
5. Open a Pull Request

---

## 📄 License

MIT — do whatever you want with it!

---

## 💜 Credits

Built with love by **Kalpana**.

*"Because life is way more fun when you're earning XP for doing laundry."* 😎

---

<div align="center">
  <strong>⭐ If you like LifeVerse, star the repo! ⭐</strong>
</div>
