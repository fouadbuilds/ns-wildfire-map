# 🔥 Firewatch NS

**Real-time wildfire situational awareness for Nova Scotia communities.**

Built for Hack the Elements 2026 — ShiftKey Labs.

## The Problem

When a wildfire emergency occurs in Nova Scotia, residents receive generic province-wide alerts that don't answer the questions that matter most:

- Is the fire heading toward *my* community?
- How long do I have?
- Which road do I take?
- Where do I go?

In May 2023, 16,000 Halifax-area residents were evacuated with approximately 30 minutes notice. No public tool existed to give community-specific guidance.

## The Solution

Firewatch converts live weather data into a real-time risk score for 26 Nova Scotia communities — and pairs that risk score with immediate, actionable evacuation guidance.

## Features

- 🗺️ Interactive map with community-level risk indicators
- 📊 Risk score (0-100) from temperature, humidity, wind, and precipitation
- 🚗 Evacuation routes and nearest shelters per community
- 📅 7-day risk outlook with forecast scrubber
- 💨 Live wind direction and speed indicator
- 🚨 Province-wide status banner (All Clear / Watch / Critical)
- 🚒 Emergency contacts — 911 and NS Forestry Fire Line

## Data Sources

- **Weather:** Open-Meteo API (open source, no key required)
- **Communities:** 26 NS municipalities across all regions
- **Evacuation routes:** Nova Scotia Emergency Management Office guidelines

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Leaflet + react-leaflet
- Open-Meteo API


