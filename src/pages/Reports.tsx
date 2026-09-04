import { useState, useEffect } from 'react';
import { 
  Upload, 
  MapPin, 
  Camera, 
  Video, 
  Send, 
  AlertTriangle, 
  CheckCircle, 
  Loader2,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { submitLandslideReport, type ReportData } from '../services/api';

// Helper component to trigger Leaflet re-centering on state changes
function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function Reports() {
  // Form State
  const [formData, setFormData] = useState<ReportData>({
    title: '',
    location: '',
    category: 'Landslide',
    severity: 'high',
    description: '',
    reporterName: '',
    reporterContact: '',
  });

  // Map & Media State
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);

  // Feedback & Loading State
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Position fallback for Leaflet Map
  const mapPosition: [number, number] =
    latitude && longitude
      ? [Number(latitude), Number(longitude)]
      : [25.5, 91.5];

  // Generic Field Change Handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle File Uploads (Append new files rather than overwriting)
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  // Remove individual file from attachments
  const handleRemoveFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  // Geolocation Lookup
  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage({
        type: 'error',
        text: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude.toFixed(6);
        const lng = position.coords.longitude.toFixed(6);
        setLatitude(lat);
        setLongitude(lng);

        // Auto-fill location text field if empty
        if (!formData.location) {
          setFormData((prev) => ({
            ...prev,
            location: `${lat}, ${lng}`,
          }));
        }
      },
      () => {
        setStatusMessage({
          type: 'error',
          text: 'Unable to retrieve location. Please grant location permissions.',
        });
      }
    );
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage(null);

    // Form Validations
    if (!formData.title.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter an incident title.' });
      setLoading(false);
      return;
    }

    if (!formData.description.trim()) {
      setStatusMessage({ type: 'error', text: 'Please describe what you observed.' });
      setLoading(false);
      return;
    }

    const lat = latitude.trim() !== '' ? Number(latitude) : undefined;
    const lng = longitude.trim() !== '' ? Number(longitude) : undefined;

    if (lat !== undefined && (Number.isNaN(lat) || lat < -90 || lat > 90)) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid latitude between -90 and 90.' });
      setLoading(false);
      return;
    }

    if (lng !== undefined && (Number.isNaN(lng) || lng < -180 || lng > 180)) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid longitude between -180 and 180.' });
      setLoading(false);
      return;
    }

    // File size validation (Max: 50MB per file)
    const maxFileSize = 50 * 1024 * 1024;
    const oversizedFile = files.find((file) => file.size > maxFileSize);
    if (oversizedFile) {
      setStatusMessage({
        type: 'error',
        text: `"${oversizedFile.name}" exceeds the 50 MB limit.`,
      });
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        latitude: lat,
        longitude: lng,
        attachments: files,
      };

      await submitLandslideReport(payload);

      setStatusMessage({
        type: 'success',
        text: 'Report successfully submitted to emergency telemetry!',
      });

      // Reset form state on successful submission
      setFormData({
        title: '',
        location: '',
        category: 'Landslide',
        severity: 'high',
        description: '',
        reporterName: '',
        reporterContact: '',
      });
      setLatitude('');
      setLongitude('');
      setFiles([]);
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to submit report. Please check server connectivity or try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Field Incident Report</h1>
        <p className="mt-1 text-slate-500">
          Report active landslides, cracks, slope failures, or road blockages directly to emergency responders.
        </p>
      </div>

      {/* Status Feedback Message */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle size={20} />
          ) : (
            <AlertTriangle size={20} />
          )}
          <span className="text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Report Meta & Description */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Incident Title *
              </label>
              <input
                type="text"
                name="title"
                required
                placeholder="e.g. Mudslide near NH-6 Highway"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Incident Type
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm bg-white"
                >
                  <option value="Landslide">Landslide</option>
                  <option value="Mudslide">Mudslide</option>
                  <option value="Rockfall">Rockfall</option>
                  <option value="Crack / Ground Movement">Crack / Ground Movement</option>
                  <option value="Road Blockage">Road Blockage</option>
                  <option value="Slope Failure">Slope Failure</option>
                  <option value="Flash Flood">Flash Flood</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Severity Level
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm bg-white"
                >
                  <option value="low">Low - Minor Debris</option>
                  <option value="medium">Medium - Partial Obstruction</option>
                  <option value="high">High - Serious Danger</option>
                  <option value="critical">Critical - Total Blockage / Threat</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Location / Landmark *
              </label>
              <input
                type="text"
                name="location"
                required
                placeholder="e.g. East Khasi Hills, Meghalaya"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Detailed Description *
              </label>
              <textarea
                name="description"
                rows={5}
                required
                placeholder="Describe soil stability, active movements, weather conditions, or immediate risks..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm resize-none"
              />
            </div>

            {/* Reporter Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  name="reporterName"
                  placeholder="John Doe"
                  value={formData.reporterName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="text"
                  name="reporterContact"
                  placeholder="+91 9876543210"
                  value={formData.reporterContact}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Map, Location Coordinates, Uploads */}
          <div className="space-y-5">
            {/* Map and Coordinates */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-700">
                  GPS Coordinates
                </label>
                <button
                  type="button"
                  onClick={getLocation}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition"
                >
                  <MapPin size={14} />
                  Get My Location
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                />
                <input
                  type="text"
                  placeholder="Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 outline-none text-sm"
                />
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-300">
                <MapContainer
                  center={mapPosition}
                  zoom={10}
                  scrollWheelZoom={true}
                  className="h-[200px] w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="© OpenStreetMap contributors"
                  />
                  <Marker position={mapPosition}>
                    <Popup>
                      <strong>Incident Location</strong>
                      <br />
                      Lat: {mapPosition[0].toFixed(4)}
                      <br />
                      Lng: {mapPosition[1].toFixed(4)}
                    </Popup>
                  </Marker>
                  <MapRecenter center={mapPosition} />
                </MapContainer>
              </div>
            </div>

            {/* Evidence Upload */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Media Attachments
              </label>

              <label className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition">
                <Upload size={28} className="text-slate-400" />
                <p className="mt-2 text-sm font-medium text-slate-700">Upload site photos or videos</p>
                
                <div className="flex items-center gap-4 mt-2 text-slate-400">
                  <div className="flex items-center gap-1 text-xs">
                    <Camera size={14} /> Photos
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <Video size={14} /> Videos
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Attachment Preview List with Remove Button */}
            {files.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Attached Files ({files.length})
                </p>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {files.map((file, index) => (
                    <div
                      key={`${file.name}-${file.size}-${index}`}
                      className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200"
                    >
                      <span className="text-slate-700 truncate max-w-[200px]">
                        {file.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">
                          {(file.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(index)}
                          className="text-slate-400 hover:text-red-500 transition"
                          title="Remove file"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
              <AlertTriangle size={18} className="text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-800">Safety Warning</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Do not approach active slope movements or enter hazardous zones to capture photos. Submit from a safe distance.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Submitting to Telemetry...</span>
                </>
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}