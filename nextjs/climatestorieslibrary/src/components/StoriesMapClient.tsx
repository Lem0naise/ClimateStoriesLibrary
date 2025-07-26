"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Story } from "@/utils/useSupabase";
import { useMemo } from "react";

// Default marker icon fix for leaflet in React
if (typeof window !== "undefined") {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

interface StoriesMapClientProps {
  stories: Story[];
}

export default function StoriesMapClient({ stories }: StoriesMapClientProps) {
  // Only use stories with valid latitude and longitude
  const markers = useMemo(
    () =>
      stories
        .filter(
          (story) =>
            typeof (story as any).latitude === "number" &&
            typeof (story as any).longitude === "number"
        )
        .map((story) => ({
          id: story.id,
          title: story.title,
          slug: `/stories/${story.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`,
          coords: [(story as any).latitude, (story as any).longitude] as [number, number],
        })),
    [stories]
  );

  const center: [number, number] = [20, 0];
  const mapKey = markers.map((m) => m.id).join("-") || "empty";

  return (
    <div className="w-full mb-8 rounded-lg overflow-hidden border-2 border-[rgba(140,198,63,0.3)]" style={{ minHeight: 350 }}>
      {markers.length === 0 ? (
        <div className="absolute left-0 right-0 top-0 bottom-0 flex items-center justify-center bg-white bg-opacity-70 z-10" style={{ minHeight: 350 }}>
          <span className="text-green-700 font-semibold">No stories with map locations.</span>
        </div>
      ) : (
        <MapContainer key={mapKey} center={center} zoom={2} style={{ height: 350, width: "100%" }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker.coords}>
              <Popup>
                <Link href={marker.slug} className="text-green-700 font-semibold underline hover:opacity-80">
                  {marker.title}
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
}
// ...existing code...
