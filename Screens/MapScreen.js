import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, SafeAreaView, TouchableOpacity, KeyboardAvoidingView, Dimensions, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default function MapScreen({ navigation }) {

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);

  const [search, setSearch] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);

  const [buddiesIsSelected, setBuddiesIsSelected] = useState(false);
  const [safePlacesIsSelected, setSafePlacesIsSelected] = useState(false);
  const [alertsIsSelected, setAlertsIsSelected] = useState(false);

  const [alerts, setAlerts] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);

  const googleApi = 'AIzaSyD_qcRhN9VzJWseMGcv6zzsqCwAZ40s5P';


  // create markers for buddies, safe places and alerts

  const buddiesMarkers = buddies.map((buddy, i) => {
    return (
      <Marker
        key={i}
        coordinate={buddy.coordinate}
        title={buddy.firstname}
        description={buddy.firsttname}
      />
    );
  });


  const alertsMarkers = alerts.map((alert, i) => {
    return (
      <Marker
        key={i}
        coordinate={alert.coordinate}
        title={alert.name}
        description={alert.description}
      >
      <Image source={require('../assets/Alerts.png')} />
      </Marker>
    );
  });

  const safePlacesMarkers = safePlaces.map((safePlaces, i) => {
    return (
      <Marker
        key={i}
        coordinate={safePlaces.coordinate}
        title={safePlaces.name}
        description={safePlaces.description}
        >
        <Image source={require('../assets/SafePlaces.png')} />
        </Marker>
    );
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === 'granted') {
        Location.watchPositionAsync({ distanceInterval: 10 },
          (location) => {
            setCurrentPosition(location);
            fetch(`https://backend-together-mvp.vercel.app/users/location`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                token: token,
                coordinate: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude
                }
              })
            })
              .then((response) => response.json())
              .then((data) => {
                console.log(data);
              }
              )
          });
      }
    })();

    fetch(`https://backend-together-mvp.vercel.app/safeplaces`)
      .then((response) => response.json())
      .then((data) => {
        setSafePlaces(data.safeplaces);
      })

    fetch(`https://backend-together-mvp.vercel.app/users/buddies`)
      .then((response) => response.json())
      .then((data) => {
        setBuddies(data.users);
      })

    fetch(`https://backend-together-mvp.vercel.app/alerts`)
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data.alerts);
        console.log(data);
      })
  }, []);

  let currentPos = null;
  if (currentPosition) {
    currentPos = (
      <Marker
        coordinate={{ latitude: currentPosition.coords.latitude, longitude: currentPosition.coords.longitude }}
        title="You are here"
        description="Your current position"
      />
    )
  }

  let initialRegion;
  if (currentPosition) {
    initialRegion = {
      latitude: currentPosition.coords.latitude,
      longitude: currentPosition.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  } else {
    initialRegion = {
      latitude: 48.8877125,
      longitude: 2.3036289,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }
  }


  return (
    <MapView mapType="hybrid" style={styles.map}
      initialRegion={initialRegion}
      >
      <GooglePlacesAutocomplete
        placeholder="Type a place"
        query={{key: googleApi}}
      />

      {currentPosition && currentPos}
      {safePlacesMarkers}
      {alertsMarkers}
      {/* {buddiesMarkers} */}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    display: 'flex',
    height: Dimensions.get('window').height * 1,
    width: Dimensions.get('window').width * 1,
  },
  buttonsContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 5,
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 5,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});

//   {"coords": {"accuracy": 20, "altitude": 83.4000015258789, "altitudeAccuracy": 1.3919051885604858, "heading": 0, "latitude": 48.8877125, "longitude": 2.3036289, "speed": 0.0186806321144104}, "mocked": false, "timestamp": 1684335028537}

//
//   <View style={styles.buttonsContainer}>
//   <TouchableOpacity title="Buddies" onPress={() => !buddiesIsSelected} >
//     <FontAwesome name='user' size={25} color='white' />
//   </TouchableOpacity>

//   <TouchableOpacity title="Safe Places" onPress={() => !safePlacesIsSelected} >
//     <FontAwesome name='house-circle-check' size={25} color='white' />
//   </TouchableOpacity>

//   <TouchableOpacity title="Alerts" onPress={() => !alertsIsSelected} >
//     <FontAwesome name='triangle-exclamation' size={25} color='white' />
//   </TouchableOpacity>

// </View>
// 