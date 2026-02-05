# Bicycle Park Where? - Singapore

Find bicycle parking locations across Singapore on an interactive map.

![Screenshot](https://img.shields.io/badge/spots-2%2C542-blue) ![License](https://img.shields.io/badge/license-MIT-green)

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

## Tech Stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/) via [react-map-gl](https://visgl.github.io/react-map-gl/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT
