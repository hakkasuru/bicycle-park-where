import { useState } from 'react';
import { gpx } from '@tmcw/togeojson';

const STORAGE_KEY_ROUTE = 'gpx-route';
const STORAGE_KEY_VIEW_MODE = 'gpx-view-mode';

function loadInitialState() {
  try {
    const storedRoute = localStorage.getItem(STORAGE_KEY_ROUTE);
    const storedViewMode = localStorage.getItem(STORAGE_KEY_VIEW_MODE);
    const gpxRoute = storedRoute ? JSON.parse(storedRoute) : null;
    let viewMode = storedViewMode || 'all';
    // Guard: can't be in route-only view with no route
    if (viewMode === 'route' && !gpxRoute) {
      viewMode = 'all';
    }
    return { gpxRoute, viewMode };
  } catch {
    return { gpxRoute: null, viewMode: 'all' };
  }
}

const { gpxRoute: initialRoute, viewMode: initialViewMode } = loadInitialState();

export function useRouteData() {
  const [gpxRoute, setGpxRoute] = useState(initialRoute);
  const [viewMode, setViewModeState] = useState(initialViewMode);
  const [routeError, setRouteError] = useState(null);
  const [routeFileName, setRouteFileName] = useState(null);

  const loadRoute = (file) => {
    setRouteError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(e.target.result, 'application/xml');
        const geojson = gpx(doc);

        const hasFeatures = geojson.features && geojson.features.length > 0;
        if (!hasFeatures) {
          setRouteError('No track or route data found in this GPX file.');
          return;
        }

        localStorage.setItem(STORAGE_KEY_ROUTE, JSON.stringify(geojson));
        setGpxRoute(geojson);
        setRouteFileName(file.name);
      } catch {
        setRouteError('Failed to parse GPX file. Please check the file is valid.');
      }
    };
    reader.onerror = () => {
      setRouteError('Failed to read the file.');
    };
    reader.readAsText(file);
  };

  const clearRoute = () => {
    localStorage.removeItem(STORAGE_KEY_ROUTE);
    setGpxRoute(null);
    setRouteFileName(null);
    setRouteError(null);
  };

  const setViewMode = (mode) => {
    localStorage.setItem(STORAGE_KEY_VIEW_MODE, mode);
    setViewModeState(mode);
  };

  return { gpxRoute, viewMode, routeError, routeFileName, loadRoute, clearRoute, setViewMode };
}
