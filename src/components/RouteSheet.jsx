import { useState, useRef } from 'react';

export function RouteSheet({ gpxRoute, routeFileName, routeError, onLoad, onClear }) {
  const [isOpen, setIsOpen] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onLoad(file);
    }
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  return (
    <>
      {/* Route Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`rounded-full w-11 h-11 shadow-lg flex items-center justify-center transition-colors ${
          gpxRoute
            ? 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700'
            : 'bg-white hover:bg-gray-50 active:bg-gray-100'
        }`}
        aria-label="GPX Route"
      >
        <svg
          className={`w-5 h-5 ${gpxRoute ? 'text-white' : 'text-gray-700'}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12c0 0 2-4 5-4s4 8 7 8 5-4 5-4" />
        </svg>
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".gpx,application/gpx+xml,application/octet-stream"
        className="hidden"
        onChange={handleFileChange}
      />

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
        <div className="bg-white rounded-t-3xl shadow-2xl">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">GPX Route</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-4">
            {!gpxRoute ? (
              <>
                <div>
                  <p className="text-gray-600 text-sm">
                    Load a GPX file to overlay your cycling route on the map. GPX files can be exported from apps like Strava, Garmin Connect, or Komoot.
                  </p>
                </div>

                {routeError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-red-700 text-sm">{routeError}</p>
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Load GPX File
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-xl px-4 py-3">
                  <svg className="w-5 h-5 text-purple-500 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12c0 0 2-4 5-4s4 8 7 8 5-4 5-4" />
                  </svg>
                  <span className="text-sm text-purple-900 font-medium truncate">
                    {routeFileName || 'Route loaded'}
                  </span>
                </div>

                {routeError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <p className="text-red-700 text-sm">{routeError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors text-sm"
                  >
                    Replace Route
                  </button>
                  <button
                    onClick={() => {
                      onClear();
                      setIsOpen(false);
                    }}
                    className="flex-1 py-3 bg-red-50 text-red-700 font-semibold rounded-xl hover:bg-red-100 active:bg-red-200 transition-colors text-sm"
                  >
                    Clear Route
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
