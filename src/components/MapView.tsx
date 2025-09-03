import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapViewProps {
  center?: [number, number] | null;      
  zoom?: number;
  highlightRadiusM?: number | null;
  className?: string;
  minHeightPx?: number;
}

const isFiniteNum = (x: unknown): x is number =>
  typeof x === 'number' && Number.isFinite(x);

const isLatLng = (v: unknown): v is [number, number] =>
  Array.isArray(v) &&
  v.length === 2 &&
  isFiniteNum(Number(v[0])) &&
  isFiniteNum(Number(v[1]));

const MapView: React.FC<MapViewProps> = ({
  center,
  zoom = 13,
  highlightRadiusM = 4000,
  className,
  minHeightPx = 280,
}) => {
  // Validate inputs to avoid Leaflet’s _point.subtract crash
  const hasCenter = isLatLng(center);
  const radius = Number(highlightRadiusM);
  const hasRadius = Number.isFinite(radius) && radius > 0;

  // If center isn't ready yet, render a safe placeholder (no Leaflet components)
  if (!hasCenter) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          minHeight: minHeightPx,
          display: 'grid',
          placeItems: 'center',
          color: '#cfeeff',
        }}
      >
        Map will appear when location is available
      </div>
    );
  }

  const lat = Number(center![0]);
  const lng = Number(center![1]);
  const safeCenter = [lat, lng] as LatLngExpression;

  // Force a clean remount if the center changes significantly
  const mapKey = `${lat.toFixed(6)}-${lng.toFixed(6)}`;

  return (
    <div className={className} style={{ width: '100%', height: '100%', minHeight: minHeightPx }}>
      <MapContainer
        key={mapKey}
        center={safeCenter}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {hasRadius && (
          <Circle
            center={safeCenter}
            radius={radius}
            pathOptions={{ color: '#00BFFF', fillColor: '#00BFFF', fillOpacity: 0.2, weight: 2 }}
          />
        )}

        <CircleMarker
          center={safeCenter}
          radius={6}
          pathOptions={{ color: '#ffffff', fillColor: '#00BFFF', fillOpacity: 1, weight: 1 }}
        />
      </MapContainer>
    </div>
  );
};

export default MapView;
