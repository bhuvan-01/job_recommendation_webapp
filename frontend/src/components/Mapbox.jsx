import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css';  // Include CSS for directions
import apiClient from '@/services/apiClient';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmh1dmFuMDEiLCJhIjoiY2x6aWEyZjNwMGFzZDJ2c2l2dG05N2RzayJ9.EfI-v2ifsPPbXrQW9p7gkQ';
const MapboxMap = ({ apiUrl }) => {
    const mapContainerRef = useRef(null);
    const [jobs, setJobs] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const directionsRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(apiUrl || '/jobs');
                setJobs(response.data);
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            }
        };

        fetchData();
    }, [apiUrl]);

    useEffect(() => {
        if (!navigator.geolocation) {
            console.error('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setUserLocation([longitude, latitude]);
        }, () => {
            console.error('Unable to retrieve your location');
        }, {
            enableHighAccuracy: true,
        });
    }, []);

    useEffect(() => {
        if (!userLocation || !jobs.length) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: userLocation,
            zoom: 12,
        });

        const fullscreenControl = new mapboxgl.FullscreenControl();
        map.addControl(fullscreenControl);
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.ScaleControl());

        // Setup directions control but do not add it yet
        directionsRef.current = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/driving',
            controls: { inputs: true, instructions: true }
        });

        // Listen for fullscreen change events
        map.on('fullscreenchange', () => {
            const isFullscreenNow = map.isFullscreen();
            setIsFullscreen(isFullscreenNow);
            if (isFullscreenNow) {
                map.addControl(directionsRef.current, 'top-left');
            } else {
                map.removeControl(directionsRef.current);
            }
        });

        new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(userLocation)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('You are here'))
            .addTo(map);

        jobs.forEach((job) => {
            if (typeof job.latitude === 'number' && typeof job.longitude === 'number') {
                const popupContent = document.createElement('div');
                popupContent.innerHTML = `<strong>${job.title}</strong><p>${job.description}</p>`;
                const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent);
                new mapboxgl.Marker()
                    .setLngLat([job.longitude, job.latitude])
                    .setPopup(popup)
                    .addTo(map);
            } else {
                console.error('Invalid job location data', job);
            }
        });

        return () => {
            map.remove();
        };
    }, [userLocation, jobs]);

    return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapboxMap;
