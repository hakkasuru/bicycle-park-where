import { useState } from 'react';
import { Map } from './components/Map';
import { SearchBar } from './components/SearchBar';
import { FilterSheet } from './components/FilterSheet';
import { LocateButton } from './components/LocateButton';
import { useFilteredData, DEFAULT_FILTERS } from './hooks/useFilteredData';
import { useGeolocation } from './hooks/useGeolocation';
import bicycleParkingData from './data/bicycle-parking.json';
import userSubmittedData from './data/user-submitted.json';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// Merge both data sources, mark user-submitted spots
const allParkingData = [
  ...bicycleParkingData,
  ...userSubmittedData.map(spot => ({ ...spot, isUserSubmitted: true }))
];

function App() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [flyTo, setFlyTo] = useState(null);
  const { location: userLocation, loading: locating, getCurrentLocation } = useGeolocation();

  const filteredData = useFilteredData(allParkingData, filters);

  const handleSearch = (location) => {
    setFlyTo({ ...location, timestamp: Date.now() });
  };

  const handleLocate = () => {
    getCurrentLocation();
  };

  return (
    <div className="h-full w-full relative">
      {/* Map */}
      <Map
        data={filteredData}
        mapboxToken={MAPBOX_TOKEN}
        flyTo={flyTo}
        userLocation={userLocation}
      />

      {/* Search Bar - Floating at top */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-center">
        <SearchBar onSelect={handleSearch} mapboxToken={MAPBOX_TOKEN} />
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-4 right-4 z-10 flex items-end justify-between pointer-events-none">
        {/* Filter Button */}
        <div className="pointer-events-auto">
          <FilterSheet
            filters={filters}
            onChange={setFilters}
            resultCount={filteredData.length}
          />
        </div>

        {/* Locate Button */}
        <div className="pointer-events-auto">
          <LocateButton onClick={handleLocate} loading={locating} />
        </div>
      </div>

      {/* Results Count Badge */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-sm text-gray-600">
          {filteredData.length} parking spots
        </div>
      </div>
    </div>
  );
}

export default App;
