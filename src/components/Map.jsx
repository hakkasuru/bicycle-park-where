import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import ReactMapGL, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import { Popup } from './Popup';
import 'mapbox-gl/dist/mapbox-gl.css';

const SINGAPORE_CENTER = {
  latitude: 1.3521,
  longitude: 103.8198,
  zoom: 12,
};

// Convert parking data to GeoJSON
function toGeoJSON(data) {
  return {
    type: 'FeatureCollection',
    features: data.map((spot, index) => ({
      type: 'Feature',
      id: index,
      geometry: {
        type: 'Point',
        coordinates: [spot.Longitude, spot.Latitude],
      },
      properties: {
        ...spot,
        index,
      },
    })),
  };
}

// Cluster layer - circles for clustered points
const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'parking',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': ['step', ['get', 'point_count'], '#3b82f6', 50, '#2563eb', 200, '#1d4ed8'],
    'circle-radius': ['step', ['get', 'point_count'], 20, 50, 25, 200, 30],
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff',
  },
};

// Cluster count label
const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'parking',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
  },
  paint: {
    'text-color': '#ffffff',
  },
};

// Individual point layer - sheltered (blue filled)
const shelteredPointLayer = {
  id: 'sheltered-point',
  type: 'circle',
  source: 'parking',
  filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'ShelterIndicator'], 'Y'], ['!=', ['get', 'isUserSubmitted'], true]],
  paint: {
    'circle-color': '#3b82f6',
    'circle-radius': 8,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff',
  },
};

// Individual point layer - unsheltered (white with blue border)
const unshelteredPointLayer = {
  id: 'unsheltered-point',
  type: 'circle',
  source: 'parking',
  filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'ShelterIndicator'], 'N'], ['!=', ['get', 'isUserSubmitted'], true]],
  paint: {
    'circle-color': '#fff',
    'circle-radius': 8,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#3b82f6',
  },
};

// User-submitted spots - sheltered (orange filled)
const userSubmittedShelteredLayer = {
  id: 'user-submitted-sheltered',
  type: 'circle',
  source: 'parking',
  filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'isUserSubmitted'], true], ['==', ['get', 'ShelterIndicator'], 'Y']],
  paint: {
    'circle-color': '#f97316',
    'circle-radius': 9,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff',
  },
};

// User-submitted spots - unsheltered (white with orange border)
const userSubmittedUnshelteredLayer = {
  id: 'user-submitted-unsheltered',
  type: 'circle',
  source: 'parking',
  filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'isUserSubmitted'], true], ['==', ['get', 'ShelterIndicator'], 'N']],
  paint: {
    'circle-color': '#fff',
    'circle-radius': 9,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#f97316',
  },
};

export function Map({ data, mapboxToken, flyTo, userLocation }) {
  const mapRef = useRef(null);
  const [viewState, setViewState] = useState(SINGAPORE_CENTER);
  const [selectedSpot, setSelectedSpot] = useState(null);
  const [cursor, setCursor] = useState('grab');

  // Memoize GeoJSON to prevent recalculation on every render
  const geojson = useMemo(() => toGeoJSON(data), [data]);

  // Fly to location when flyTo changes
  useEffect(() => {
    if (flyTo && mapRef.current) {
      mapRef.current.flyTo({
        center: [flyTo.longitude, flyTo.latitude],
        zoom: flyTo.zoom || 16,
        duration: 1500,
      });
    }
  }, [flyTo]);

  // Fly to user location
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [userLocation.longitude, userLocation.latitude],
        zoom: 16,
        duration: 1500,
      });
    }
  }, [userLocation]);

  const onClick = useCallback((event) => {
    const map = mapRef.current;
    if (!map) return;

    const features = event.features;
    if (!features || features.length === 0) {
      setSelectedSpot(null);
      return;
    }

    const feature = features[0];

    // Handle cluster click - zoom in
    if (feature.properties.cluster) {
      const clusterId = feature.properties.cluster_id;
      const source = map.getSource('parking');

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: zoom + 1,
          duration: 500,
        });
      });
      return;
    }

    // Handle individual point click - show popup
    const spot = {
      Description: feature.properties.Description,
      Latitude: feature.geometry.coordinates[1],
      Longitude: feature.geometry.coordinates[0],
      RackType: feature.properties.RackType,
      RackCount: feature.properties.RackCount,
      ShelterIndicator: feature.properties.ShelterIndicator,
      Notes: feature.properties.Notes || null,
      isUserSubmitted: feature.properties.isUserSubmitted || false,
    };
    setSelectedSpot(spot);
  }, []);

  const onMouseEnter = useCallback(() => setCursor('pointer'), []);
  const onMouseLeave = useCallback(() => setCursor('grab'), []);

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <p className="text-gray-600 mb-2">Mapbox token not configured</p>
          <p className="text-sm text-gray-400">
            Add VITE_MAPBOX_TOKEN to your .env file
          </p>
        </div>
      </div>
    );
  }

  return (
    <ReactMapGL
      ref={mapRef}
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      interactiveLayerIds={['clusters', 'sheltered-point', 'unsheltered-point', 'user-submitted-sheltered', 'user-submitted-unsheltered']}
      cursor={cursor}
      style={{ width: '100%', height: '100%' }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={mapboxToken}
      attributionControl={false}
    >
      <NavigationControl position="bottom-right" showCompass={false} />

      {/* Clustered parking data */}
      <Source
        id="parking"
        type="geojson"
        data={geojson}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
        <Layer {...shelteredPointLayer} />
        <Layer {...unshelteredPointLayer} />
        <Layer {...userSubmittedShelteredLayer} />
        <Layer {...userSubmittedUnshelteredLayer} />
      </Source>

      {/* User location marker */}
      {userLocation && (
        <Marker
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
          anchor="center"
        >
          <div className="relative">
            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
            <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
          </div>
        </Marker>
      )}

      {/* Popup */}
      {selectedSpot && (
        <Popup spot={selectedSpot} onClose={() => setSelectedSpot(null)} />
      )}
    </ReactMapGL>
  );
}
