import { useState } from 'react';

export function InfoSheet() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Info Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="bg-white rounded-full w-11 h-11 shadow-lg flex items-center justify-center hover:bg-gray-50 active:bg-gray-100 transition-colors"
        aria-label="About this app"
      >
        <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
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
            <h2 className="text-lg font-semibold text-gray-900">About</h2>
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
          <div className="px-6 py-5 space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">Bicycle Park Where?</h3>
              <p className="text-gray-600 text-sm mt-1">
                Find bicycle parking locations across Singapore.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span className="text-gray-700">Official (sheltered)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-blue-500" />
                <span className="text-gray-700">Official (unsheltered)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-orange-500" />
                <span className="text-gray-700">User-submitted (sheltered)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-orange-500" />
                <span className="text-gray-700">User-submitted (unsheltered)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <h4 className="font-medium text-gray-900 text-sm">Know a spot?</h4>
              <p className="text-xs text-gray-500 mt-1">
                Contribute by adding to the user-submitted.json file on GitHub.
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Data from LTA DataMall. Updated February 2026.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <a
              href="https://github.com/hakkasuru/bicycle-park-where"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 active:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
