"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getLocations, type LocationRecord } from '@/src/services/locations';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.2/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.2/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.2/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export function LocationMap() {
  const [items, setItems] = useState<LocationRecord[]>([]);

  useEffect(() => {
    async function load() {
      const data = await getLocations();
      setItems(data);
    }

    load();
  }, []);

  const validItems = items.filter((item) => typeof item.latitude === 'number' && typeof item.longitude === 'number');

  return (
    <MapContainer center={[-23.55052, -46.633308]} zoom={13} className="h-[320px] w-full rounded-2xl">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {validItems.map((item) => (
        <Marker key={item.id} position={[Number(item.latitude), Number(item.longitude)]} icon={icon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">{item.name}</p>
              <p>{item.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
