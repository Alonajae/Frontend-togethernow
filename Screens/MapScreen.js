import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, SafeAreaView, Dimensions, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Modal } from 'react-native-paper';

export default function MapScreen({ navigation }) {

  const GOOGLE_PLACES_API_KEY = 'AIzaSyD_qcRhN9VzJWseMGcv6zzsqCwAZ40s5P';

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);
  const user = useSelector((state) => state.user.value);

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
  const [modalVisible, setModalVisible] = useState(false);
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

  // states for the profile picture
  const [profilePicture, setProfilePicture] = useState(null);

  const handleProfile = () => {
    setModalVisible(true);
  }

  // create markers for buddies, safe places and alerts

  const buddiesMarkers = buddies.map((buddy, i) => {
    if (buddy.currentLocation.latitude === 0 && buddy.currentLocation.longitude === 0) return null;
    return (
      <Marker
        key={i}
        coordinate={buddy.currentLocation}
        title={buddy.firstname}
        description={buddy.firstname}
      >
        <Image source={require('../assets/icons8-location-48.png')} />
      </Marker>
    );
  });


  const alertsMarkers = alerts.map((alert, i) => {
    return (
      <Marker
        key={i}
        coordinate={alert.coordinate}
        title={alert.type}
        description={alert.description}
      >
        <Image source={require('../assets/Alerts.png')} />
      </Marker>
    );
  });

  const safePlacesMarkers = safePlaces.map((safePlace, i) => {
    return (
      <Marker
        key={i}
        coordinate={safePlace.coordinate}
        title={safePlace.name}
        description={safePlace.description}
      >
        <Image source={require('../assets/SafePlaces.png')} style={{ width: 40, height: 40 }} />
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
            fetch(`http://192.168.10.173:3000/users/location`, {
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
                console.log(location);
              }
              )
          });
      }
    })();

    // get the safe places, buddies and alerts from the backend
    fetch(`http://192.168.10.173:3000/safeplaces`)
      .then((response) => response.json())
      .then((data) => {
        setSafePlaces(data.safeplaces);
      })

    fetch(`http://192.168.10.173:3000/users/buddies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: token
        })
      })
      .then((response) => response.json())
      .then((data) => {
        setBuddies(data.users);
      })

    fetch(`http://192.168.10.173:3000/alerts`)
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data.alerts);
      })
  }, []);

  // handle the long press on the map to create an alert and open the modal

  const handleLongPress = (infos) => {
    console.log(infos.nativeEvent.coordinate);
    setAlertModalVisible(true);
    setNewAlertInfos({
      ...newAlertInfos,
      coordinate: {
        latitude: infos.nativeEvent.coordinate.latitude,
        longitude: infos.nativeEvent.coordinate.longitude
      }
    })
  }

  // handle the creation of an alert

  const handleCreateAlert = () => {
    fetch(`http://192.168.10.173:3000/alerts/add`, {
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

console.log('user',user.profilePicture);
  // handle the position of the user
  // let currentPos;
  // if (currentPosition) {
  //   currentPos = (
  //     <Marker
  //       coordinate={{ latitude: currentPosition.coords.latitude, longitude: currentPosition.coords.longitude }}
  //       title="You are here"
  //       description="Your current position"
  //     />
  //   )
  // } else {
  //   currentPos = null;
  // }

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

  const modalAlert = (
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
        > Create </Button>
        <Button
          title="Cancel"
          onPress={handleCancelAlert}
        > Cancel </Button>
      </View>
    </Modal>
  )
  // create a modal to display the profile picture

  let profilModal = (
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalView}>
          <Image source={{uri: user.profilePicture}} style={styles.profilePicture} />
          <Button
            title="Close"
            onPress={() => setModalVisible(false)}
          >
            <Text>Close</Text>
          </Button>
        </View>
      </Modal>
    )
  

  // create a modal to display the infos of alerts, safe places and buddies

  let infoModal;
  if (buddiesIsSelected) {
    infoModal = (
      <Modal visible={infoModalVisible} animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Buddies</Text>
          <FlatList
            data={buddies}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.modalText}>{item.name}</Text>
                <Text style={styles.modalText}>{item.description}</Text>
              </View>
            )}
            keyExtractor={item => item._id}
          />
          <Button
            title="Close"
            onPress={() => { setInfoModalVisible(false); setBuddiesIsSelected(false) }}
          >
            <Text>Close</Text>
          </Button>
        </View>
      </Modal>
    )
  } else if (safePlacesIsSelected) {
    infoModal = (
      <Modal visible={infoModalVisible} animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Safe Places</Text>
          <FlatList
            data={safePlaces}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.modalText}>{item.name}</Text>
                <Text style={styles.modalText}>{item.description}</Text>
              </View>
            )}
            keyExtractor={item => item._id}
          />
          <Button
            title="Close"
            onPress={() => { setInfoModalVisible(false); setSafePlacesIsSelected(false) }}
          >
            <Text>Close</Text>
          </Button>
        </View>
      </Modal>
    )
  } else if (alertsIsSelected) {
    infoModal = (
      <Modal visible={infoModalVisible} animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Alerts</Text>
          <FlatList
            data={alerts}
            renderItem={({ item }) => (
              <View>
                <Text style={styles.modalText}>{item.name}</Text>
                <Text style={styles.modalText}>{item.description}</Text>
              </View>
            )}
            keyExtractor={item => item._id}
          />
          <Button
            title="Close"
            onPress={() => { setInfoModalVisible(false); setAlertsIsSelected(false) }}
          >
            <Text>Close</Text>
          </Button>
        </View>
      </Modal>
    )
  } else {
    infoModal = null;
  }

  return (
    <SafeAreaView>
      {modalAlert}
      {infoModal}
      <MapView mapType="mutedStandard" style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        onLongPress={(infos) => handleLongPress(infos)}
      >
        {buddiesMarkers}
        {/* {currentPos} */}
        {safePlacesMarkers}
        {alertsMarkers}

      </MapView>

      <View style={styles.searcheBar}>
      <TouchableOpacity onPress={handleProfile}>
         <Image source={{uri: user.profilePicture}} style={styles.profilePicture} />
        </TouchableOpacity>

      <GooglePlacesAutocomplete
        // style={styles.searchBar}>
        placeholder='Search'
        fetchDetails={true}
        onPress={(data, details = null) => {
          console.log(data, details);
        }}
        query={{
          key: GOOGLE_PLACES_API_KEY,
          language: 'en',
        }}
      />
      </View>

      <View style={styles.profile}>
       {profilModal}
      </View>

      <View style={styles.buttonsContainer}>
      <TouchableOpacity onPress={handleProfile}>
         <Image source={{uri: user.profilePicture}} style={styles.profilePicture} />
        </TouchableOpacity>
        <Button
          title="Alerts"
          style={styles.alerts}
          onPress={() => { setInfoModalVisible(true); setAlertsIsSelected(true) }}
        >
          <Text> Alerts </Text>
        </Button>
        <Button
          title="Safe places"
          style={styles.safeplaces}
          onPress={() => { setInfoModalVisible(true); setSafePlacesIsSelected(true) }}
        >
          <Text> Safe Places </Text>
        </Button>
        <Button
          title="Buddies"
          style={styles.buddies}
          onPress={() => { setInfoModalVisible(true); setBuddiesIsSelected(true) }}
        >
          <Text> Buddies </Text>
        </Button>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  map: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    display: 'flex',
  },
  profilePicture: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  searcheBar: {
    position: 'absolute',
    display: 'flex',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    padding: 5,
  },
  alerts: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#9E15B8',
    backgroundColor: 'white',
    fontcolor: '#350040',
    width: 100,
    height: 48,
    marginTop: 30,
  },
  safeplaces: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#9E15B8',
    backgroundColor: 'white',
    fontcolor: '#9E15B8',
    width: 150,
    height: 48,
    marginTop: 30,
  },
  buddies: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#9E15B8',
    fontcolor: '#9E15B8',
    width: 50,
    height: 48,
    marginTop: 30,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  modalView: {
    position: 'absolute',
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
  },
  buttonsContainer: {
    display: 'flex',
    position: 'absolute',
    top: 90,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 5,
  },
  searchBar: {
    position: 'absolute',
    display: 'flex',
    top: 10,
    left: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 100,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 5,
  },
});

// profile: {
//   position: 'absolute',
//   display: 'flex',
//   top: 10,
//   left: 10,
//   flexDirection: 'row',
//   justifyContent: 'space-between',
//   width: 100,
//   backgroundColor: 'white',
//   borderRadius: 10,
//   padding: 5,
// }