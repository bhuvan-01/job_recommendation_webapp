import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import apiClient from '@/services/apiClient'; // Assuming this is correctly set up

mapboxgl.accessToken = 'pk.eyJ1IjoiYmh1dmFuMDEiLCJhIjoiY2x6aWEyZjNwMGFzZDJ2c2l2dG05N2RzayJ9.EfI-v2ifsPPbXrQW9p7gkQ';

const MapboxMap = ({ apiUrl }) => {
    const mapContainerRef = useRef(null);
    const [jobs, setJobs] = useState([]); // State to hold job data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiClient.get('/jobs'); // Modify the URL as per your API
                console.log('Job Data Fetched:', response.data) // Check the fetched data
                setJobs(response.data); // Assuming the response data is the array of jobs
            } catch (error) {
                console.error('Failed to fetch jobs', error);
            }
        };

        fetchData();
    }, [apiUrl]); // Ensure the effect runs when apiUrl changes

    useEffect(() => {
        if (!jobs.length) return; // Ensure jobs are loaded before initializing the map

        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [-0.1276, 51.5072],
            zoom: 10
        });

        const directions = new MapboxDirections({
            accessToken: mapboxgl.accessToken,
            unit: 'metric',
            profile: 'mapbox/driving'
        });



        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(position => {
                const userLocation = [position.coords.longitude, position.coords.latitude];
                map.flyTo({
                    center: userLocation,
                    zoom: 14
                });
                directions.setOrigin(userLocation);
            }, console.error, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            });
        }

        jobs.forEach(job => {
            if (job.location && typeof job.location.lat === "number" && typeof job.location.lng === "number") {
                const popup = new mapboxgl.Popup({ offset: 25 }).setText(
                    `${job.title}: ${job.description}`
                );
                const marker = new mapboxgl.Marker()
                    .setLngLat([job.location.lng, job.location.lat])
                    .setPopup(popup)
                    .addTo(map);

                marker.getElement().addEventListener('click', () => {
                    directions.setDestination([job.location.lng, job.location.lat]);
                });
            } else {
                console.error('Invalid job location data', job);
            }
        });

        return () => {
            map.remove();
        };
    }, [jobs]); // Dependency on jobs to ensure map initializes after jobs are fetched

    return <div ref={mapContainerRef} style={{ height: '400px', width: '100%' }} />;
};

export default MapboxMap;
