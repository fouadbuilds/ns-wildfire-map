# Firewatch NS — Agent Memory & Task Bank

## Project Overview

Real-time wildfire risk dashboard for Nova Scotia. Built with React + TypeScript + Vite + Tailwind + Leaflet.
Hackathon: Hack the Elements by ShiftKey Labs. Theme: Fire.
Submission deadline: Sunday May 25 12:30PM.
Solo participant.

## Pitch

"Nova Scotia has no public-facing real-time wildfire risk tool for everyday residents.
Firewatch combines live weather data — temperature, humidity, wind, precipitation —
into a single danger score for 26 NS communities, visualised on an interactive map.
Built in the wake of the 2023 Tantallon fire that displaced 16,000 Halifax residents."

## How It Meets The Brief

Earth's systems are interconnected — Firewatch shows how:

- Air (wind speed/direction) + Water (precipitation deficit) + Earth (terrain/vegetation)
  combine to produce Fire risk. Not just a weather app — an interconnected systems tool.

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Map: Leaflet + react-leaflet
- Weather API: Open-Meteo (no key, free, 7-day forecast)
- Deploy: Vercel (not yet deployed)

## File Structure

src/
├── components/
│ ├── Map.tsx — Leaflet map, flame icons, fly-to on select
│ ├── RiskCard.tsx — Left sidebar community cards
│ ├── AlertBanner.tsx — Top banner for high risk
│ ├── DetailPanel.tsx — Right panel, NS summary + community detail
│ └── TimeSlider.tsx — 7-day forecast scrubber at bottom of map
├── data/
│ └── locations.ts — 26 NS communities with lat/lng/region
├── utils/
│ ├── riskScore.ts — calculateRiskScore, getRiskLevel, assessRisk
│ └── weather.ts — fetchWeather (Open-Meteo), windDirectionLabel
├── types/
│ └── index.ts — Location, WeatherData, ForecastDay, RiskResult, LocationWithRisk
└── App.tsx — Main layout, state, data fetching

## Risk Score Algorithm

Score 0-100 from four factors:

- Temperature (max 30pts) — >32°C=30, >28°C=22, >23°C=14, >18°C=6
- Humidity (max 30pts) — <25%=30, <35%=22, <50%=14, <65%=6
- Windspeed (max 25pts) — >50=25, >35=18, >20=10, >10=4
- Precipitation (max 15pts) — <1mm=15, <5mm=8, <15mm=3

## Risk Levels & Colors

- Low #22C55E score 0-19
- Moderate #EAB308 score 20-39
- High #F97316 score 40-59
- Very High #EF4444 score 60-79
- Extreme #9333EA score 80-100

## Layout

- Dark header (#1a1a1a) with orange Firewatch branding
- Left sidebar (w-64) — search + community list (RiskCards)
- Centre — Leaflet map with flame icons + TimeSlider overlay
- Right panel — always visible, NS overview by default, community detail on select
- Right panel slides in with animation, closeable, reopens with arrow button
- Light mode throughout (bg #F5F0E8, white panels)

## Completed

- [x] Project setup (Vite + React + TS + Tailwind)
- [x] Types defined including ForecastDay
- [x] 26 NS locations across all regions
- [x] Risk score algorithm (5 levels)
- [x] Open-Meteo API — live weather + 7-day forecast
- [x] Leaflet map — light CartoDB tiles
- [x] Flame icons — sized/colored by risk, pulse on High+
- [x] Fly-to animation on community select
- [x] Left sidebar with search and RiskCards
- [x] Alert banner for risk >= 40
- [x] Right detail panel — NS overview + community detail
- [x] Panel slide-in animation
- [x] Panel close/reopen with arrow
- [x] TimeSlider — 7-day forecast scrubber
- [x] forecastLocations — map + sidebar + panel update with slider
- [x] Light mode full UI overhaul
- [x] Evacuation info per community
- [x] First responder emergency contacts

## Task Bank (Priority Order)

### Must Have

- [x] Deploy to Vercel — prepared repository for deployment
  - Notes: added `vercel.json` (static-build, `dist` output) and README deployment instructions. Manual import/link on Vercel required to produce the live URL; the agent cannot perform network-authenticated deploys.
- [ ] Map layers toggle — street (CartoDB Positron) / satellite (ESRI World Imagery)
- [ ] README.md — project description, setup instructions, data sources
- [ ] Push slide deck to GitHub repo
- [ ] Record 4min demo video (prerecorded recommended per rules)

### High Priority

- [ ] Heatmap layer — leaflet.heat behind flame icons, warm glow over risk zones
- [ ] 7-day forecast mini bar chart in detail panel per community
- [ ] 2023 Tantallon burn perimeter — GeoJSON overlay from NS Open Data
      URL: https://opendata.novascotia.ca (search "wildfire")

### Polish

- [ ] TimeSlider label — make clear it's "7-Day Risk Forecast" not fire progression
- [ ] County boundary overlay on zoom
- [ ] Mobile responsive layout
- [ ] Smooth transitions on risk card hover
- [ ] Loading skeleton improvements

## Key Decisions & Notes

- Using Open-Meteo daily + hourly endpoints, forecast_days=7
- Humidity pulled from hourly[i*24] per day
- forecastLocations derived state — don't mutate locations directly
- Leaflet z-index overridden in index.css to fix slider visibility
- isolation: isolate on main tag for stacking context
- AI use permitted but not the focus — used as tooling only
- Tantallon + Hammonds Plains included deliberately (2023 fire communities)
- The interconnected systems story: Air + Water → Fire risk on Earth

## Judging Criteria Reminder

- Problem Understanding & Research — 30%
- Impact, Innovation & Creativity — 30%
- Product Functionality — 20%
- Presentation & Storytelling — 20%

## Emergency Contacts In App

- Active fire: 911
- NS Forestry Fire Line: 1-800-565-2224
- NS Emergency Management: novascotia.ca/fire
