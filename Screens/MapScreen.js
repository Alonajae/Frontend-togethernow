import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, StyleSheet, SafeAreaView, Dimensions, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modal, TextInput } from 'react-native-paper';

export default function MapScreen({ navigation }) {

  const dispatch = useDispatch();
  const token = useSelector((state) => state.user.value.token);
  const user = useSelector((state) => state.user.value);

  // state for the current position
  const [currentPosition, setCurrentPosition] = useState(null);

  // states for the search bar
  const [address, setAddress] = useState(null);

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

  const backendAdress = 'https://backend-together-mvp.vercel.app';
  const [dataSet, setDataSet] = useState([]);

  const searchCity = (query) => {
    // if the query is empty, do not fetch
    if (query === '' || query.length < 5) {
      setDataSet([]);
      setAddress(null);
      return;
    }
    const formattedPlace = query.replace(/ /g, '+');
    fetch(`https://api-adresse.data.gouv.fr/search/?q=${formattedPlace}`)
      .then((response) => response.json())
      .then(({ features }) => {
        const suggestions = features.map((data, i) => {
          if (data.properties.context.length > 40) {
            data.properties.context = data.properties.context.slice(0, 40) + '...';
          }
          return { id: i, title: data.properties.name, context: data.properties.context, coordinates: data.geometry.coordinates };
        });
        setDataSet(suggestions);
      });
  };

  // create markers for cities

  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    if (mapRef) {
      // Use the mapRef here or perform any other operations
    }
  }, [mapRef]);

  const handleAddSearchMarker = (element) => {
    const { coordinates } = element;

    const region = {
      latitude: coordinates[1],
      longitude: coordinates[0],
      latitudeDelta: 0.1,
      longitudeDelta: 0.1,
    };

    if (mapRef) {
      mapRef.animateToRegion(region, 1000);
    }

    setAddress({
      title: element.title,
      context: element.context,
      coordinates: { latitude: coordinates[1], longitude: coordinates[0] },
    });

    setDataSet([]); // Clear the dataset to close the autocomplete dropdown
  };

  const cities = dataSet.map((data, i) => {
    return (
      <TouchableOpacity key={i} onPress={() => handleAddSearchMarker(data)}>
        <View style={styles.resultContainer}>
          <MaterialCommunityIcons name="map-marker-check" size={30} color="#51e181" />
          <View>
            <Text style={{ ...styles.resultText, ...styles.resultTitle }}>{data.title}</Text>
            <Text style={styles.resultText}>{data.context}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  });

  const handleTrack = () => {
    fetch(`${backendAdress}/trips/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token, currentPosition: currentPosition, address: address.coordinates }),
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
      })
      .catch((error) => {
        console.error(error);
      });
  };


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
            fetch(`${backendAdress}/users/location`, {
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
                console.log(location.coords.latitude, location.coords.longitude);
              }
              )
          });
      }
    })();

    // get the safe places, buddies and alerts from the backend
    fetch(`${backendAdress}/safeplaces`)
      .then((response) => response.json())
      .then((data) => {
        setSafePlaces(data.safeplaces);
      })

    fetch(`${backendAdress}/users/buddies`, {
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

    fetch(`${backendAdress}/alerts`)
      .then((response) => response.json())
      .then((data) => {
        setAlerts(data.alerts);
      })
  }, []);

  // handle the long press on the map to create an alert and open the modal

  const handleLongPress = (infos) => {
    // console.log(infos.nativeEvent.coordinate);
    setAlertModalVisible(true);
    setNewAlertInfos({
      ...newAlertInfos,
      coordinate: {
        latitude: infos.nativeEvent.coordinate.latitude,
        longitude: infos.nativeEvent.coordinate.longitude
      }
    })
  }

  const handleFictif = () => {
    navigation.navigate('MyProfile');
  }

  // handle the creation of an alert

  const handleCreateAlert = () => {
    fetch(`${backendAdress}/alerts/add`, {
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

  fakeProfileBtn = () => {
    navigation.navigate('MyProfile');
  }

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
      <MapView mapType="mutedStandard" style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        followsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        ref={(ref) => setMapRef(ref)} // Assign the reference to mapRef
        onLongPress={(infos) => handleLongPress(infos)}
      >
        {address ? <Marker coordinate={address.coordinates} title={address.title} onPress={handleTrack} /> : null}
        {buddiesMarkers}
        {safePlacesMarkers}
        {alertsMarkers}
      </MapView>

      <View style={styles.containersearchebar}>
        <TouchableOpacity onPress={fakeProfileBtn} >
          <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
        </TouchableOpacity>
        <AutocompleteDropdown
          onChangeText={(value) => searchCity(value)}
          dataSet={dataSet}
          textInputProps={{ placeholder: 'Search city' }}
          inputContainerStyle={styles.inputContainer}
          containerStyle={styles.dropdownContainer}
          suggestionsListContainerStyle={styles.suggestionListContainer}
          closeOnSubmit
        />
        <View style={styles.scrollContainer}>
          {cities}
        </View>
      </View>
      <View style={styles.buttonsContainer}>

        <Button
          title="Alerts"
          style={styles.alerts}
          onPress={() => { setInfoModalVisible(true); setAlertsIsSelected(true) }}
        >
          <Text>Alerts</Text>
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

      <View style={styles.ModalContainer}>
        {modalAlert}
        {infoModal}
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
  containersearchebar: {
    display: 'flex',
    position: 'absolute',
    top: 50,
    width: '85%',
    alignContent: 'space-between',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
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
    backgroundColor: 'white',
    fontcolor: '#9E15B8',
    width: 75,
    height: 48,
    marginTop: 30,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    width: '100%',
    height: 300,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 5,
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
  scrollContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 2,
    top: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    left: 25,
  },
  dropdownContainer: {
    width: '100%',
  },
  title: {
    fontSize: 50,
    color: '#9E15B8',
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    fontFamily: Platform.select({ ios: 'Georgia', android: 'serif' }),
    marginBottom: 15,
  },
  suggestionListContainer: {
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  resultContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 6,
    padding: 20,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#9E15B8',
    borderWidth: 1,
  },
  resultText: {
    textAlign: 'right',
  },
  resultTitle: {
    fontWeight: 'bold',
  },
  ModalContainer: {
    position: 'absolute',
    height: '30%',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});