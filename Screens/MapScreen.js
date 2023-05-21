import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Dimensions, Image, Text, KeyboardAvoidingView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Modal, Button } from 'react-native-paper';

export default function MapScreen({ navigation }) {

  const GOOGLE_PLACES_API_KEY = 'AIzaSyD_qcRhN9VzJWseMGcv6zzsqCwAZ40s5P';

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);

  // states for the search bar and the current position
  const [search, setSearch] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);

  // states for the buttons
  const [buddiesIsSelected, setBuddiesIsSelected] = useState(false);
  const [safePlacesIsSelected, setSafePlacesIsSelected] = useState(false);
  const [alertsIsSelected, setAlertsIsSelected] = useState(false);

  // states for the map
  const [alerts, setAlerts] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);

  // states for the modals
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [newAlertInfos, setNewAlertInfos] = useState({
    name: '',
    description: '',
    coordinate: {
      latitude: 0,
      longitude: 0
    }
  });

  
  // create markers for buddies, safe places and alerts

  const buddiesMarkers = buddies.map((buddy, i) => {
    return (
      <Marker
        key={i}
        coordinate={buddy.coordinate}
        title={buddy.firstname}
        description={buddy.firstname}
        >
          <Image source={require('../assets/icons8-utilisateur.png')} />
        </Marker>
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
        <Image source={require('../assets/icons8-location-48.png')} />
      </Marker>
    );
  });

  // get the current position of the user and send it to the backend
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

    // get the safe places, buddies and alerts from the backend
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
      })
  }, []);

  // handle the long press on the map to create an alert and open the modal

  const handleLongPress = (e) => {
    setAlertModalVisible(true);
    setNewAlertInfos({
      ...newAlertInfos,
      coordinate: {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude
      }
    })
  }

  // handle the creation of an alert

  const handleCreateAlert = () => {
    fetch(`https://backend-together-mvp.vercel.app/alerts/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token,
        name: newAlertInfos.name,
        description: newAlertInfos.description,
        coordinate: newAlertInfos.coordinate
      })
    })
      .then((response) => response.json())
      .then((data) => {
        setAlerts([...alerts, data.alert]);
        setAlertModalVisible(false);
        setNewAlertInfos({
          name: '',
          description: '',
          coordinate: {
            latitude: 0,
            longitude: 0
          }
        })
      })
  }

  // handle cancel the creation of an alert

  const handleCancelAlert = () => {
    setAlertModalVisible(false);
    setNewAlertInfos({
      name: '',
      description: '',
      coordinate: {
        latitude: 0,
        longitude: 0
      }
    })
  }


  // handle the position of the user
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

  // make the initial region of the map the current position of the user
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
    <SafeAreaView>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <MapView mapType="hybrid" style={styles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            onLongPress={(e) => { handleLongPress(e) }}
          >

          <GooglePlacesAutocomplete
            placeholder='Search'
            fetchDetails={true}
            onPress={(data, details = null) => {
              console.log(data, details);
            }}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: 'en',
              components: 'country:fr',
            }}
          />
        
          {currentPosition && currentPos}
          {safePlacesMarkers}
          {alertsMarkers}
          {buddiesMarkers}
          <Modal visible={alertModalVisible} animationType="slide">
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Create an alert</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewAlertInfos({ ...newAlertInfos, name: text })}
                value={newAlertInfos.name}
                placeholder="Name"
              />
              <TextInput
                style={styles.input}
                onChangeText={(text) => setNewAlertInfos({ ...newAlertInfos, description: text })}
                value={newAlertInfos.description}
                placeholder="Description"
              />
              <Button
                title="Create"
                onPress={handleCreateAlert}
              />
              <Button
                title="Cancel"
                onPress={handleCancelAlert}
              />
            </View>
          </Modal>
        </MapView>
      </KeyboardAvoidingView>
    </SafeAreaView>
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
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    height: 500,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: 'bold'
  }
});

