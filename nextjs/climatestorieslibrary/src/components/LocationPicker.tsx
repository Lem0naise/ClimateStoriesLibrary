import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { useState } from "react";

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

function DraggableMarker({ lat, lng, onChange }: LocationPickerProps) {
  const [position, setPosition] = useState<[number, number]>(lat && lng ? [lat, lng] : [20, 0]);

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      onChange(e.latlng.lat, e.latlng.lng);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition([pos.lat, pos.lng]);
          onChange(pos.lat, pos.lng);
        },
      }}
    />
  );
}

export default function LocationPicker({ lat, lng, onChange }: LocationPickerProps) {
  const center: [number, number] =
    typeof lat === 'number' && typeof lng === 'number' ? [lat, lng] : [20, 0];
  return (
    <div
      className="relative rounded-lg overflow-hidden border border-[rgba(140,198,63,0.3)]"
      style={{ height: 220, width: "100%", maxWidth: 400, marginBottom: 16 }}
    >
      <MapContainer
        center={center}
        zoom={typeof lat === 'number' && typeof lng === 'number' ? 5 : 2}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
        className="rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <DraggableMarker lat={lat} lng={lng} onChange={onChange} />
      </MapContainer>
    </div>
  );
}
