import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { registerStep3, registerStep5, logout, login } from '../reducers/user';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, PaperProvider, Button, Text, Portal } from 'react-native-paper';

export default function TakepictureScreen ({ navigation }) {

  const user = useSelector((state) => state.user.value);
  // camera states
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(CameraType.back);
  const [camera, setCamera] = useState(null)
  const [visible, setVisible] = useState(false);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const containerStyle = {backgroundColor: 'white', padding: 20};

  let cameraRef = useRef(null);

  // ask for permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }, [])

  // take picture
  
  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
    if (user.token) {
      dispatch(registerStep5({profilePicture: photo.uri}));
    } else if (user.photoId) {
      dispatch(registerStep5({profilePicture: photo.uri}));
    } else {
      dispatch(registerStep3({photoId: photo.uri}));
    }
    setVisible(true);
  }

  // if no permission, return empty view
  if (!hasPermission || !isFocused) {
    return <View></View>;
  }

  // handle validation of the register

  const handlePictures = (photo) => {
    const formData = new FormData();

    formData.append(`picture`, {
      uri: photo,
      name: `${photo}.jpg`,
      type: 'image/jpeg',
    });

    // send picture to server
    fetch('http://192.168.10.137:3000/users/upload', {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        if(user.photoId) {
          dispatch(registerStep5({profilePicture: data.url }));
        } else if (user.token) {
          dispatch(registerStep5({photoId: data.url }));
        } else {
          dispatch(registerStep3({photoId: data.url }));
        }
      });
  }

const handleValidate = () => {
  handlePictures(user.photoId);
  handlePictures(user.profilePicture);
    fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(user),
    }).then((response) => response.json())
      .then((data) => {
        dispatch(logout());
        dispatch(login(data));
        navigation.navigate('Map');
      });
  }

  // handle back button
  const handleBack = () => {
    setVisible(false);
  }

  // handle validation of the id
  const handleValidateId = () => {
    // navigation.navigate('Identity');
    setVisible(false);
  }

  let modal;

  // if the user has already taken a picture, show the modal to validate the picture
  if(user.photoId && user.profilePicture) {
    modal = (
      <Modal visible={visible} contentContainerStyle={containerStyle}>
          <Text>Finish your register</Text>
          <Image source={{uri: user.profilePicture}} style={{width: 200, height: 200}} />
          <Button onPress={handleValidate}>Validate</Button>
          <Button onPress={handleBack}>Back</Button>
          <Button onPress={() => navigation.navigate('Identity')}>Next</Button>
        </Modal>
    ) // test button next to go to the next screen
  } else {
    // if the user has not taken a profile picture and the id, show the modal to validate the id
    modal = (
      <Modal visible={visible} contentContainerStyle={containerStyle}>
          <Text>Valid your Id picture</Text>
          <Image source={{uri: user.photoId}} style={{width: 200, height: 200}} />
          <Button onPress={handleValidateId}>Validate</Button>
          <Button onPress={handleBack}>Back</Button>
        </Modal>
    )
  }

  return (
    <PaperProvider >
      <Portal>
    <Camera type={type} ref={(ref) => cameraRef = ref} style={styles.camera}>
      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
          style={styles.button}>
          <FontAwesome name='rotate-right' size={25} color='#ffffff' />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button} >
          <FontAwesome name='flash' size={25} color='#ffffff'/>
         </TouchableOpacity>
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
});

  // // take the picture
  // const takePicture = async () => {
  //   const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
  //   console.log(photo.width, photo.height);
  //   console.log(photo.uri);
  //   // store the picture in redux

  //   // store the picture in database
    
  // }

  // // if no permission, return empty view