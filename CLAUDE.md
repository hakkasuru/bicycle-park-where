# Singapore Bicycle Parking Webapp

A React webapp that displays bicycle parking locations in Singapore on an interactive Mapbox map.

## Tech Stack
- React 18 + Vite
- Mapbox GL JS via `react-map-gl`
- Tailwind CSS v4
- Static JSON data from LTA DataMall

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and add your tokens:
- `VITE_MAPBOX_TOKEN` - Mapbox access token for map rendering
- `LTA_API_KEY` - LTA DataMall API key (only needed for data refresh)

## SECURITY - IMPORTANT

**NEVER commit API keys or tokens to the repository.**

- All tokens are stored in `.env` (gitignored)
- `.env.example` contains placeholder values only
- When helping with this project, NEVER:
  - Hardcode tokens in source files
  - Output actual token values in responses
  - Commit `.env` files
  - Share or reveal token values

## Project Structure

```
src/
├── components/
│   ├── Map.jsx           # Full-screen Mapbox map
│   ├── SearchBar.jsx     # Address search (Mapbox Geocoding)
│   ├── FilterSheet.jsx   # Bottom sheet with filters
│   ├── Popup.jsx         # Parking spot details
│   └── LocateButton.jsx  # Geolocation button
├── hooks/
│   ├── useFilteredData.js
│   └── useGeolocation.js
├── data/
│   └── bicycle-parking.json
├── App.jsx
└── main.jsx
```

## Data Refresh

To fetch fresh data from LTA DataMall:
```bash
LTA_API_KEY=your_key npm run fetch-data
```

## Deployment

Deploy to Vercel - set `VITE_MAPBOX_TOKEN` in environment variables.
