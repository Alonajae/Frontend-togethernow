import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { registerStep3, registerStep4, login, } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, PaperProvider, Button, Text, Portal } from 'react-native-paper';

export default function TakepictureScreen({ navigation }) {

  const backendAdress = 'https://backend-together-mvp.vercel.app';

  const user = useSelector((state) => state.user.value);
  // camera states
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(CameraType.back);
  const [visible, setVisible] = useState(false);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const containerStyle = { padding: 20, margin: 30, borderRadius: 10, backgroundColor: '#F9F0FB' };

  let cameraRef = useRef(null);

  // ask for permission
  useEffect(() => {
    console.log("token", user.token);
    console.log("photoId", user.photoId);
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }, [])

  // take picture

  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
    console.log(photo.uri);
    if (user.token) {
      handlePictures(photo.uri, 'registerStep4');
    } else if (user.photoId) {
      handlePictures(photo.uri, 'registerStep4');
    } else {
      handlePictures(photo.uri, 'registerStep3');
    }
  }

  // if no permission, return empty view
  if (!hasPermission || !isFocused) {
    return <View></View>;
  }

  // handle validation of the register

  const handlePictures = (photo, registerStep) => {
    const formData = new FormData();

    formData.append(`picture`, {
      uri: photo,
      name: `photo.jpg`,
      type: 'image/jpeg',
    });

    // send picture to server
    fetch(`${backendAdress}/users/upload`, {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        console.log(data);
        if(registerStep === 'registerStep3'){
          dispatch(registerStep3({ photoId: data.url }));
          setVisible(true);
        } else if(registerStep === 'registerStep4'){
          dispatch(registerStep4({ profilePicture: data.url }));
          setVisible(true);
        }
      });
  }

  // handle validation of the register

  const handleValidate = () => {
    fetch(`${backendAdress}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    }).then((response) => response.json())
      .then((data) => {
        dispatch(login(data.user));
        navigation.navigate('Video');
      })
      .catch((error) => console.log(error));
  }

  // handle back button
  const handleBack = () => {
    setVisible(false);
  }

  // handle validation of the id
  const handleValidateId = () => {
    setVisible(false);
  }


  let modal;

  // if the user has already taken a picture, show the modal to validate the picture
  if ((user.photoId && user.profilePicture)) {
    modal = (
      <Modal visible={visible} contentContainerStyle={containerStyle} style={styles.modal}>
        <View style={styles.imageContainer}>
          <Text style={styles.textModal}>Almost done!</Text>
          <Image source={{ uri: user.profilePicture }} style={{ width: 250, height: 250, marginTop: 20 }} />
        </View>
        <View style={styles.modalBtn}>
        <Button onPress={handleBack} style={styles.backBtn}>
        <Text style={styles.textBtn}>Cancel</Text>
        </Button>
        <Button onPress={handleValidate}  style={styles.validateBtn} >
        <Text style={styles.textBtn}>Validate</Text>
        </Button>
        </View>
        {/* <Button onPress={() => navigation.navigate('Map')}>Next</Button> */}
      </Modal>
    ) // test button next to go to the next screen (map)
  } else {
    // if the user has not taken an id picture, show the modal to validate the id
    modal = (
      <Modal visible={visible} contentContainerStyle={containerStyle}>
        <View style={styles.imageContainer}>
          <Text style={styles.textModal}>Valid your ID picture</Text>
          <Image source={{ uri: user.photoId }} style={{ width: 250, height: 250, marginTop: 20}} />
        </View>
        <View style={styles.modalBtn}> 
        <Button onPress={handleBack} style={styles.backBtn}>
          <Text style={styles.textBtn}>Cancel</Text>
        </Button>
        <Button onPress={handleValidateId} style={styles.validateBtn}>
        <Text style={styles.textBtn}>Validate</Text>
        </Button>
        </View>
      </Modal>
    )
  }

  let instructions;

  if (user.photoId) {
    instructions = (
      <View style={styles.instructions}>
         <Text style={styles.textInstructions}>Take a picture of yourself</Text>
      </View>
    )
  } else {
    instructions = (
      <View style={styles.instructions}>
        <Text style={styles.textInstructions}>Take a picture of your ID</Text>
      </View>
    )
  }

  return (
    <PaperProvider >
      <Portal>
        <Camera type={type} ref={(ref) => cameraRef = ref} style={styles.camera} >
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
              style={styles.button}>
              <FontAwesome name='rotate-right' size={25} color='#ffffff' />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button} >
              <FontAwesome name='flash' size={25} color='#ffffff' />
            </TouchableOpacity>
          </View>
          <View style={styles.textOnScreen}>
            {instructions}
            </View>
          <View style={styles.snapButton}>
            <TouchableOpacity onPress={() => cameraRef && takePicture()}>
              <FontAwesome name='circle-thin' size={95} color='pink' />
            </TouchableOpacity>
          </View>
          {modal}
        </Camera>
      </Portal>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttons: {
    flex: 0.1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 50,
  },
  snapButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 25,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  backBtn: {
    width: 100,
    height: 40,
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#FB8C7C',
    borderRadius: 50,
  },
  validateBtn: {
    width: 100,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9E15B8',
    borderRadius: 50,
  },
  modalBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
  },

  textBtn: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter'
  },
  textModal: {
    color: '#350040',
    fontSize: 16,
    fontFamily: 'Inter',
  },
  textOnScreen: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: 50,
    marginTop: 100,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  textInstructions: {
    color: '#350040',
    fontSize: 16,
    fontFamily: 'Inter',
  },
});