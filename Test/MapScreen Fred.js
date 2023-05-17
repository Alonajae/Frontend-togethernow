import React, { useEffect, useState } from 'react';

const App = () => {
  const [safePlaces, setSafePlaces] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const fetchSafePlaces = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://BACKEND/api/safeplaces?${coordonate}`
        );
        const data = await response.json();
        setSafePlaces(data); // mise à jour de l'état 
      } catch (error) {
        console.error(error);
      }
    };

    const fetchBuddies = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `https://BACKEND/api/buddies?${coordonate}`
        );
        const data = await response.json();
        setBuddies(data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchAlerts = async (latitude, longitude) => {
      try {
        const response = await fetch(`https://BACKEND/api/alerts?${coordonate}`
        );
        const data = await response.json();
        setAlerts(data); 
      } catch (error) {
        console.error(error);
      }
    };

    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchSafePlaces(latitude, longitude);
            fetchBuddies(latitude, longitude);
            fetchAlerts(latitude, longitude);
          },
          (error) => {
            console.error(error);
          }
        );
      }  };)}})();}, []);