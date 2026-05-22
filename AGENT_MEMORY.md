# NS Wildfire Risk — Agent Memory & Task Bank

## Project Overview
Real-time wildfire risk dashboard for Nova Scotia. Built with React + TypeScript + Vite + Tailwind + Leaflet.
Hackathon: Hack the Elements by ShiftKey Labs. Theme: Fire.
Submission deadline: Sunday May 25 12:30PM.

## Tech Stack
- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Map: Leaflet + react-leaflet
- Weather API: Open-Meteo (no key needed)
- Deploy: Vercel

## File Structure
src/
├── components/ — Map.tsx, RiskCard.tsx, AlertBanner.tsx
├── data/ — locations.ts
├── utils/ — riskScore.ts, weather.ts
├── types/ — index.ts
└── App.tsx

## Completed
- [x] Project setup (Vite + React + TS + Tailwind)
- [x] Types defined
- [x] NS locations data (10 communities)
- [x] Risk score algorithm
- [x] Open-Meteo weather API integration
- [x] Base map rendering with Leaflet
- [x] Risk cards sidebar
- [x] Alert banner for high risk
- [x] Live data loading with skeleton states

## In Progress
- [ ] UI/UX overhaul — feels AI-generic, needs personality
- [ ] Heatmap overlay layer (leaflet.heat)
- [ ] Pulsing animations on high risk markers
- [ ] Darker more atmospheric map tiles

## Task Bank (Priority Order)
- [ ] Fix layout centering and responsiveness
- [ ] Swap map tiles to CartoDB dark matter
- [ ] Implement leaflet.heat heatmap overlay
- [ ] Pulse animation on Extreme/High markers
- [ ] Redesign header — minimal, branded
- [ ] Redesign sidebar cards — less congested
- [ ] Add historical 2023 Tantallon fire perimeter layer
- [ ] Add trend indicator (vs yesterday) on cards
- [ ] Add "Why This Matters" info panel with 2023 stats
- [ ] Mobile responsive layout
- [ ] Vercel deployment
- [ ] README documentation for GitHub submission
- [ ] Record demo video (prerecorded recommended per rules)
- [ ] Final slide deck

## Notes & Decisions
- Using Open-Meteo daily + hourly endpoints for weather
- Risk score 0-100 from temperature, humidity, wind, precipitation
- Tantallon + Hammonds Plains included deliberately — 2023 fire communities
- AI use is permitted but not the focus — use as tooling only
- Solo participant