import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import apiClient from '@/services/apiClient';

mapboxgl.accessToken = 'pk.eyJ1IjoiYmh1dmFuMDEiLCJhIjoiY2x6aWEyZjNwMGFzZDJ2c2l2dG05N2RzayJ9.EfI-v2ifsPPbXrQW9p7gkQ';

const MapboxMap = ({ apiUrl }) => {
    const mapContainerRef = useRef(null);
    const [jobs, setJobs] = useState([]);
    const [userLocation, setUserLocation] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get(apiUrl || '/jobs');
                console.log('Job Data Fetched:', response.data);
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

        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation([longitude, latitude]);
        };

        const handleError = () => {
            console.error('Unable to retrieve your location');
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
        });
    }, []);

    useEffect(() => {
        if (!userLocation || !jobs.length) return;

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: userLocation, // Center map on the user's current location
            zoom: 12, // Set an appropriate zoom level for the user's location
        });

        // Add a marker for the user's location
        new mapboxgl.Marker({ color: 'blue' })
            .setLngLat(userLocation)
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setText('You are here'))
            .addTo(map);

        jobs.forEach((job) => {
            if (typeof job.latitude === 'number' && typeof job.longitude === 'number') {
                const popupContent = document.createElement('div');
                popupContent.innerHTML = `<strong>${job.title}</strong><br>${job.description}`;

                const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(popupContent);

                new mapboxgl.Marker()
                    .setLngLat([job.longitude, job.latitude])
                    .setPopup(popup)
                    .addTo(map);

                // Remove `aria-hidden` from the close button if it exists
                popup.on('open', () => {
                    const closeButton = popup.getElement().querySelector('.mapboxgl-popup-close-button');
                    if (closeButton) {
                        closeButton.removeAttribute('aria-hidden');
                    }
                });
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
