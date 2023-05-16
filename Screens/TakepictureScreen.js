import { View, Text } from 'react-native';
import React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { registerStep5 } from '../reducers/user';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

export default function TakePictureScreen ({ navigation }) {

  // camera states
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(flashMode.off);
  const [camera, setCamera] = useState(null)
  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  let cameraRef = useRef(null);

  // ask for permission
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })()
  }, [])

  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
    const formData = new FormData();

    formData.append('photoFromFront', {
      uri: photo.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    fetch('http://localhost:3000//upload', {
      method: 'POST',
      body: formData,
    }).then((response) => response.json())
      .then((data) => {
        data.result && dispatch(registerStep5(data.url));
      });
  }

  // if no permission, return empty view
  if (!hasPermission || !isFocused) {
    return <View></View>;
  }

  return (
    <Camera type={type} flashMode={flashMode} ref={(ref) => cameraRef = ref} style={styles.camera}>
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
          style={styles.button}>
          <FontAwesome name='rotate-right' size={25} color='#ffffff' />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setFlashMode(flashMode === flashMode.off ? flashMode.torch : flashMode.off)}
          style={styles.button} >
          <FontAwesome name='flash' size={25} color={flashMode === flashMode.off ? '#ffffff' : '#e8be4b'} />
         </TouchableOpacity>
      </View>

      <View style={styles.snapContainer}>
        <TouchableOpacity onPress={() => cameraRef && takePicture()}>
        <FontAwesome name='circle-thin' size={95} color='#ffffff' />
        </TouchableOpacity>
      </View>

    </Camera>
  )
}


  // // take the picture
  // const takePicture = async () => {
  //   const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
  //   console.log(photo.width, photo.height);
  //   console.log(photo.uri);
  //   // store the picture in redux

  //   // store the picture in database
    
  // }