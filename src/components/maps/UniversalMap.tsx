import { MapContainer, TileLayer, Marker, Popup, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as topojson from 'topojson-client';
import React, { useMemo } from 'react';
import { cn } from '../../lib/utils';
import stpData from '../../assets/maps/districts-stp.json';
import { normalizeMapName } from './map-name-fixes';
import { getStatusColor } from './map-colors';
import { MapMarker, MapProviderType } from './types';
import providers from './providers';

// Fix leafet default icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export type UniversalMapProps = {
  center: [number, number];
  zoom: number;
  markers?: MapMarker[];
  provider?: MapProviderType;
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
  zoomControl?: boolean;
  scrollWheelZoom?: boolean;
  children?: React.ReactNode;
};

// Component to handle Prince/Pague shift in simple mode
function SimpleModeCoordinateShift({ isSimple }: { isSimple: boolean }) {
  const map = useMap();
  // Adjust bounds or shift logic if needed for view bounding
  return null;
}

export function UniversalMap({
  center,
  zoom,
  markers = [],
  provider = 'osm',
  onMarkerClick,
  className,
  zoomControl = true,
  scrollWheelZoom = true,
  children
}: UniversalMapProps) {
  const isSimpleMode = provider === 'simple';
  const PagueShift = { lat: -0.85, lng: -0.35 };

  // Convert TopoJSON to GeoJSON
  const geojsonData = useMemo(() => {
    try {
      const geojson = topojson.feature(stpData as any, stpData.objects.STPADM2gbOpen as any);
      
      // Apply offset for Simple Mode
      if (isSimpleMode) {
        geojson.features = geojson.features.map((feature: any) => {
          const name = normalizeMapName(feature.properties.shapeName);
          if (name === 'RAP') {
            const shiftCoordinates = (coords: any[]) => {
              return coords.map((c: any) => {
                if (Array.isArray(c[0])) {
                  return shiftCoordinates(c);
                }
                return [c[0] + PagueShift.lng, c[1] + PagueShift.lat];
              });
            };
            
            return {
              ...feature,
              geometry: {
                ...feature.geometry,
                coordinates: shiftCoordinates(feature.geometry.coordinates)
              }
            };
          }
          return feature;
        });
      }
      return geojson;
    } catch (e) {
      console.error("Failed to parse map geojson", e);
      return null;
    }
  }, [isSimpleMode]);

  const tileProvider = providers[provider];

  const onEachFeature = (feature: any, layer: any) => {
    const rawName = feature.properties.shapeName;
    const name = normalizeMapName(rawName);
    
    // Simple mode always shows tooltips
    if (isSimpleMode) {
      layer.bindTooltip(name, { permanent: true, direction: "center", className: "map-label-tooltip font-bold tracking-wider text-xs bg-transparent border-none shadow-none text-slate-800 dark:text-white drop-shadow-md" });
    } else {
      layer.bindTooltip(name, { direction: "auto" });
    }

    layer.on({
      mouseover: (e: any) => {
        const lyr = e.target;
        lyr.setStyle({
          fillOpacity: isSimpleMode ? 0.9 : 0.4,
        });
      },
      mouseout: (e: any) => {
        const lyr = e.target;
        lyr.setStyle({
          fillOpacity: isSimpleMode ? 0.7 : 0.1,
        });
      }
    });
  };

  const getFeatureStyle = (feature: any) => {
    const name = normalizeMapName(feature.properties.shapeName);
    // Simple hash for color if we wanted, else standard
    return {
      color: '#ffffff',
      weight: 1.5,
      fillColor: provider === 'simple' ? '#cbd5e1' : '#3388ff',
      fillOpacity: provider === 'simple' ? 0.7 : 0.1,
    };
  };

  return (
    <div className={cn("w-full h-full relative isolate z-0 bg-slate-100 dark:bg-slate-900", className)}>
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ width: '100%', height: '100%', zIndex: 1 }}
        zoomControl={zoomControl}
        scrollWheelZoom={scrollWheelZoom}
      >
        {!isSimpleMode && tileProvider && (
          <TileLayer
            attribution={tileProvider.attribution}
            url={tileProvider.url}
          />
        )}
        
        {geojsonData && (
           <GeoJSON 
             data={geojsonData as any} 
             style={getFeatureStyle}
             onEachFeature={onEachFeature}
           />
        )}

        {markers.map((marker) => {
          let posLat = marker.lat;
          let posLng = marker.lng;
          
          if (isSimpleMode) {
             const normName = normalizeMapName(marker.name);
             if (normName === 'RAP') {
               posLat += PagueShift.lat;
               posLng += PagueShift.lng;
             }
          }

          const iconHtml = `
            <div class="relative w-8 h-8 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2 cursor-pointer shadow-lg border-2 border-white transition-transform hover:scale-110" 
                 style="background-color: ${getStatusColor(marker.status)}">
              <span class="text-[10px] font-bold text-white">${marker.count || ''}</span>
            </div>
          `;

          const customIcon = L.divIcon({
            html: iconHtml,
            className: 'bg-transparent border-0',
            iconSize: [32, 32],
            iconAnchor: [16, 16] // Center
          });

          return (
            <Marker 
              key={marker.id} 
              position={[posLat, posLng]}
              icon={customIcon}
              eventHandlers={{
                click: () => onMarkerClick && onMarkerClick(marker)
              }}
            >
              <Popup className="custom-popup">
                <div className="font-sans px-1">
                  <h3 className="font-bold text-sm tracking-tight text-slate-800">{marker.name}</h3>
                  {marker.count !== undefined && (
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">Total: <span className="text-slate-700">{marker.count}</span></p>
                  )}
                  {marker.topInfraction && (
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-tight">{marker.topInfraction}</p>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
        {children}
      </MapContainer>
    </div>
  );
}
