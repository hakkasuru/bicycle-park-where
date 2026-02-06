# Singapore Bicycle Parking Webapp

A React webapp that displays bicycle parking locations in Singapore on an interactive Mapbox map.

## Tech Stack
- React 18 + Vite
- Mapbox GL JS via `react-map-gl` v7
- Tailwind CSS v4 (uses `@tailwindcss/postcss`)
- Static JSON data from LTA DataMall (~26k spots)

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` and add your tokens:
- `VITE_MAPBOX_TOKEN` - Mapbox access token for map rendering
- `LTA_API_KEY` - LTA DataMall API key (only needed for data refresh)

## SECURITY - IMPORTANT

**NEVER commit API keys or tokens to the repository.**

- All tokens are stored in `.env.local` (gitignored)
- `.env.example` contains placeholder values only
- When helping with this project, NEVER:
  - Hardcode tokens in source files
  - Output actual token values in responses
  - Commit `.env` or `.env.local` files
  - Share or reveal token values

## Git Commit Practices

- **Do NOT add co-author lines to commit messages** (no `Co-Authored-By` footer)
- Keep commit messages concise and descriptive

## Project Structure

```
src/
├── components/
│   ├── Map.jsx           # Mapbox map with clustered GeoJSON layers
│   ├── SearchBar.jsx     # Address search (Mapbox Geocoding API)
│   ├── FilterSheet.jsx   # Bottom sheet with filter controls
│   ├── InfoSheet.jsx     # About/legend bottom sheet
│   ├── Popup.jsx         # Parking spot details popup
│   └── LocateButton.jsx  # Geolocation button
├── hooks/
│   ├── useFilteredData.js  # Filter logic + rack type labels
│   └── useGeolocation.js   # Browser geolocation hook
├── data/
│   ├── bicycle-parking.json  # LTA DataMall data (~26k spots)
│   └── user-submitted.json   # Community-contributed spots
├── App.jsx
├── main.jsx
└── index.css
scripts/
└── fetch-data.js  # LTA API fetch with multi-point coverage
```

## Data Sources

### 1. LTA DataMall (`bicycle-parking.json`)
- ~26,000 official bicycle parking locations
- Fetched using multiple query points to cover all of Singapore
- Fields: `Description`, `Latitude`, `Longitude`, `RackType`, `RackCount`, `ShelterIndicator`

### 2. User-Submitted (`user-submitted.json`)
- Community-contributed spots not in official data
- Same schema + optional `Notes` field
- Marked with `isUserSubmitted: true` at runtime in App.jsx

## Map Marker Styling

Uses Mapbox GL layers (WebGL) for performance, not React markers.

| Type | Sheltered | Unsheltered |
|------|-----------|-------------|
| Official (blue) | Blue filled | White with blue border |
| User-submitted (orange) | Orange filled | White with orange border |

Clusters show as blue circles with count.

## Filter Logic (`useFilteredData.js`)

- **Sheltered only** - Toggle to show only `ShelterIndicator === 'Y'`
- **Rack types** - Multi-select chips (HDB, MRT, LTA, Parks, etc.)
- **Minimum capacity** - Slider for `RackCount >= value`
- **Show Yellow Box** - Toggle (hidden by default)

### Rack Types
```
HDB_RACKS, MRT_RACKS, LTA_RACKS, NPARKS_RACKS, NLB_RACKS, PA_RACKS,
SPORTSG_RACKS, JTC_RACKS, ITE_RACKS, NANYANG POLY_RACKS, JBTC_RACKS,
Yellow Box, SHOPPING_MALL, OTHER, URA_RACKS, NEA_RACKS, PUB_RACKS, etc.
```

## Data Fetch Script (`scripts/fetch-data.js`)

Fetches from LTA DataMall API using multiple query points:
- 10 points across Singapore (West, Central, East, North, South)
- 5km radius per point
- 100ms delay between requests (rate limiting)
- Deduplicates using `lat_lng_description` key
- Max 20 iterations per point (safety limit)

```bash
LTA_API_KEY=your_key npm run fetch-data
```

## Key Architectural Decisions

1. **GeoJSON + Layers over React Markers** - 26k markers would lag; using Mapbox native clustering with WebGL rendering
2. **Static JSON over API calls** - Data bundled for fast load, no runtime API dependency
3. **Multi-point fetch** - Single center point missed West/North/East Singapore
4. **Yellow Box hidden by default** - Less useful for most users, opt-in toggle
5. **User-submitted as separate file** - Easy for contributors, merged at runtime

## Deployment

Deploy to Vercel:
1. Connect GitHub repo
2. Set `VITE_MAPBOX_TOKEN` environment variable
3. Auto-deploys on push to main
