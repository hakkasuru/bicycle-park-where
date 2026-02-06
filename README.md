# Bicycle Park Where? - Singapore

Find bicycle parking locations across Singapore on an interactive map.

**🚲 Live Demo: [bicycle-park-where.vercel.app](https://bicycle-park-where.vercel.app/)**

![Screenshot](https://img.shields.io/badge/spots-26k+-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## Features

- **Interactive Map** - Mapbox GL with clustering for smooth performance
- **Search** - Find locations by address (Mapbox Geocoding)
- **Filters** - Filter by shelter, rack type, and capacity
- **Geolocation** - Find parking spots near you
- **Mobile-friendly** - Responsive design works on all devices

## Data Source

Bicycle parking data from [LTA DataMall](https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html) (~2,542 locations).

**Last updated:** February 2026

## Getting Started

### Prerequisites

- Node.js 18+
- [Mapbox Access Token](https://account.mapbox.com/access-tokens/)

### Installation

```bash
# Clone the repo
git clone https://github.com/hakkasuru/bicycle-park-where.git
cd bicycle-park-where

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your Mapbox token to .env.local
# VITE_MAPBOX_TOKEN=pk.your_token_here

# Start dev server
npm run dev
```

### Refresh Data (Optional)

To fetch the latest data from LTA DataMall:

```bash
# Get API key from https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html
LTA_API_KEY=your_key npm run fetch-data
```

## Contributing a Spot

Know a bicycle parking spot not in the official data? Add it to `src/data/user-submitted.json`:

```json
{
  "Description": "Location name",
  "Latitude": 1.2345,
  "Longitude": 103.8765,
  "RackType": "SHOPPING_MALL",
  "RackCount": 10,
  "ShelterIndicator": "Y",
  "Notes": "Optional helpful notes"
}
```

### Fields

| Field | Required | Description |
|-------|----------|-------------|
| `Description` | Yes | Location name |
| `Latitude` | Yes | GPS latitude |
| `Longitude` | Yes | GPS longitude |
| `RackType` | Yes | See rack types below |
| `RackCount` | Yes | Number of parking lots |
| `ShelterIndicator` | Yes | `"Y"` = sheltered, `"N"` = unsheltered |
| `Notes` | No | Helpful tips (e.g., "Near exit B") |

### Rack Types

`HDB_RACKS`, `MRT_RACKS`, `LTA_RACKS`, `NPARKS_RACKS`, `NLB_RACKS`, `PA_RACKS`, `SPORTSG_RACKS`, `JTC_RACKS`, `ITE_RACKS`, `SHOPPING_MALL`, `OTHER`

User-submitted spots appear as **orange markers** on the map.

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) via [react-map-gl](https://visgl.github.io/react-map-gl/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT
