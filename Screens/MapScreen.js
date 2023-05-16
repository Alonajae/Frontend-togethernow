import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {

  const [search, setSearch] = useState('');
  const [buddies, setBuddies] = useState('');
  const [safePlaces, setSafePlaces] = useState('');
  const [alerts, setAlerts] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition(location.coords);
          });
      }
    })();
  })

  const handleSearch = () => {
    setSearch(!search);
  };

  const handleBuddies = () => {
    setBuddies(!buddies);
    if (buddies) {
      console.log('buddies');
    }
  };

  const handleSafePlaces = () => {
    setSafePlaces(!safePlaces);
    if(safePlaces) {
      console.log('safePlaces')
    };

  const handleAlerts = () => {
    setAlerts(!alerts);
    if(alerts) {
      console.log('alerts')
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
   
    <View style={styles.buttonsContainer}>
      <Button title="Buddies" onPress={handleBuddies} />
      <Button title="Safe Places" onPress={handleSafePlaces} />
      <Button title="Alerts" onPress={handleAlerts} />
    </View>
    
    </KeyboardAvoidingView>
  );
}}