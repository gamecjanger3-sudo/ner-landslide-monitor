const BASE_URL = 'https://sih-ps-01.onrender.com';

export interface ReportData {
  title: string;
  location: string;
  category: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reporterName?: string;
  reporterContact?: string;
  latitude?: number;
  longitude?: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  attachments?: File[];
}

export interface SavedReport extends Omit<ReportData, 'attachments'> {
  _id?: string;
  id?: string;
  createdAt?: string;
}

// 1. Send report to Render backend
export const submitLandslideReport = async (data: ReportData) => {
  try {
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('location', data.location);
    formData.append('category', data.category);
    formData.append('severity', data.severity);
    formData.append('description', data.description);

    if (data.reporterName) formData.append('reporterName', data.reporterName);
    if (data.reporterContact) formData.append('reporterContact', data.reporterContact);
    
    if (data.latitude !== undefined) formData.append('latitude', String(data.latitude));
    if (data.longitude !== undefined) formData.append('longitude', String(data.longitude));

    if (data.attachments && data.attachments.length > 0) {
      data.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    const response = await fetch(`${BASE_URL}/api/reports`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting report to Render backend:', error);
    throw error;
  }
};

// 2. Fetch all reports directly from Render backend
export const getLandslideReports = async (): Promise<SavedReport[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api/reports`);
    if (!response.ok) {
      throw new Error(`Failed to fetch reports: ${response.status}`);
    }
    const data = await response.json();

    return Array.isArray(data) ? data : data.reports || [];
  } catch (error) {
    console.error('Error fetching reports from Render backend:', error);
    return [];
  }
};