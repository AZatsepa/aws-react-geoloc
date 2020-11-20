import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

const GoogleMap = () => {
  const DEFAULT_LOCATION = { lat: 59.95, lng: 30.33 };
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    setPosition();
  }, []);

  const setPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const lat  = position.coords.latitude;
      const lng = position.coords.longitude;
      setCurrentLocation({ lat, lng });
    });
  };

  return(
    // Important! Always set the container height explicitly
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAP_API_KEY }}
        defaultCenter={DEFAULT_LOCATION}
        center={currentLocation}
        defaultZoom={1}
        yesIWantToUseGoogleMapApiInternals
        options={{
          gestureHandling: 'greedy',
        }}
      >
        <Marker
          lat={currentLocation.lat}
          lng={currentLocation.lng}
        />
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMap;
