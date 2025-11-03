"use client";
import { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string | "";

interface ProjectMarker {
  name: string;
  coordinates: [number, number];
  location: string;
}

export const projects: ProjectMarker[] = [
  {
    name: "Las Araucarias",
    coordinates: [-54.6, -27.4],
    location: "Misiones"
  },
  {
    name: "Proyecto Salta",
    coordinates: [-65.4, -24.8],
    location: "Salta"
  }
];

export interface Argentina_MapHandle {
  zoomToProject: (coordinates: [number, number]) => void;
}

const Argentina_Map = forwardRef<Argentina_MapHandle>((props, ref) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useImperativeHandle(ref, () => ({
    zoomToProject: (coordinates: [number, number]) => {
      if (mapRef.current) {
        mapRef.current.flyTo({
          center: coordinates,
          zoom: 8,
          duration: 1500,
          essential: true
        });
      }
    }
  }));

  useEffect(() => {
    if (!mapContainerRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [-60.4007112541218, -28.62565183094788],
      zoom: 4.229010989924306,
      attributionControl: false
    });

    mapRef.current = map;

    map.on('load', () => {
      
      const customMarkers: mapboxgl.Marker[] = [];

      projects.forEach((project) => {
        const markerContainer = document.createElement('div');
        markerContainer.style.display = 'flex';
        markerContainer.style.alignItems = 'center';
        markerContainer.style.gap = '8px';
        markerContainer.style.cursor = 'pointer';

        const circle = document.createElement('div');
        circle.style.width = '20px';
        circle.style.height = '20px';
        circle.style.borderRadius = '50%';
        circle.style.backgroundColor = '#539390';
        circle.style.border = '3px solid white';
        circle.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        circle.style.flexShrink = '0';

        const label = document.createElement('span');
        label.textContent = project.name;
        label.style.color = 'white';
        label.style.fontWeight = 'bold';
        label.style.fontSize = '14px';
        label.style.textShadow = '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)';
        label.style.whiteSpace = 'nowrap';
        label.style.padding = '2px 6px';
        label.style.backgroundColor = 'rgba(0,0,0,0.3)';
        label.style.borderRadius = '4px';
        label.style.backdropFilter = 'blur(4px)';

        markerContainer.appendChild(circle);
        markerContainer.appendChild(label);

        const marker = new mapboxgl.Marker({
          element: markerContainer,
          anchor: 'left'
        })
          .setLngLat(project.coordinates)
          .addTo(map);

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="padding: 8px; min-width: 120px;">
              <div style="font-weight: bold; font-size: 14px; color: #333; margin-bottom: 4px;">
                ${project.name}
              </div>
              <div style="font-size: 12px; color: #666;">
                ${project.location}
              </div>
            </div>
          `);

        markerContainer.addEventListener('mouseenter', () => {
          marker.setPopup(popup);
        });

        markerContainer.addEventListener('mouseleave', () => {
          marker.getPopup()?.remove();
        });

        customMarkers.push(marker);
      });

      markersRef.current = customMarkers;

      const nav = new mapboxgl.NavigationControl({
        showCompass: false,
        showZoom: true
      });
      map.addControl(nav, 'bottom-right');
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full rounded-xl overflow-hidden"
      style={{ minHeight: 0 }}
    />
  );
});

Argentina_Map.displayName = 'Argentina_Map';

export default Argentina_Map;

