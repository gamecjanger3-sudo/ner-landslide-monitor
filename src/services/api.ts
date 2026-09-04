const BASE_URL = 'https://sih-ps-01.onrender.com';

export interface ReportData {
  title: string;
  location: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  reporterName?: string;
  reporterContact?: string;
  latitude?: number;
  longitude?: number;
  attachments?: File[];
}

export const submitLandslideReport = async (data: ReportData) => {
  const formData = new FormData();

  // Append text fields expected by backend
  formData.append('title', data.title.trim());
  formData.append('location', data.location.trim());
  formData.append('category', data.category);
  formData.append('severity', data.severity);
  formData.append('description', data.description.trim());

  if (data.reporterName && data.reporterName.trim() !== '') {
    formData.append('reporterName', data.reporterName.trim());
  }

  if (data.reporterContact && data.reporterContact.trim() !== '') {
    formData.append('reporterContact', data.reporterContact.trim());
  }

  // Only append coordinates if they are valid numbers
  if (data.latitude !== undefined && !isNaN(data.latitude)) {
    formData.append('latitude', data.latitude.toString());
  }

  if (data.longitude !== undefined && !isNaN(data.longitude)) {
    formData.append('longitude', data.longitude.toString());
  }

  // Append files under the 'attachments' key expected by Multer
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file) => {
      formData.append('attachments', file);
    });
  }

  const response = await fetch(`${BASE_URL}/api/reports`, {
    method: 'POST',
    // Do NOT set 'Content-Type' header here; browser auto-sets boundary for FormData
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server responded with status ${response.status}`);
  }

  return await response.json();
};

export const fetchReportsApi = async () => {
  const response = await fetch(`${BASE_URL}/api/reports`);
  if (!response.ok) {
    throw new Error(`Server responded with status ${response.status}`);
  }
  return await response.json();
};