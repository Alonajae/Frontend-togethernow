import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, Dimensions, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Modal, TextInput } from 'react-native-paper';
import { Svg, Circle } from 'react-native-svg';
import { setBuddy } from '../reducers/map';
// import io from 'socket.io-client';

export default function MapScreen({ navigation }) {
  const token = useSelector((state) => state.user.value.token);
  const user = useSelector((state) => state.user.value);
  const buddy = useSelector((state) => state.map.value.buddy);

  const dispatch = useDispatch();

  // state for the current position
  const [currentPosition, setCurrentPosition] = useState(null);

  // state for polyline
  const [decodedPolyline, setDecodedPolyline] = useState([]);
  const [buddyPolyline, setBuddyPolyline] = useState([]);
  const [wayPoints, setWayPoints] = useState([]);

  // states for the search bar
  const [address, setAddress] = useState(null);

  // states for the buttons
  const [buddiesIsSelected, setBuddiesIsSelected] = useState(false);
  const [safePlacesIsSelected, setSafePlacesIsSelected] = useState(false);
  const [alertsIsSelected, setAlertsIsSelected] = useState(false);

  // states for the itinerary
  const [itineraryIsSelected, setItineraryIsSelected] = useState(false);
  const [itinerary, setItinerary] = useState(null);
  const [itineraries, setItineraries] = useState([]);
  const [buddyModalVisible, setBuddyModalVisible] = useState(false);

  // states for the map
  const [alerts, setAlerts] = useState([]);
  const [buddies, setBuddies] = useState([]);
  const [safePlaces, setSafePlaces] = useState([]);

  // states for the modals
  const [error, setError] = useState(false);
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

  // Socket.io
  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   // Establish the socket connection
  //   const socket = io(backendAdress); // Update with your Vercel deployment URL
  //   setSocket(socket);

  //   // Clean up the socket connection on component unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // useEffect(() => {
  //   if (socket) {
  //     // Listen for 'itinerary' events
  //     socket.on('itinerary', (data) => {
  //       // Handle received itinerary data
  //       console.log('Received shared itinerary:', data);

  //       // Update the list of itineraries
  //       setItineraries((prevItineraries) => [...prevItineraries, data]);
  //     });
  //   }


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
              .then(() => {
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

  const searchCity = (query) => {
    // if the query is empty, do not fetch
    if (query === '' || query.length < 5) {
      setDataSet([]);
      setAddress(null);
      setDecodedPolyline([]);
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



  const handleItinerarySubmit = (itinerary) => {

    // // Emit the itinerary data to the server
    // socket.emit('itinerary', itinerary);
    // console.log('itinerary sent');
    // console.log(itinerary);

    fetch(`${backendAdress}/trips/findBuddy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itinerary, token })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.status === 'error') {
          alert(data.message);
        } else {
          setItineraries(data.buddies);
          setBuddyModalVisible(true);
        }
      })
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

  function decodePoly(polyline) {
    let index = 0,
      latitude = 0,
      longitude = 0,
      coordinates = [];

    while (index < polyline.length) {
      let shift = 0,
        result = 0,
        byte;

      do {
        byte = polyline.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      let deltaLatitude = (result & 1) ? ~(result >> 1) : (result >> 1);
      latitude += deltaLatitude;

      shift = 0;
      result = 0;

      do {
        byte = polyline.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      let deltaLongitude = (result & 1) ? ~(result >> 1) : (result >> 1);
      longitude += deltaLongitude;

      coordinates.push({
        latitude: latitude / 1e5,
        longitude: longitude / 1e5,
      });
    }

    return coordinates;
  }


  const handleTrack = () => {
    fetch(`${backendAdress}/trips/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: token, currentPosition: { latitude: currentPosition.coords.latitude, longitude: currentPosition.coords.longitude }, address: address.coordinates }),
    })
      .then((response) => response.json())
      .then((json) => {
        const polyline = json.data.routes[0].overview_polyline.points;

        // Decode the polyline
        const decodedPolyline = decodePoly(polyline);
        setDecodedPolyline(decodedPolyline);

        // Calculate distance or duration (example using first step in the route)
        const distance = json.data.routes[0].legs[0].distance.text;
        const duration = json.data.routes[0].legs[0].duration.text;

        setItinerary({ points: decodedPolyline, distance: distance, duration: duration });
        setItineraryIsSelected(true);
        setInfoModalVisible(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };



  // create markers for buddies, safe places and alerts

  const buddiesMarkers = buddies.map((buddy, i) => {
    if (buddy.currentLocation.latitude === 0 && buddy.currentLocation.longitude === 0) return null;

    // Assuming `buddy.profilePicture` contains the image URL or local path
    const profilePicture = buddy.profilePicture;

    // Define the marker size
    const markerSize = 32;

    return (
      <Marker
        key={i}
        coordinate={buddy.currentLocation}
        title={buddy.firstname}
        description={buddy.firstname}
      >
        {/* Create a circular image */}
        <Svg height={markerSize} width={markerSize} style={styles.markerContainer}>
          <Circle cx={markerSize / 2} cy={markerSize / 2} r={markerSize / 2} fill="#fff" />
        </Svg>
        <Image source={{ uri: profilePicture }} style={styles.profilePictureMarker} />
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


  // handle the long press on the map to create an alert and open the modal

  const handleLongPress = (infos) => {
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
    if (newAlertInfos.name === '' || newAlertInfos.description === '') {
      setError('Veuillez remplir tous les champs')
      return;
    }
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

  let styleModal;
  if (alertModalVisible || buddyModalVisible) {
    styleModal =
    {
      position: 'absolute',
      top: 250,
      height: '30%',
      width: '100%',
      backgroundColor: 'transparent',
      zIndex: 1,
    }
  } else if (buddiesIsSelected || alertsIsSelected || safePlacesIsSelected || itineraryIsSelected) {
    styleModal =
    {
      position: 'absolute',
      bottom: 0,
      height: '40%',
      width: '100%',
      backgroundColor: 'transparent',
      zIndex: 1,
    }
  } else {
    styleModal =
    {
      height: '0%',
      width: '0%',
      backgroundColor: 'transparent',
      zIndex: -1,
    }
  }

  const modalAlert = (
    <Modal visible={alertModalVisible} animationType="slide">
      <View style={styles.modalView}>
        <Text style={styles.modalText}>Create an alert</Text>
        <TextInput
          style={styles.inputName}
          onChangeText={(text) => setNewAlertInfos({ ...newAlertInfos, name: text })}
          value={newAlertInfos.name}
          label='Name'
          mode="outlined"
        />
        <TextInput
          style={styles.inputDescription}
          onChangeText={(text) => setNewAlertInfos({ ...newAlertInfos, description: text })}
          value={newAlertInfos.description}
          label='Description'
          mode="outlined"
        />
        <Text style={styles.modalText}>{error}</Text>
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

  const travelProfile = () => {
    navigation.navigate('MyProfile');
  }

  // create a modal to display the infos of alerts, safe places and buddies

  let infoModal;
  if (buddiesIsSelected) {
    infoModal = (
      <Modal visible={infoModalVisible} animationType="slide">
        <View style={styles.modalView}>
          <View style={styles.headerModal}>
            <Text style={styles.modalText}>Buddies</Text>
            <Button
              title="Close"
              onPress={() => { setInfoModalVisible(false); setBuddiesIsSelected(false) }}
            >
              <Text>Close</Text>
            </Button>
          </View>
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
        </View>
      </Modal>
    )
  } else if (safePlacesIsSelected) {
    infoModal = (
      <Modal visible={infoModalVisible} animationType="slide">
        <View style={styles.modalView}>
          <View style={styles.headerModal}>
            <Text style={styles.modalText}>Safe Places</Text>
            <Button
              title="Close"
              onPress={() => { setInfoModalVisible(false); setSafePlacesIsSelected(false) }}
            >
              <Text>Close</Text>
            </Button>
          </View>
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
        </View>
      </Modal>
    )
  } else if (alertsIsSelected) {
    infoModal = (
      <Modal visible={infoModalVisible} animationType="slide">
        <View style={styles.modalView}>
          <View style={styles.headerModal}>
            <Text style={styles.modalText}>Alerts</Text>
            <Button
              title="Close"
              onPress={() => { setInfoModalVisible(false); setAlertsIsSelected(false) }}
            >
              <Text>Close</Text>
            </Button>
          </View>
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
        </View>
      </Modal>
    )
  } else if (itinerary !== null && itineraryIsSelected) {
    infoModal = (
      <Modal visible={infoModalVisible} animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Itinerary</Text>
          <Text> The distance is: {itinerary.distance} </Text>
          <Text> It will take: {itinerary.duration} </Text>
          <View style={styles.buttonModalContainer}>
            <Button
              title="Close"
              onPress={() => { setInfoModalVisible(false); setItineraryIsSelected(false) }}
            >
              <Text>Close</Text>
            </Button>
            <Button
              title="Track"
              onPress={() => handleItinerarySubmit(itinerary)}
            >
              <Text>Find a Buddy</Text>
            </Button>
          </View>
        </View>
      </Modal>
    )
  } else {
    infoModal = null;
  }

  // create a modal to choose your buddy

  let buddyModal;
  if (buddyModalVisible) {
    buddyModal = (
      <Modal visible={infoModalVisible} animationType="slide">
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Find a Buddy</Text>
          {itineraries.length > 0 ? itineraries.map((infos, i) => {
            return (
              <View key={i} style={styles.buddiesContainer}>
                <Image source={{ uri: infos.user.profilePicture }} style={{ width: 70, height: 70, borderRadius: '50%' }} />
                <View style={styles.buddyInfos}>
                  <Text>{infos.user.firstname} {infos.user.lastname}, {infos.user.age}ans </Text>
                  <Text>{infos.similarity}% du trajet partagé</Text>
                </View>
                <Button
                  title="Track"
                  onPress={() => handleContact(infos)}
                >
                  <Text>Contact</Text>
                </Button>
              </View>
            )
          }
          ) : <View>
            <Text>No buddy found</Text>
          </View>}
          <Button
            title="Close"
            onPress={() => { setInfoModalVisible(false); setBuddyModalVisible(false) }}
          >
            <Text>Close</Text>
          </Button>
        </View>
      </Modal>
    )
  } else {
    buddyModal = null;
  }

  // create a modal to display the infos of the contact


  // ...
  const handleContact = (infos) => {
    const buddyPolyline = infos.user.itinerary.map((point) => {
      const formatted = point.split(',')
      return {
        latitude: parseFloat(formatted[0]),
        longitude: parseFloat(formatted[1])
      }
    })
    setWayPoints(infos.waypoints)
    setBuddyPolyline(buddyPolyline)
    fetch(`${backendAdress}/trips/sharedtrip`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: token,
        buddyToken: infos.user.token,
        waypoints: infos.waypoints,
        currentPosition: { latitude: currentPosition.coords.latitude, longitude: currentPosition.coords.longitude },
        address: address.coordinates,
      })
    })
      .then(response => response.json())
      .then(json => {
        const polyline = json.data.routes[0].overview_polyline.points;

        // Decode the polyline
        const decodedPolyline = decodePoly(polyline);
        setDecodedPolyline(decodedPolyline);

        // Calculate distance or duration (example using first step in the route)
        const distance = json.data.routes[0].legs[0].distance.text;
        const duration = json.data.routes[0].legs[0].duration.text;

        setItinerary({ points: decodedPolyline, distance: distance, duration: duration });
        setBuddyModalVisible(false)
        setInfoModalVisible(false)
        setItineraryIsSelected(true)
        dispatch(setBuddy(infos.user))
      })
    navigation.navigate('Chat')
  }

  return (
    <SafeAreaView>
      <MapView mapType="mutedStandard" style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        ref={(ref) => setMapRef(ref)} // Assign the reference to mapRef
        onLongPress={(infos) => handleLongPress(infos)}
      >
        {decodedPolyline.length > 0 && (
          <Polyline
            coordinates={decodedPolyline}
            strokeWidth={2}
            strokeColor="#FF0000"
            lineCap='round'
          />
        )}
        {/* {buddyPolyline.length > 0 && (
          <Polyline
            coordinates={buddyPolyline}
            strokeWidth={1}
            strokeColor="#0000FF"
            lineDashPattern={[5]}
            lineCap='round'
          />
        )} */}
        {wayPoints.length > 0 && wayPoints.map((wayPoint, i) => {
          return (
            <Marker
              key={i}
              coordinate={wayPoint}
              title="Waypoint"
              description="You'll pass by here with your buddy"
            />
          )
        })
        }
        {buddyPolyline.length > 0 && (
          <Marker
            coordinate={buddyPolyline[buddyPolyline.length - 1]}
            title="Destination of your buddy"
            description="Your buddy will arrive here"
          />
        )}
        {address ? <Marker coordinate={address.coordinates} title={address.title} onPress={() => handleTrack()} /> : null}
        {buddiesMarkers}
        {safePlacesMarkers}
        {alertsMarkers}
      </MapView>

      <View style={styles.containersearchebar}>
        <TouchableOpacity onPress={travelProfile} >
          <Image source={{ uri: user.profilePicture }} style={styles.profilePicture} />
        </TouchableOpacity>
        <AutocompleteDropdown
          onChangeText={(value) => searchCity(value)}
          dataSet={dataSet}
          textInputProps={{ placeholder: 'Search city' }}
          inputContainerStyle={styles.inputContainer}
          containerStyle={styles.dropdownContainer}
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
          <Text style={styles.BtnText}>🚨 Alerts</Text>
        </Button>

        <Button
          title="Safe places"
          style={styles.safeplaces}
          onPress={() => { setInfoModalVisible(true); setSafePlacesIsSelected(true) }}
          
        >
          <Text style={styles.BtnText}>🏠 Safe Places</Text>
        </Button>
        <Button
          title="Buddies"
          style={styles.buddies}
          onPress={() => { setInfoModalVisible(true); setBuddiesIsSelected(true) }}
        >
          <Text style={styles.BtnText}>👥 Buddies</Text>
        </Button>
      </View>

      <View style={styleModal}>
        {modalAlert}
        {infoModal}
        {buddyModal}
      </View>
      <View style={styles.emergencyContact}>
        <TouchableOpacity onPress={()=> console.log('emergency')}>
          <Image source={require('../assets/emergency.png')} style={styles.emergency} />
        </TouchableOpacity>
        {buddy ? <Button
          title="Chat"
          style={styles.chat}
          onPress={() => navigation.navigate('Chat')}
        >
        </Button> : null}
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
    width: 35,
    height: 35,
    borderRadius: 50,
    marginLeft: 10,
    marginRight: 10,
  },
  containersearchebar: {
    display: 'flex',
    position: 'absolute',
    top: 50,
    width: '84%',
    alignContent: 'space-between',
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
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
    backgroundColor: 'white',
    fontcolor: '#350040',
    height: 48,
    width: "28%",
    marginTop: 30,
  },
  safeplaces: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    fontcolor: '#9E15B8',
    height: 48,
    width: "35%",
    marginTop: 30,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
  },
  buddies: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    backgroundColor: 'white',
    fontcolor: '#9E15B8',
    height: 48,
    width: "28%",
    marginTop: 30,
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 5,
    width: '100%',
    height: 370,
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
    position: 'absolute',
    top: 90,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  searchBar: {
    backgroundColor: 'white',
    borderRadius: 10,
  },
  scrollContainer: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 2,
    top: 40,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    left: 55,
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
  // suggestionListContainer: {
  //   borderRadius: 1,
  //   backgroundColor: 'rgba(255, 255, 255, 0.4)',
  // },
  resultContainer: {
    backgroundColor: '#ffffff',
    width: '100%',
    borderRadius: 6,
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#FFABF3',
    borderBottomWidth: 1,
    backgroundColor: 'white',
  },
  resultText: {
    textAlign: 'right',
  },
  resultTitle: {
    fontWeight: 'bold',
  },
  inputName: {
    height: 40,
    width: '100%',
    borderRadius: 10,
    borderColor: '#9E15B8',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  inputDescription: {
    height: 80,
    width: '100%',
    borderRadius: 10,
    borderColor: '#9E15B8',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  inputContainer: {
    width: '100%',
    borderRadius: 10,
    borderColor: '#9E15B8',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  markerContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePictureMarker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonModalContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: 60,
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 5,
  },
  buddiesContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    height: 80,
    backgroundColor: 'pink',
    borderRadius: 10,
    marginBottom: 10,
    padding: 5,
    alignItems: 'center',
  },
  BtnText: {
    color: '#9E15B8',
    fontSize: 16,
  },
  emergencyContact: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    display: 'flex',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
});