import { MapMarker } from './types';
import { normalizeMapName } from './map-name-fixes';

// In reality, this file could take a highly unstructured object and output robust markers
export function normalizeToMapMarker(item: any): MapMarker {
  return {
    id: item.id || `marker-${Math.random()}`,
    name: normalizeMapName(item.name || item.region || item.location || 'Desconhecido'),
    lat: item.lat || item.latitude || 0,
    lng: item.lng || item.longitude || 0,
    count: item.count || item.total || item.amount || 0,
    status: item.status || 'stable',
    // additional payload can be kept
    ...item
  };
}
