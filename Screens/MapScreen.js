import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import user from '../reducers/user';
import { pink100 } from 'react-native-paper/lib/typescript/src/styles/themes/v2/colors';

export default function MapScreen() {

  const [search, setSearch] = useState('');
  const [buddies, setBuddies] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const [currentPosition, setCurrentPosition] = useState(null);

  const [buddiesIsSelected, setBuddiesIsSelected] = useState(false);
  const [safePlacesIsSelected, setSafePlacesIsSelected] = useState(false);
  const [alertsIsSelected, setAlertsIsSelected] = useState(false);

  // create markers for buddies, safe places and alerts
  const buddiesMarkers = buddies.map((buddy, i) => {
    return (
      <Marker
        key={i}
        coordinate={{ latitude: buddy.latitude, longitude: buddy.longitude }}
        title={buddy.firstname}
        description={buddy.lastname}
      />
    );
  });

  const safePlacesMarkers = safePlaces.map((safePlace, i) => {
    return (
      <Marker
        key={i}
        coordinate={{ latitude: safePlace.latitude, longitude: safePlace.longitude }}
        title={safePlace.name}
        description={safePlace.description}
      />
    ); 
  });

  const alertsMarkers = alerts.map((alert, i) => {
    return (
      <Marker
        key={i}
        coordinate={{ latitude: alert.latitude, longitude: alert.longitude }}
        title={alert.name}
        description={alert.description}
      />  
    );
  });


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
      <SafeAreaView >
      <MapView mapType="hybrid" style={styles.map} >
        
          {buddiesIsSelected ? buddiesMarkers : null}
          {safePlacesIsSelected ? safePlacesMarkers : null}
          {alertsIsSelected ? alertsMarkers : null}
          
          <View style={styles.buttonsContainer}>
            <TouchableOpacity title="Buddies" onPress={()=> !buddiesIsSelected} />
            <FontAwesome name={user} size={25} color={pink100} /> 
            </TouchableOpacity>
           
            <TouchableOpacity title="Safe Places" onPress={()=> !safePlacesIsSelected} />
            <FontAwesome name={house-circle-check} size={25} color={pink100} />
            </TouchableOpacity>

            <TouchableOpacity title="Alerts" onPress={()=> !alertsIsSelected} /> 
            <FontAwesome name={triangle-exclamation} size={25} color={pink100} />
            </TouchableOpacity>

          </View>
               
      </MapView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}}