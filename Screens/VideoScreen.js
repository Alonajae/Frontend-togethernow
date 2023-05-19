import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { Camera, CameraType } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { registerStep4 } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { Modal, PaperProvider, Button, Text, Portal } from "react-native-paper";

export default function VideoScreen({ navigation }) {
  const backendAdress = "https://backend-together-mvp.vercel.app";
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const [visible, setVisible] = useState(false);

  // camera states
  const [type, setType] = useState(CameraType.back);
  const isFocused = useIsFocused();
  const containerStyle = { backgroundColor: "white", padding: 20, width: '80%' };
  const [video, setVideo] = useState("");
  

  console.log('====================================');
  console.log(video);
  console.log('====================================');

  let cameraRef = useRef(null);
  // take the video

  const recordVideo = async () => {
    if (cameraRef) {
      try {
        const videoRecordPromise = await cameraRef.current.recordAsync();
        // console.log("====================================");
        // console.log("videoRecordPromise", videoRecordPromise.uri);
        // console.log("====================================");
        setVideo(videoRecordPromise.uri);
    } catch (error) { 
      console.log(error);
    } 
  }};

  
  const handlePictures = () => {
  const formData = new FormData();
  
  formData.append("video", video);
  
  // send video to server
  fetch(`${backendAdress}/users/uploadVideo`, {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      dispatch(registerStep4({ validationVideo: data.url }));
      
    });
    setVisible(true);
  }
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

  // if (user.validationVideo) {
  //   modal = (
  //     <Modal visible={visible} contentContainerStyle={containerStyle}>
  //       <Text>
  //         An admin will check your identity soon to get access to the Map!
  //       </Text>
  //       <Button onPress={() => navigation.navigate("MyProfile")}>Next</Button>
  //     </Modal>
  //   ); // test button next to go to the next screen (map)
  // }

  return (
    <PaperProvider>
      <Portal>
        <Camera type={CameraType.front} ref={cameraRef} style={styles.camera}>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.button}>
              <FontAwesome name="flash" size={25} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.container}></View>
          </View>
          <View style={styles.snapButton}>
            <TouchableOpacity onPress={() => cameraRef && recordVideo()}>
              <FontAwesome name="circle-thin" size={95} color="pink" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => cameraRef && cameraRef.current.stopRecording() }>
              <FontAwesome name="circle" size={85} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePictures(video)}>
              <FontAwesome name="circle" size={85} color="green" />
            </TouchableOpacity>

            <Modal visible={visible} contentContainerStyle={containerStyle}>
            <Text>
              An admin will check your identity soon to get access to the Map!
            </Text>
            <Button onPress={() => navigation.navigate("MyProfile")}>Next</Button>
          </Modal>

          </View>
        </Camera>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  buttons: {
    flex: 0.1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 50,
  },
  snapButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 25,
  },
});
