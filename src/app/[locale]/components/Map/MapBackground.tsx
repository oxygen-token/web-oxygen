import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY as string | "";

const MapBackground = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const coordinates: [number, number] = [-61.901847, -24.201291]; 

  useEffect(() => {
    
    const map = new mapboxgl.Map({
      container: mapContainerRef.current as HTMLElement,
      style: 'mapbox://styles/mapbox/standard-satellite', 
      center: [0, 0], 
      zoom: 1, 
      interactive: false, 
      dragPan: false, 
      scrollZoom: false, 
      doubleClickZoom: false, 
      touchZoomRotate: false, 
      dragRotate: false, 
      attributionControl: false 
    });

    
    map.on('style.load', () => {
      map.setConfigProperty('basemap', 'showRoadsAndTransit', false);
      map.setConfigProperty('basemap', 'showPedestrianRoads', false);
      map.setConfigProperty('basemap', 'showPlaceLabels', false);
      map.setConfigProperty('basemap', 'showRoadLabels', false);
      map.setConfigProperty('basemap', 'showTransitLabels', false);
      map.setConfigProperty('basemap', 'showPointOfInterestLabels	', false);
    });

    
    map.on('load', () => {
      map.flyTo({
        center: coordinates, 
        zoom: 9, 
        speed: 0.6, 
        animate: true, 
        curve: 1, 
        pitch: 40, 
        essential: true 
      });

      
      map.once('moveend', () => {
        let startBearing = map.getBearing(); 

        const rotateCamera = () => {
          
          startBearing -= 0.1; 
          map.rotateTo(startBearing, { duration: 0 });
          requestAnimationFrame(rotateCamera);
        };

        requestAnimationFrame(rotateCamera);
      });
    });
    
    return () => map.remove();
  }, []);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default MapBackground;
