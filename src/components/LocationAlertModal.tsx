import React, { useState, useEffect } from 'react';

export interface LandslideAlertData {
  city: string;
  state: string;
  riskLevel: 'HIGH' | 'CRITICAL' | 'MODERATE';
  incidentDetails: string;
  recommendedAction: string;
}

// Demo data for North-East region landslide risky cities
const NORTH_EAST_RISK_DATA: LandslideAlertData[] = [
  {
    city: 'Shillong',
    state: 'Meghalaya',
    riskLevel: 'HIGH',
    incidentDetails: 'Monsoon heavy rain leading to active slope movements along NH-6.',
    recommendedAction: 'Avoid night travel on hill slopes and stay updated via local bulletins.',
  },
  {
    city: 'Gangtok',
    state: 'Sikkim',
    riskLevel: 'CRITICAL',
    incidentDetails: 'Severe mudslides reported on Gangtok-Nathula route following heavy downpours.',
    recommendedAction: 'Keep emergency supplies ready and monitor official weather alerts.',
  },
  {
    city: 'Aizawl',
    state: 'Mizoram',
    riskLevel: 'HIGH',
    incidentDetails: 'Soil erosion and minor land slips detected along steep residential slopes.',
    recommendedAction: 'Inspect household drainage channels and stay clear of unstable terrain.',
  },
  {
    city: 'Kohima',
    state: 'Nagaland',
    riskLevel: 'MODERATE',
    incidentDetails: 'Saturated soil conditions near highway stretches; potential slide zones active.',
    recommendedAction: 'Exercise caution while driving through bypass routes.',
  },
];

interface Props {
  onAccessGranted: (userCoords: { lat: number; lon: number }) => void;
}

export const LocationAlertModal: React.FC<Props> = ({ onAccessGranted }) => {
  const [step, setStep] = useState<'requesting' | 'showAlert'>('requesting');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  const requestLocation = () => {
    setErrorMsg(null);
    if (!navigator.geolocation) {
      setErrorMsg('Geolocation is not supported by your browser. Please switch browsers to continue.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userCoords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        setCoords(userCoords);
        setStep('showAlert'); // Advance to landslide warning step
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMsg('Location permission is required to access this application. Please allow location access in your browser settings.');
        } else {
          setErrorMsg('Unable to fetch location. Please check your GPS and try again.');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    const init = async () => {
      await requestLocation();
    };
    init();
  }, []);

  const handleAlertAcknowledge = () => {
    if (coords) {
      onAccessGranted(coords);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative">
        {step === 'requesting' ? (
          /* Step 1: Permission Prompt UI */
          <div className="text-center space-y-4 py-6">
            <div className="text-4xl">📍</div>
            <h2 className="text-2xl font-bold">Location Permission Required</h2>
            <p className="text-slate-300 max-w-md mx-auto">
              This portal provides real-time landslide risk warnings and weather monitoring. You must allow location access to continue.
            </p>
            {errorMsg && (
              <div className="bg-red-950/60 border border-red-500 text-red-300 p-3 rounded-lg text-sm">
                {errorMsg}
              </div>
            )}
            <button
              onClick={requestLocation}
              className="mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition"
            >
              Grant Location Access
            </button>
          </div>
        ) : (
          /* Step 2: Landslide Risk Alert UI */
          <div className="space-y-5">
            <div className="flex items-center space-x-3 text-amber-400">
              <span className="text-3xl">⚠️</span>
              <div>
                <h2 className="text-2xl font-bold text-white">Landslide Advisory Alert</h2>
                <p className="text-xs text-amber-400/90 uppercase tracking-wider font-semibold">
                  North-East India Regional Safety Bulletin
                </p>
              </div>
            </div>

            <div className="bg-amber-950/30 border border-amber-500/40 text-amber-200 text-sm p-3 rounded-xl">
              📍 <strong>Location Detected:</strong> Lat: {coords?.lat.toFixed(2)}, Lon: {coords?.lon.toFixed(2)}
              <br />
              <span className="text-slate-300">
                Below is the current high-risk landslide alert bulletin for key zones in the North-East region:
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3 pr-2 border-y border-slate-800 py-3">
              {NORTH_EAST_RISK_DATA.map((item, idx) => (
                <div key={idx} className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-slate-100">
                      {item.city}, {item.state}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-bold ${
                        item.riskLevel === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : item.riskLevel === 'HIGH'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                      }`}
                    >
                      {item.riskLevel} RISK
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mb-1">{item.incidentDetails}</p>
                  <p className="text-xs text-slate-400">
                    <span className="text-amber-400/80 font-medium">Action: </span>
                    {item.recommendedAction}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleAlertAcknowledge}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition shadow-lg shadow-emerald-900/30"
              >
                I Understand / Continue to Website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};