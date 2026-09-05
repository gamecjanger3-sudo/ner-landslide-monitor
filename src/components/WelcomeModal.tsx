import React, { useState, useEffect } from 'react';

export const WelcomeModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedApp');
    if (!hasVisited) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasVisitedApp', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome to NER-SAFE 🚨
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
          Real-time landslide monitoring and regional safety advisories for North-East India.
        </p>

        <div className="space-y-3 text-sm text-slate-700 dark:text-slate-200 mb-6">
          <div className="flex items-start gap-3">
            <span className="bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded text-xs">1</span>
            <p><strong>Grant Location:</strong> Allows precise nearby landslide risk assessment.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-amber-100 text-amber-600 font-bold px-2 py-0.5 rounded text-xs">2</span>
            <p><strong>Check Alerts:</strong> Review active bulletins before planning travel on hill routes.</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="bg-blue-100 text-blue-600 font-bold px-2 py-0.5 rounded text-xs">3</span>
            <p><strong>Emergency Contact:</strong> Access local helpdesks and regional bulletins in the header.</p>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          I Understand / Continue to Monitor
        </button>
      </div>
    </div>
  );
};