import { View, Text } from 'react-native'
import React from 'react'
import { Camera, CameraType } from 'expo-camera'
import { useState, useEffect, useRef } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Ionicons } from '@expo/vector-icons'
import { useDispatch } from 'react-redux'
import { useIsFocused } from '@react-navigation/native'

export default function TakePictureScreen ({ navigation }) {

  // camera states
  const [hasPermission, setHasPermission] = useState(null)
  const [type, setType] = useState(CameraType.back);
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
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

  // take the picture
  const takePicture = async () => {
    const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
    console.log(photo.width, photo.height);
    console.log(photo.uri);
    // store the picture in redux

    // store the picture in database
    
  }

  // if no permission, return empty view
  if (!hasPermission || !isFocused) {
    return <View></View>;
  }


  return (
    <Camera type={type} ref={(ref) => cameraRef = ref}>
      <Button
        title="Flip"
        onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
      />
      <Button title="Snap" onPress={() => takePicture()} />
    </Camera>
  )
}