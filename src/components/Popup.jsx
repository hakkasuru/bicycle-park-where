import { Popup as MapPopup } from 'react-map-gl';
import { RACK_TYPE_LABELS } from '../hooks/useFilteredData';

export function Popup({ spot, onClose }) {
  if (!spot) return null;

  const rackTypeLabel = RACK_TYPE_LABELS[spot.RackType] || spot.RackType;

  return (
    <MapPopup
      latitude={spot.Latitude}
      longitude={spot.Longitude}
      onClose={onClose}
      closeButton={true}
      closeOnClick={false}
      anchor="bottom"
      offset={[0, -10]}
    >
      <div className="p-2 min-w-48 max-w-64">
        <h3 className="font-semibold text-gray-900 text-sm mb-2 leading-tight pr-5">
          {spot.Description}
        </h3>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Type:</span>
            <span className="font-medium text-gray-900">{rackTypeLabel}</span>
          </div>
          <div className="flex justify-between">
            <span>Capacity:</span>
            <span className="font-medium text-gray-900">{spot.RackCount} lots</span>
          </div>
          <div className="flex justify-between">
            <span>Shelter:</span>
            <span className={`font-medium ${spot.ShelterIndicator === 'Y' ? 'text-green-600' : 'text-gray-500'}`}>
              {spot.ShelterIndicator === 'Y' ? 'Yes' : 'No'}
            </span>
          </div>
          {spot.Notes && (
            <div className="pt-2 mt-2 border-t border-gray-100">
              <span className="text-gray-500 italic">{spot.Notes}</span>
            </div>
          )}
        </div>
      </div>
    </MapPopup>
  );
}
