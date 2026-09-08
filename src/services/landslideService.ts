export interface LandslideIncident {
  id: string;
  event_title: string;
  location_description: string;
  event_date: string;
  landslide_category: string;
  latitude: number;
  longitude: number;
}

export interface RiskSummary {
  critical: number;
  high: number;
  moderate: number;
  low: number;
}

export interface RiskTrendPoint {
  day: string;
  risk: number;
}

export interface LandslideAlert {
  id: string;
  location: string;
  description: string;
  riskPercentage: number;
  severity: "Critical" | "High" | "Moderate" | "Low";
}

/**
 * Original NASA Landslide Fetch Function with Fallbacks
 */
export const fetchIndiaLandslides = async (): Promise<LandslideIncident[]> => {
  try {
    const url = "https://data.nasa.gov/resource/3km5-25wd.json?$where=country_name='India'&$limit=15&$order=event_date DESC";
    const response = await fetch(url);
    
    if (!response.ok) throw new Error("Failed to fetch NASA landslide data");
    
    const data = await response.json();
    return data.map((item: any) => ({
      id: item.event_id || Math.random().toString(),
      event_title: item.event_title || item.landslide_category || "Recorded Landslide Event",
      location_description: item.location_description || "North-East Corridor",
      event_date: item.event_date ? new Date(item.event_date).toLocaleDateString() : "Recent",
      landslide_category: item.landslide_category || "Slope Movement",
      latitude: parseFloat(item.latitude) || 25.5788,
      longitude: parseFloat(item.longitude) || 91.8933,
    }));
  } catch (error) {
    console.warn("NASA API unavailable, using regional fallback data.", error);
    return [
      {
        id: "ne-1",
        event_title: "NH-6 Active Slope Failure",
        location_description: "Shillong-Jowai Stretch, Meghalaya",
        event_date: "Active Alert",
        landslide_category: "Mudslide",
        latitude: 25.5788,
        longitude: 91.8933,
      },
      {
        id: "ne-2",
        event_title: "Nathula Highway Debris Flow",
        location_description: "Gangtok-Nathula Pass Corridor, Sikkim",
        event_date: "Active Alert",
        landslide_category: "Rockfall",
        latitude: 27.3389,
        longitude: 88.6065,
      },
      {
        id: "ne-3",
        event_title: "Aizawl Steep Terrain Subsidence",
        location_description: "Aizawl Bypass Road, Mizoram",
        event_date: "Monsoon Watch",
        landslide_category: "Soil Creep",
        latitude: 23.7271,
        longitude: 92.7176,
      },
    ];
  }
};

/**
 * Fetch Risk Summary Counts for Dashboard Top Cards
 */
export const fetchLandslideRiskSummary = async (): Promise<RiskSummary> => {
  try {
    // Replace with real backend endpoint when available
    // e.g., const res = await fetch(`${API_BASE_URL}/api/landslide/summary`);
    return {
      critical: 12,
      high: 24,
      moderate: 38,
      low: 156,
    };
  } catch (error) {
    console.warn("Failed to fetch risk summary, using fallbacks.", error);
    return { critical: 12, high: 24, moderate: 38, low: 156 };
  }
};

/**
 * Fetch 7-day Risk Trend Data for Recharts Line Chart
 */
export const fetchLandslideRiskTrend = async (): Promise<RiskTrendPoint[]> => {
  try {
    // Replace with real backend endpoint when available
    // e.g., const res = await fetch(`${API_BASE_URL}/api/landslide/trend`);
    return [
      { day: "Mon", risk: 42 },
      { day: "Tue", risk: 48 },
      { day: "Wed", risk: 55 },
      { day: "Thu", risk: 51 },
      { day: "Fri", risk: 68 },
      { day: "Sat", risk: 74 },
      { day: "Sun", risk: 82 },
    ];
  } catch (error) {
    console.warn("Failed to fetch risk trend, using fallbacks.", error);
    return [];
  }
};

/**
 * Fetch Recent Alerts List for Dashboard Bottom Section
 */
export const fetchRecentLandslideAlerts = async (): Promise<LandslideAlert[]> => {
  try {
    // Option A: Transform NASA live incident data into alert format
    const incidents = await fetchIndiaLandslides();
    if (incidents && incidents.length > 0) {
      return incidents.slice(0, 3).map((item, index) => {
        const riskPercentages = [92, 78, 54];
        const severities: ("Critical" | "High" | "Moderate")[] = ["Critical", "High", "Moderate"];
        
        return {
          id: item.id,
          location: item.location_description,
          description: `${item.event_title} (${item.landslide_category})`,
          riskPercentage: riskPercentages[index % 3],
          severity: severities[index % 3],
        };
      });
    }

    throw new Error("No live incidents returned");
  } catch (error) {
    console.warn("Using fallback alert data.", error);
    return [
      {
        id: "alert-1",
        location: "East Khasi Hills",
        description: "Heavy rainfall and high soil moisture detected",
        riskPercentage: 92,
        severity: "Critical",
      },
      {
        id: "alert-2",
        location: "Aizawl",
        description: "Increased rainfall detected in vulnerable zone",
        riskPercentage: 78,
        severity: "High",
      },
      {
        id: "alert-3",
        location: "Gangtok",
        description: "Moderate environmental risk detected",
        riskPercentage: 54,
        severity: "Moderate",
      },
    ];
  }
};