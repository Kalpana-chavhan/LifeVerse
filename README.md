# 🎮 LifeVerse - Gamify Your Entire Reality

> **Hey there! I'm Kalpana**
 This is my take on turning boring everyday life into an epic RPG adventure. Because let's be honest - life is way more fun when you're earning XP for doing laundry 😎

![Tech Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## 🚀 What Is This?

Imagine Pokémon, The Sims, and Habitica had a baby, and that baby grew up to be obsessed with productivity. That's LifeVerse! 

Every single thing you do in real life - studying, exercising, saving money, drinking water - turns into quests, levels you up, evolves your creatures, and builds your 3D city. It's like playing an MMORPG, except the game IS your actual life.

## ✨ The Cool Stuff

### 🎯 Main Features 

**LifeQuest Engine** 🎯
- Turn literally any habit or task into an RPG quest
- Daily & weekly quests with XP rewards
- Streak tracking (because I'm competitive like that)
- Achievement unlocks that actually feel rewarding

**HabitMon Creatures** 💜
- Raise 5 adorable creatures that evolve based on YOUR habits
- Each one represents a different life category (fitness, learning, etc.)
- Feed them by completing quests - forget to do quests and they get sad 😢
- Kinda like Tamagotchi but less likely to die

**FocusCity Builder** 🏙️
- Build an entire 3D city from scratch
- Every building unlocks with real-life achievements
- Watch your city grow as YOU grow
- It's weirdly satisfying, trust me

**Study Arena** 📚
- Pomodoro timer meets boss battles
- Your focus = your attack power
- Beat study bosses for massive XP rewards
- Makes studying feel like leveling up in Dark Souls (but less frustrating)

**BudgetQuest** 💰
- Finance tracking that doesn't make you cry
- Savings goals with progress bars (because progress bars are motivating)
- Expense categories earn you coins
- Who knew budgeting could be fun?

**HealthHero** 💪
- Water intake tracking (stay hydrated, friends!)
- Sleep monitoring
- Mood journal
- Step counter integration
- Basically your health stats like in an RPG

**Mind Palace** 🧠
- Note-taking system with memory strength tracking
- Spaced repetition for better retention
- Because your brain deserves power-ups too

**LifeClans** 🛡️
- Team up with friends
- Complete clan quests together
- Mega boss battles
- Leaderboards (for the competitive souls)

### 🎲 Mini Games (For When You Need a Break)

I built 5+ mini-games that actually earn you coins:
- Memory Match
- Math Rush (mental math practice that doesn't suck)
- Word Scramble
- Pattern Memory
- Reaction Time challenges

All with multiplayer support because playing alone is boring.

## 🛠️ Tech Stack 

I built this using the **MERN stack** (MongoDB, Express, React, Node.js) but with Next.js because I wanted server-side rendering and API routes in one place:

- **Next.js 15** - The brains of the operation
- **React 19** - For all the UI magic
- **TypeScript** - Because I like knowing my code won't explode
- **MongoDB** - Storing all your data in the cloud
- **Tailwind CSS** - Making things pretty without writing 1000 lines of CSS
- **Shadcn/UI** - Pre-built components that I customized heavily
- **Framer Motion** - Animations that make everything feel alive
- **Better Auth** - Keeping your account secure
- **Socket.io** - Real-time chat and multiplayer features

## 🎨 Design Philosophy

I went for a **Minecraft/retro game vibe** mixed with modern UI:
- Pixel fonts for headers (Press Start 2P)
- Neon purple/cyan/green color scheme
- Glowing effects everywhere
- Particle animations in the background
- XP bars that shimmer
- Coin animations that pulse
- Rarity system for items (Common → Legendary with different glows)

Basically, I wanted it to feel like you're inside a video game, not just using an app.

## 📦 Setup (Let's Get You Started)

### What You Need:
- **Node.js v18+** ([Get it here](https://nodejs.org/))
- **MongoDB Atlas account** (free tier works great - [sign up](https://www.mongodb.com/cloud/atlas))
- **5 minutes of your time**

### Installation:

``bash
# 1. Clone
git clone <my-repo-url>
cd lifeverse

# 2. Install dependencies (I use npm, but yarn/bun work too)
npm install

# 3. Set up your .env file 

# 4. Run it!
npm run dev


### Environment Variables (.env file):

Create a `.env` file in the root directory and add these:

# MongoDB Connection - CRITICAL! Get this from MongoDB Atlas
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/lifeverse?retryWrites=true&w=majority

# Auth Secret - Generate a random 32+ character string
BETTER_AUTH_SECRET=your-super-secret-key-goes-here-make-it-long

# App URLs
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Pro tip:** Generate a secure secret with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### MongoDB Atlas Setup (Important!):

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a FREE cluster (yes, it's actually free)
3. Click **"Connect"** → **"Connect your application"**
4. Copy the connection string
5. Replace `<password>` with your actual password
6. Add `/lifeverse` at the end for the database name
7. Paste it into your `.env` file

## 📁 Project Structure (How It's Organized)

```
lifeverse-kalpana/
├── src/
│   ├── app/                    # Next.js pages & API routes
│   │   ├── api/                # Backend API (all the database stuff)
│   │   ├── dashboard/          # Main dashboard page
│   │   ├── quests/             # Quest management
│   │   ├── creatures/          # HabitMon page
│   │   ├── city/               # FocusCity 3D builder
│   │   ├── study/              # Study Arena
│   │   ├── finance/            # BudgetQuest
│   │   ├── games/              # Mini games
│   │   ├── chat/               # Friend chat
│   │   ├── clan/               # Clans system
│   │   └── ...more pages
│   ├── components/             # React components (UI building blocks)
│   │   ├── ui/                 # Shadcn components (customized by me)
│   │   ├── Navbar.tsx          # Navigation bar
│   │   └── ...more components
│   ├── lib/                    # Utilities & config
│   │   ├── auth.ts             # Authentication setup
│   │   ├── mongodb.ts          # Database connection
│   │   └── store.ts            # State management (Zustand)
│   └── models/                 # Database schemas (optional)
├── public/                     # Static files (images, etc.)
├── .env                        # Environment variables (DON'T COMMIT THIS!)
└── package.json                # Dependencies & scripts
```

## 🎮 How It Works 

1. **Sign up** → Get your starter creatures and city
2. **Create quests** → Turn your to-do list into missions
3. **Complete quests** → Earn XP, coins, and level up
4. **Evolve creatures** → Your habits improve, they evolve
5. **Build your city** → Unlock buildings as you progress
6. **Play games** → Earn extra coins and compete with friends
7. **Join clans** → Team up for bigger challenges
8. **Repeat** → Watch your life improve while having fun

## 🚀 Deployment (Going Live)

 **Vercel** (it's free and works perfectly with Next.js):

1. Push your code to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add your environment variables in Vercel's dashboard
4. Click deploy
5. Boom! You're live 🎉

**Important:** Update your env vars for production:
```env
BETTER_AUTH_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## 🐛 Known Issues (Things I'm Still Fixing)

- Creatures can get TOO demanding if you neglect them (intentional design choice 😅)
- 3D city rendering might be slow on older devices (working on optimization)
- Some animations might be overkill (but they look cool, so...)

## 💡 Future Plans (What's Coming Next)

- [ ] Mobile app (React Native version)
- [ ] AI quest suggestions based on your habits
- [ ] More creature types and evolutions
- [ ] Seasonal events and limited-time challenges
- [ ] Trading system between players
- [ ] Custom themes and skins
- [ ] Voice commands for quest completion
- [ ] Integration with fitness trackers

## 🤝 Contributing

Found a bug? Want to add a feature? Feel free to:
1. Fork this repo
2. Create a branch (`git checkout -b feature/awesome-thing`)
3. Make your changes
4. Commit (`git commit -m 'Added awesome thing'`)
5. Push (`git push origin feature/awesome-thing`)
6. Open a Pull Request


## 📝 License

MIT License.

##  Credits 

- **Created by Kalpana** (that's me!) ✨
- Inspired by Habitica, Pokémon, and my procrastination habits
- Built with love, coffee, and way too many late nights
- UI components from Shadcn (heavily customized)
- Icons from Lucide React
- Fonts from Google Fonts (Press Start 2P is 🔥)

## 📬 Contact

Got questions? Found a bug? Just want to say hi?

- **GitHub:** [Open an issue](https://github.com/kalpana-chavhan/LifeVerse/issues)
- **Email:** kalpnachauhan347@gmail.com
- **Linkedin:** https://www.linkedin.com/in/kalpana-chauhan347

---

## 🎯 Final Thoughts

I built LifeVerse because I was tired of boring productivity apps that felt like work. Life should be fun! Why not turn everything into a game?

If this app helps you complete even ONE more task per day, I'll consider it a success 🎉

Now stop reading and go start your adventure! 🚀

**Transform your life, one quest at a time.** ✨

---

*P.S. - If you max out all your creatures and reach level 100, DM me for a virtual high-five* 🙌

Made with 💜 by Kalpana | © 2025
