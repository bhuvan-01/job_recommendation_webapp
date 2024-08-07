import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapView = ({ jobs }) => {
    // Coordinates roughly at the center of the UK
    const ukCenter = [54.5, -3.5];  // Central UK

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <MapContainer center={ukCenter} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {jobs.map(job => (
                    <Marker key={job.id} position={[job.location.lat, job.location.lng]}>
                        <Popup>
                            <b>{job.title}</b><br />
                            {job.description}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
