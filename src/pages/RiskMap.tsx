import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from 'react-leaflet'

function RiskMap() {
  // Demo risk data
  // Later, this will come from your backend API.
  const riskLocations = [
    {
      name: 'East Khasi Hills',
      position: [25.537, 91.299] as [number, number],
      risk: 92,
      status: 'Critical',
      rainfall: '145 mm',
      soilMoisture: '82%',
      slope: '38°',
    },
    {
      name: 'Aizawl',
      position: [23.727, 92.717] as [number, number],
      risk: 78,
      status: 'High',
      rainfall: '118 mm',
      soilMoisture: '74%',
      slope: '35°',
    },
    {
      name: 'Gangtok',
      position: [27.338, 88.606] as [number, number],
      risk: 54,
      status: 'Moderate',
      rainfall: '86 mm',
      soilMoisture: '61%',
      slope: '29°',
    },
    {
      name: 'Dima Hasao',
      position: [25.5, 93.0] as [number, number],
      risk: 41,
      status: 'Moderate',
      rainfall: '72 mm',
      soilMoisture: '57%',
      slope: '27°',
    },
    {
      name: 'Tawang',
      position: [27.586, 91.865] as [number, number],
      risk: 25,
      status: 'Low',
      rainfall: '35 mm',
      soilMoisture: '38%',
      slope: '19°',
    },
  ]

  // Center of the North Eastern Region
  const mapCenter = [25.5, 91.5] as [number, number]

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Risk Map
        </h1>

        <p className="mt-1 text-slate-500">
          Geographic visualization of landslide risk across the North Eastern Region.
        </p>
      </div>


      {/* Risk Legend */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">

        <div className="flex flex-wrap items-center gap-6">

          <span className="font-semibold text-slate-700">
            Risk Level:
          </span>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500"></span>
            <span className="text-sm text-slate-600">
              Critical
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span className="text-sm text-slate-600">
              High
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
            <span className="text-sm text-slate-600">
              Moderate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-500"></span>
            <span className="text-sm text-slate-600">
              Low
            </span>
          </div>

        </div>

      </div>


      {/* Map */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <MapContainer
          center={mapCenter}
          zoom={6}
          scrollWheelZoom={true}
          className="h-[650px] w-full"
        >

          {/* OpenStreetMap */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
          />


          {/* Risk Markers */}
          {riskLocations.map((location) => {

            let markerColor = 'green'

            if (location.risk >= 80) {
              markerColor = 'red'
            } else if (location.risk >= 60) {
              markerColor = 'orange'
            } else if (location.risk >= 40) {
              markerColor = 'gold'
            }

            return (
              <CircleMarker
                key={location.name}
                center={location.position}
                radius={10}
                pathOptions={{
                  color: markerColor,
                  fillColor: markerColor,
                  fillOpacity: 0.7,
                }}
              >

                {/* Marker Popup */}
                <Popup>

                  <div className="min-w-[190px]">

                    <h3 className="font-bold text-base text-slate-900">
                      {location.name}
                    </h3>

                    <div className="mt-2 space-y-1 text-sm text-slate-700">

                      <p>
                        <strong>Risk:</strong> {location.risk}%
                      </p>

                      <p>
                        <strong>Status:</strong> {location.status}
                      </p>

                      <p>
                        <strong>Rainfall:</strong> {location.rainfall}
                      </p>

                      <p>
                        <strong>Soil Moisture:</strong> {location.soilMoisture}
                      </p>

                      <p>
                        <strong>Slope:</strong> {location.slope}
                      </p>

                    </div>

                  </div>

                </Popup>

              </CircleMarker>
            )
          })}

        </MapContainer>

      </div>

    </div>
  )
}

export default RiskMap