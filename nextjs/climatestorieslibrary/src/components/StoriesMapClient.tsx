"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'react-leaflet-cluster/dist/assets/MarkerCluster.css'
import 'react-leaflet-cluster/dist/assets/MarkerCluster.Default.css'
import 'leaflet/dist/leaflet.css'

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Story } from "@/utils/useSupabase";
import { useMemo } from "react";

const createClusterCustomIcon = function (cluster:any) {
  return new L.DivIcon({
    html: `<div class="custom-cluster-icon">${cluster.getChildCount()}</div>`,
    className: 'marker-cluster-custom',
    iconSize: L.point(40, 40, true),
  });
};

// When need to self-serve!!!:
//https://switch2osm.org/serving-tiles/
//https://www.maptiler.com/
//https://www.mapbox.com/


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

function randomiseCoord (coord:number) {
    return coord + (Math.random() * 2 - 1)* 0.5; // multiplier of 0.5 is degrees of coord variation
}

export default function StoriesMapClient({ stories }: StoriesMapClientProps) {
  // Only use stories with valid latitude and longitude
  const markers = useMemo(
    () =>
      stories
        .filter(
          (story) => {
            const lat = Number((story as any).latitude);
             const lng = Number((story as any).longitude);
            return !isNaN(lat) && !isNaN(lng);}
        )
        .map((story) => {
          const lat = Number((story as any).latitude);
          const lng = Number((story as any).longitude);
          return {
              id: story.id,
              title: story.title,
              slug: `/stories/${story.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")}`,
              coords: [randomiseCoord(lat), randomiseCoord(lng)] as [number, number],
          };
        }),
    [stories]
  );

  const center: [number, number] = [20, 0];
  const mapKey = markers.map((m) => m.id).join("-") || "empty";

  //attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
// url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  
  return (
    <div>
    <div className="w-full mb-2 rounded-lg overflow-hidden border-2 border-[rgba(140,198,63,0.3)]" style={{ minHeight: 350 }}>
        <MapContainer key={new Date().getTime()} center={center} zoom={2} style={{ height: 450, width: "100%" }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://www.stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg"
          />
        <MarkerClusterGroup chunkedLoading maxClusterRadius={5} iconCreateFunction={createClusterCustomIcon}>
          {markers.map((marker) => (
            <Marker key={marker.id} position={marker.coords}>
              <Popup>
                <Link href={marker.slug} className="text-green-700 font-semibold underline hover:opacity-80 ${suseFont.variable}">
                  {marker.title}
                </Link>
              </Popup>
            </Marker>
          ))}
          </MarkerClusterGroup>
        </MapContainer>
        
    </div>
    <div className="text-xs text-gray-500 mb-4 px-2">
        Marker locations are intentionally imprecise to protect the privacy of story contributors.
      </div>
    </div>
  );
}