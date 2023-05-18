import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Modal, PaperProvider, Button, Text, Portal } from 'react-native-paper';

export default function VideoScreen () {


  // camera states
  const [type, setType] = useState(CameraType.back);
  const isFocused = useIsFocused();
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [videoSource, setVideoSource] = useState([]);
  const [videoRecording, setIsVideoRecording] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  console.log('====================================');
  console.log(videoSource);
  console.log('====================================');

  let cameraRef = useRef(null);

  
  // // take the video
  const recordVideo = async () => {
    if (cameraRef) {
      try {
        const videoRecordPromise = await cameraRef.current.recordAsync();
        console.log('====================================');
        console.log('videoRecordPromise', videoRecordPromise);
        console.log('====================================');
        // if (videoRecordPromise) {
        //   setIsVideoRecording(true);
        //   const data = await videoRecordPromise;
        //   const source = data.uri;
        //   if (source) {
        //     setIsPreview(true);
        //     setVideoSource(source);
        //   }
        // }
      } catch (error) {
        console.warn(error);
      }
    }}

    return (
    <PaperProvider >
      <Portal>
    <Camera type={type} ref={cameraRef} style={styles.camera}>
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
        <TouchableOpacity onPress={() => cameraRef && recordVideo()}>
        <FontAwesome name='circle-thin' size={95} color='pink' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => cameraRef && cameraRef.current.stopRecording()}>
        <FontAwesome name='circle-thin' size={95} color='red' />
        </TouchableOpacity>
      </View>
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



  // // if no permission, return empty view