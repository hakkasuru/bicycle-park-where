import { useState } from 'react';
import { RACK_TYPE_LABELS, DEFAULT_FILTERS } from '../hooks/useFilteredData';

export function FilterSheet({ filters, onChange, resultCount }) {
  const [isOpen, setIsOpen] = useState(false);

  const hasActiveFilters =
    filters.shelterOnly ||
    filters.rackTypes.length > 0 ||
    filters.minCapacity > 0;

  const toggleRackType = (type) => {
    const newTypes = filters.rackTypes.includes(type)
      ? filters.rackTypes.filter((t) => t !== type)
      : [...filters.rackTypes, type];
    onChange({ ...filters, rackTypes: newTypes });
  };

  const clearFilters = () => {
    onChange(DEFAULT_FILTERS);
  };

  return (
    <>
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-colors ${
          hasActiveFilters
            ? 'bg-blue-500 text-white'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
        <span className="font-medium">Filters</span>
        {hasActiveFilters && (
          <span className="bg-white text-blue-500 text-xs font-bold px-1.5 py-0.5 rounded-full">
            {(filters.shelterOnly ? 1 : 0) +
             (filters.rackTypes.length > 0 ? 1 : 0) +
             (filters.minCapacity > 0 ? 1 : 0)}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Bottom Sheet */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-y-auto">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <div className="flex items-center gap-4">
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-500 font-medium"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-6">
            {/* Shelter Toggle */}
            <div>
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Sheltered only</div>
                  <div className="text-sm text-gray-500">Show only covered parking</div>
                </div>
                <div
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    filters.shelterOnly ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => onChange({ ...filters, shelterOnly: !filters.shelterOnly })}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      filters.shelterOnly ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
              </label>
            </div>

            {/* Rack Type Filter */}
            <div>
              <div className="font-medium text-gray-900 mb-3">Location type</div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(RACK_TYPE_LABELS).map(([type, label]) => (
                  <button
                    key={type}
                    onClick={() => toggleRackType(type)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      filters.rackTypes.includes(type)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Capacity Slider */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <div className="font-medium text-gray-900">Minimum capacity</div>
                <div className="text-sm font-medium text-blue-500">
                  {filters.minCapacity > 0 ? `${filters.minCapacity}+ lots` : 'Any'}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="5"
                value={filters.minCapacity}
                onChange={(e) => onChange({ ...filters, minCapacity: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Any</span>
                <span>50+</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 active:bg-blue-700 transition-colors"
            >
              Show {resultCount} results
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
