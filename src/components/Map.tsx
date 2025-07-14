"use client";

import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";

interface MapProps {
    center: [number, number];
    zoom: number;
    locationName: string;
}

export default function Map({ center, zoom, locationName } : MapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const markerRef = useRef<mapboxgl.Marker | null>(null);

    useEffect(() => {
        if(!mapContainerRef.current) return;
        mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/streets-v11",
            center: center,
            zoom: zoom,
        });
        map.addControl(new mapboxgl.NavigationControl());
        markerRef.current = new mapboxgl.Marker()
            .setLngLat(center).setPopup(new mapboxgl.Popup().setText(locationName)).addTo(map);
        return () => {
            map.remove();
        }
    }, [center, zoom, locationName]);
    return (
        <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
    );
}