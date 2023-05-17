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
    (async () => {
        const result = await fetch('http://URL:3000/safeplaces');
        const data = await result.json();
        console.log(data);
        setSafePlaces(data.safeplaces);
    })();
    }, []);

    const buddies fetch('http://URL:3000/buddies');
    const data = await result.json();               
    setBuddies(data.buddies);
    })();
    }, []);

    const alerts fetch('http://URL:3000/alerts');
    const data = await result.json();
    setAlerts(data.alerts);
    })();   
    }, []);
    }