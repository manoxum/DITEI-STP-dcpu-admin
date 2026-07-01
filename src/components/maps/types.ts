export type MapMarker = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  count?: number;
  infractions?: number;
  status?: "critical" | "warning" | "stable" | "high" | "medium" | "low" | string;
  operators?: number;
  topInfraction?: string;
  trend?: string;
  [key: string]: unknown;
};

export type MapProviderType = 'osm' | 'carto' | 'satellite' | 'simple';
