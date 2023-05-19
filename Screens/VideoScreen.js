import { View, StyleSheet, Image } from 'react-native';
import React from 'react';
import { Camera, CameraType } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Modal, PaperProvider, Button, Text, Portal } from 'react-native-paper';
import { Audio } from 'expo-av';
// import Voice from '@react-native-voice/voice';

export default function VideoScreen () {


  // camera states
  const [type, setType] = useState(CameraType.back);
  const isFocused = useIsFocused();
  const containerStyle = {backgroundColor: 'white', padding: 20};
  const [videoSource, setVideoSource] = useState('');
  const [sound, setSound] = useState('');

  let [started, setStarted] = useState(false);
  let [results, setResults] = useState([]);
  console.log('====================================');
  console.log(results);
  console.log('====================================');

  // useEffect(() => {
  //   Voice.onSpeechError = onSpeechError;
  //   Voice.onSpeechResults = onSpeechResults;

  //   return () => {
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   }
  // }, []);


  // console.log('====================================');
  // console.log(videoSource);
  // console.log('====================================');

  let cameraRef = useRef(null);
 // take the video

 

    const recordVideo = async () => {
      if (cameraRef) {
        try {
          const videoRecordPromise = await cameraRef.current.recordAsync();
          console.log('====================================');
          console.log('videoRecordPromise', videoRecordPromise);
          console.log('====================================');
          if (videoRecordPromise) {          
            setVideoSource(videoRecordPromise);
            //envoyer au back le videoRecordPromise.uri
            //display une modal de chargement
            // donner l'autorisation d'accéder à la map
          }
        } catch (error) {
          console.warn(error);
        }
      }}

      // recuperation du son qui marche mais pas de possibilité de speech to text avec ExpoGo 
      // Ne pas supprimer SVP

      // const playsSound = async () => {
      //   console.log('Loading Sound');
      //   console.log(videoSource.uri);
      //   const { sound } = await Audio.Sound.createAsync({uri: videoSource.uri});
      //   setSound(sound);
      //   // console.log('Playing Sound');
      //   await sound.playAsync(); }

      // useEffect(() => {
      //   return sound
      //     ? () => {

      //         console.log('Unloading Sound');
      //         sound.unloadAsync(); }
      //     : undefined;
      // }, [sound]);

      //dans le return :
      // <TouchableOpacity onPress={() => playsSound()}>
      // <FontAwesome name='circle-thin' size={95} color='green' />
      // </TouchableOpacity>

      // fin du test

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
         <View style={styles.container}>
        </View>
      </View>
      <View style={styles.snapButton}>
        <TouchableOpacity onPress={() => cameraRef && recordVideo()}>
        <FontAwesome name='circle-thin' size={95} color='pink' />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => cameraRef && cameraRef.current.stopRecording()}>
        <FontAwesome name='circle' size={85} color='red' />
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


//test comment
  // // if no permission, return empty view