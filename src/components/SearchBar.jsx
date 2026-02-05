import { useState, useRef, useEffect } from 'react';

const MAPBOX_GEOCODING_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';
const SINGAPORE_BBOX = [103.6, 1.15, 104.1, 1.5]; // [minLng, minLat, maxLng, maxLat]

export function SearchBar({ onSelect, mapboxToken }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || !mapboxToken) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setLoading(true);
      try {
        const bbox = SINGAPORE_BBOX.join(',');
        const url = `${MAPBOX_GEOCODING_URL}/${encodeURIComponent(query)}.json?access_token=${mapboxToken}&bbox=${bbox}&country=SG&limit=5`;
        const response = await fetch(url);
        const data = await response.json();
        setResults(data.features || []);
        setIsOpen(true);
      } catch (err) {
        console.error('Geocoding error:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, mapboxToken]);

  const handleSelect = (result) => {
    setQuery(result.place_name);
    setIsOpen(false);
    onSelect({
      longitude: result.center[0],
      latitude: result.center[1],
      zoom: 16,
    });
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Search location..."
          className="w-full pl-10 pr-10 py-3 bg-white rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
        {loading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <svg className="w-4 h-4 text-gray-400 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg overflow-hidden">
          {results.map((result) => (
            <li key={result.id}>
              <button
                onClick={() => handleSelect(result)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors border-b border-gray-100 last:border-0"
              >
                <div className="font-medium text-gray-900 text-sm truncate">
                  {result.text}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {result.place_name}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
