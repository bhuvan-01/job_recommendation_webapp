import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'; 
import apiClient from '@/services/apiClient';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmh1dmFuMDEiLCJhIjoiY2x6aWEyZjNwMGFzZDJ2c2l2dG05N2RzayJ9.EfI-v2ifsPPbXrQW9p7gkQ';

const MapboxMap = ({ apiUrl }) => {
    const mapContainerRef = useRef(null);
    const [jobs, setJobs] = useState([]);
    const [userLocation, setUserLocation] = useState(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const directionsRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(apiUrl || '/jobs');
                setJobs(response.data);
                console.log('Jobs fetched:', response.data);
            } catch (error) {
                setError('Failed to fetch jobs. Please try again later.');
                console.error('Failed to fetch jobs', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [apiUrl]);

    useEffect(() => {
        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser');
            console.error('Geolocation is not supported by your browser');
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            setUserLocation([longitude, latitude]);
            console.log('User location:', [longitude, latitude]);
        }, () => {
            setError('Unable to retrieve your location');
            console.error('Unable to retrieve your location');
            setLoading(false);
        }, {
            enableHighAccuracy: true,
        });
    }, []);

    useEffect(() => {
        if (!userLocation || !jobs.jobs || !jobs.jobs.length || !mapContainerRef.current) {
            console.log('Map cannot be initialized, missing data:', { userLocation, jobs });
            return;
        }

        const map = initializeMap(userLocation);

        addUserMarker(map, userLocation);
        addJobMarkers(map, jobs.jobs);

        map.on('fullscreenchange', () => handleFullscreenChange(map));

        return () => {
            map.remove();
            console.log('Map removed');
        };
    }, [userLocation, jobs]);

    const initializeMap = (center) => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: center,
            zoom: 12,
        });

        console.log('Map initialized at location:', center);

        const fullscreenControl = new mapboxgl.FullscreenControl();
        map.addControl(fullscreenControl);
        map.addControl(new mapboxgl.NavigationControl());
        map.addControl(new mapboxgl.ScaleControl());

        directionsRef.current = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/driving',
            controls: { inputs: true, instructions: true }
        });

        return map;
    };

    const addUserMarker = (map, location) => {
        new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(location)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('You are here'))
            .addTo(map);
    };

    const addJobMarkers = (map, jobs) => {
        jobs.forEach((job) => {
            if (typeof job.latitude === 'number' && typeof job.longitude === 'number') {
                const popupContent = document.createElement('div');
                popupContent.innerHTML = `<strong>${job.title}</strong><p>${job.description}</p>`;
                const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent);
                new mapboxgl.Marker()
                    .setLngLat([job.longitude, job.latitude])
                    .setPopup(popup)
                    .addTo(map);
                console.log('Added job marker:', job);
            } else {
                console.error('Invalid job location data', job);
            }
        });
    };

    const handleFullscreenChange = (map) => {
        const isFullscreenNow = map.isFullscreen();
        setIsFullscreen(isFullscreenNow);
        if (isFullscreenNow) {
            map.addControl(directionsRef.current, 'top-left');
        } else {
            map.removeControl(directionsRef.current);
        }
        console.log('Fullscreen mode:', isFullscreenNow);
    };

    if (loading) {
        return <div>Loading map...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapboxMap;
