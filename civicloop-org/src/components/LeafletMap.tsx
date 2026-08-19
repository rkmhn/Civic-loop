import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { IssueCategory } from '../types';

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string | number;
    lat: number;
    lng: number;
    title: string;
    category?: IssueCategory;
    count?: number;
    severity?: 'Moderate' | 'High' | 'Critical';
    isCluster?: boolean;
    onClick?: () => void;
  }>;
  selectedMarkerId?: string | number | null;
  interactivePin?: {
    lat: number;
    lng: number;
    onMove?: (lat: number, lng: number) => void;
  } | null;
  onMapClick?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  pothole: '#f59e0b',
  streetlight: '#eab308',
  drainage: '#06b6d4',
  garbage: '#10b981',
  road_damage: '#f97316',
  traffic_signal: '#ef4444',
  water_leak: '#3b82f6',
  default: '#8b5cf6'
};

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [12.9716, 77.5946],
  zoom = 13,
  markers = [],
  selectedMarkerId,
  interactivePin,
  onMapClick,
  height = '360px',
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const interactiveMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center[0], center[1]],
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark / Sleek CartoDB or OSM TileLayer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;

      map.on('click', (e: L.LeafletMouseEvent) => {
        if (onMapClick) {
          onMapClick(Number(e.latlng.lat.toFixed(5)), Number(e.latlng.lng.toFixed(5)));
        }
      });

      mapInstanceRef.current = map;
    }

    return () => {
      // Cleanup on unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update center when changed significantly
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      const currentCenter = mapInstanceRef.current.getCenter();
      const dist = Math.abs(currentCenter.lat - center[0]) + Math.abs(currentCenter.lng - center[1]);
      if (dist > 0.01) {
        mapInstanceRef.current.panTo(center, { animate: true });
      }
    }
  }, [center[0], center[1]]);

  // Render Markers and Clusters
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    markers.forEach(marker => {
      const color = marker.category ? (CATEGORY_COLORS[marker.category] || CATEGORY_COLORS.default) : '#06b6d4';
      const isSelected = selectedMarkerId === marker.id;

      let iconHtml = '';

      if (marker.isCluster) {
        // High-visibility cluster icon with glowing radar waves (Part 8)
        const size = marker.count && marker.count >= 5 ? 44 : 36;
        const pulseColor = marker.severity === 'Critical' ? '#ef4444' : marker.severity === 'High' ? '#f59e0b' : '#06b6d4';
        
        iconHtml = `
          <div style="position: relative; width: ${size}px; height: ${size}px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; inset: -4px; border-radius: 9999px; background: ${pulseColor}; opacity: 0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: ${size}px; height: ${size}px; border-radius: 9999px; background: ${pulseColor}; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: ${size > 36 ? '15px' : '13px'}; cursor: pointer;">
              ${marker.count || '!'}
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-cluster-icon',
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2]
        });

        const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon });
        leafletMarker.bindTooltip(`<b>${marker.title}</b><br/>${marker.count} reports clustered`, {
          direction: 'top',
          offset: [0, -size / 2],
          className: 'glass-tooltip'
        });

        if (marker.onClick) {
          leafletMarker.on('click', () => marker.onClick!());
        }

        markersLayerRef.current?.addLayer(leafletMarker);
      } else {
        // Standard individual complaint marker
        const markerSize = isSelected ? 34 : 26;
        iconHtml = `
          <div style="position: relative; width: ${markerSize}px; height: ${markerSize}px; display: flex; align-items: center; justify-content: center;">
            ${isSelected ? `<div style="position: absolute; inset: -4px; border-radius: 9999px; border: 2px solid ${color}; opacity: 0.8; animation: ping 1.5s infinite;"></div>` : ''}
            <div style="width: ${markerSize}px; height: ${markerSize}px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: ${color}; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; cursor: pointer;">
              <div style="width: 8px; height: 8px; border-radius: 9999px; background: white; transform: rotate(45deg);"></div>
            </div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-pin-icon',
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize / 2, markerSize]
        });

        const leafletMarker = L.marker([marker.lat, marker.lng], { icon: customIcon });
        leafletMarker.bindTooltip(`<b>#${marker.id}</b> - ${marker.title}`, {
          direction: 'top',
          offset: [0, -markerSize],
          className: 'glass-tooltip'
        });

        if (marker.onClick) {
          leafletMarker.on('click', () => marker.onClick!());
        }

        markersLayerRef.current?.addLayer(leafletMarker);
      }
    });
  }, [markers, selectedMarkerId]);

  // Handle Interactive Pin for Report Form (Part 4)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (interactivePin) {
      if (!interactiveMarkerRef.current) {
        const pinIcon = L.divIcon({
          html: `
            <div style="position: relative; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; inset: -6px; border-radius: 9999px; background: #06b6d4; opacity: 0.3; animation: ping 2s infinite;"></div>
              <div style="width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background: linear-gradient(135deg, #06b6d4, #3b82f6); border: 2.5px solid white; box-shadow: 0 6px 16px rgba(6,182,212,0.6); display: flex; align-items: center; justify-content: center; cursor: grab;">
                <div style="width: 10px; height: 10px; border-radius: 9999px; background: white; transform: rotate(45deg);"></div>
              </div>
            </div>
          `,
          className: 'custom-draggable-pin',
          iconSize: [38, 38],
          iconAnchor: [19, 38]
        });

        const m = L.marker([interactivePin.lat, interactivePin.lng], {
          icon: pinIcon,
          draggable: true
        }).addTo(mapInstanceRef.current);

        m.bindPopup('<b class="text-slate-900 text-xs">📍 Incident Location Selected</b><br/><span class="text-slate-600 text-xs">Drag or click map to move</span>').openPopup();

        m.on('dragend', () => {
          const pos = m.getLatLng();
          if (interactivePin.onMove) {
            interactivePin.onMove(Number(pos.lat.toFixed(5)), Number(pos.lng.toFixed(5)));
          }
        });

        interactiveMarkerRef.current = m;
      } else {
        interactiveMarkerRef.current.setLatLng([interactivePin.lat, interactivePin.lng]);
      }
    } else {
      if (interactiveMarkerRef.current) {
        interactiveMarkerRef.current.remove();
        interactiveMarkerRef.current = null;
      }
    }
  }, [interactivePin?.lat, interactivePin?.lng]);

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-white/15 shadow-2xl ${className}`} style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
