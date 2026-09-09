// src/services/dashboardService.ts

export interface RiskSummary {
  critical: number;
  high: number;
  moderate: number;
  low: number;
}

export interface RiskTrendItem {
  day: string;
  riskScore: number;
}

export interface AlertItem {
  id: string;
  location: string;
  description: string;
  riskLevel: string;
  riskPercentage: number;
}

// Fetch risk counts based on location
export const fetchLandslideRiskSummary = async (location: string): Promise<RiskSummary> => {
  try {
    const response = await fetch(`/api/risk-summary?location=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error('Failed to fetch summary');
    return await response.json();
  } catch (error) {
    console.error('Error fetching risk summary:', error);
    // Return flat default/zero state if location has no risks or on error
    return { critical: 0, high: 0, moderate: 0, low: 0 };
  }
};

// Fetch 7-day risk trend based on location
export const fetchLandslideRiskTrend = async (location: string): Promise<RiskTrendItem[]> => {
  try {
    const response = await fetch(`/api/risk-trend?location=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error('Failed to fetch trend');
    return await response.json();
  } catch (error) {
    console.error('Error fetching risk trend:', error);
    return [];
  }
};

// Fetch recent active alerts based on location
export const fetchRecentLandslideAlerts = async (location: string): Promise<AlertItem[]> => {
  try {
    const response = await fetch(`/api/recent-alerts?location=${encodeURIComponent(location)}`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching recent alerts:', error);
    return [];
  }
};