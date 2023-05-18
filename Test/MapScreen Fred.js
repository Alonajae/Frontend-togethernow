import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {

    const [safePlaces, setSafePlaces] = useState([]);
    const [buddies, setBuddies] = useState([]);
    const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            console.log(location);
            setCurrentPosition(location);
          });
      }
    })();
  })

  useEffect(() => {
    const handleSafePlaces = () => {
        fetch(`${BACKEND_ADDRESS}/safeplaces`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: coordinate.latitude, longitude: coordinate.longitude }),
        })
          .then((response) => response.json())
          .then((data) => {
            setSafePlaces(data.safePlaces);
          })
          .catch((error) => {
            console.error(error);
          });
      };
      
      const handleBuddies = () => {
        fetch(`${BACKEND_ADDRESS}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: coordinate.latitude, longitude: coordinate.longitude }),
        })
          .then((response) => response.json())
          .then((data) => {
            setBuddies(data.buddies);
          })
          .catch((error) => {
            console.error(error);
          });
      };
      
      const handleAlerts = () => {
        fetch(`${BACKEND_ADDRESS}/alerts`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ latitude: coordinate.latitude, longitude: coordinate.longitude }),
        })
          .then((response) => response.json())
          .then((data) => {
            setAlerts(data.alerts);
          })
          .catch((error) => {
            console.error(error);
          });
      };
  })
}