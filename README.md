# Oneiro

![Oneiro Banner](./banner.png)

An atmospheric dream journal that turns entries into visuals, reveals recurring symbols, and charts your emotional landscape.

**Highlights**
- Dream journaling with cinematic image generation
- Memory Atlas: a living network of symbols, themes, and connections
- Insights dashboard for mood frequency and lucidity trends
- Local-first storage with automatic persistence

**Requirements**
- Node.js 18+ recommended
- A Gemini API key for dream analysis and imagery

**Getting Started**
1. Install dependencies:
```
npm install
```
2. Create `.env.local` in the project root:
```
API_KEY=your_key_here
```
3. Start the dev server:
```
npm run dev
```
4. Open the URL shown in your terminal (typically `http://localhost:5173`).

**Project Scripts**
- `npm run dev` — start the local dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally

**Configuration**
- Environment variables live in `.env.local`.
- The app reads `API_KEY` for Gemini requests.
- Dreams are stored in `localStorage`, so data stays in the current browser.

**Workflow**
1. Write a dream in the Journal tab.
2. The app analyzes the dream and generates a visual.
3. Use the Memory Atlas to explore theme and symbol relationships.
4. Use Insights to see mood distribution and lucidity trends.

**Tech Stack**
- React + TypeScript + Vite
- D3 for the Memory Atlas
- Recharts for Insights
- Google Gemini for analysis and imagery

**Project Structure**
- `/components` — UI components (DreamInput, DreamCard, Atlas, Insights)
- `/services` — Gemini integration
- `/types.ts` — shared types
- `/App.tsx` — layout and view switching

**Troubleshooting**
- If you see “The subconscious is clouded right now,” the Gemini request failed.
1. Confirm your API key is valid.
2. Check that `.env.local` is in the project root.
3. Restart the dev server after editing env vars.

**Deploying**
1. Build the app:
```
npm run build
```
2. Deploy the `dist` folder to any static host (Vercel, Netlify, GitHub Pages, etc.).
3. Set `API_KEY` as an environment variable in your host’s settings.

**License**
MIT
