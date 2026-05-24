# Firewatch NS — Project Memory

## What The App Is

Firewatch NS is an emergency-first wildfire risk dashboard for Nova Scotia. The goal is to help a resident answer four questions fast:

- Where is the fire risk strongest?
- How fast could it reach me?
- What should I do right now?
- Where should I go?

## Current Pitch

"See where wildfire risk is highest, how fast it could reach you, and what evacuation route to take next."

## What Changed From The Forecasty Version

The app used to feel like a forecast viewer. We shifted it into a crisis-action MVP:

- Removed the main-map forecast slider so the map stays focused on risk and location.
- Moved forecast exploration into the right-side `DetailPanel` behind an optional Forecast tab.
- Reordered the detail experience so evacuation guidance appears before weather detail.
- Added `minutes-to-impact` estimates to make urgency explicit.
- Added evacuation route + shelter CTAs and a `RouteModal`.
- Added emergency CTAs in the alert banner.
- Reduced decorative motion so the UI feels more like a command center than a weather app.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Leaflet + react-leaflet
- Open-Meteo weather API

## Core Architecture

- `src/App.tsx` wires the app state, selected location, panel state, and route modal.
- `src/components/Map.tsx` renders the map, markers, and fire-risk visual layer.
- `src/components/RiskCard.tsx` shows community risk summaries and minutes-to-impact.
- `src/components/DetailPanel.tsx` shows the selected community, evacuation guidance, and optional forecast tab.
- `src/components/RouteModal.tsx` shows route/shelter instructions and is keyboard accessible.
- `src/components/AlertBanner.tsx` surfaces urgent app-wide actions.
- `src/components/TimeSlider.tsx` is still used, but only inside the detail panel forecast tab.
- `src/utils/spread.ts` estimates minutes-to-impact.
- `src/utils/riskScore.ts` turns weather inputs into a risk score and label.

## Important Product Decisions

- Emergency guidance comes before deep weather detail.
- The map is for situational awareness, not forecast browsing.
- The route modal should be reachable from the alert banner and community details.
- The UI should read like an emergency operations view, not a generic dashboard.
- Forecast data is secondary context, not the main interaction.

## Validated Behavior

- Production build passes with `npm run build`.
- `RouteModal` uses a stable React ID and passes the purity lint check.
- `App.tsx` now resolves `DetailPanel` cleanly in the editor/TypeScript server.

## Current State

- Core emergency-first flow is in place.
- Playwright smoke tests were removed at the user's request.
- Remaining polish work is mostly responsive tweaks, decorative motion cleanup, and final QA.
