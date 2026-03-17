import { useState } from 'react';

const VIEW_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'parking', label: 'Parking Only' },
  { value: 'route', label: 'Route Only' },
];

export function SettingsSheet({ viewMode, onViewModeChange, hasRoute }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Settings Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-full w-11 h-11 shadow-lg flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
        aria-label="Settings"
      >
        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
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
        <div className="bg-white rounded-t-3xl shadow-2xl">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
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
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Map Layers</h3>
              <div className="flex gap-2">
                {VIEW_OPTIONS.map(({ value, label }) => {
                  const isRouteOption = value === 'route';
                  const disabled = isRouteOption && !hasRoute;
                  const active = viewMode === value;

                  return (
                    <button
                      key={value}
                      onClick={() => !disabled && onViewModeChange(value)}
                      disabled={disabled}
                      className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                        active
                          ? 'bg-gray-900 text-white'
                          : disabled
                          ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {!hasRoute && (
                <p className="text-xs text-gray-400 mt-2">Load a GPX route to enable "Route Only" view.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
