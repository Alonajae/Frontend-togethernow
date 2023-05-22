import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { Camera, CameraType } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { registerStep5, clean } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { Modal, PaperProvider, Button, Text, Portal } from "react-native-paper";

export default function VideoScreen({ navigation }) {
  const backendAdress = "https://backend-together-mvp.vercel.app";
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.value);
  const [visible, setVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(true);

  // camera states
  const [type, setType] = useState(CameraType.back);
  const isFocused = useIsFocused();
  const containerStyle = { padding: 40, margin: 30, borderRadius: 10, backgroundColor: '#F9F0FB' };
  const [video, setVideo] = useState("");
  const [randomNumbers, setRandomNumbers] = useState(null);

  useEffect(() => {
    generateRandomNumbers();
  }, []);

  const generateRandomNumbers = () => {
    const numbers = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 10) + 1
    );
    setRandomNumbers(numbers);
  };


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
    }
  };


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
        dispatch(registerStep5({ validationVideo: data.url }));
        setVisible(true);
      });
  }

  // if the user don't want to take a video

  const handleNo = () => {
    dispatch(clean());
    dispatch(registerStep5({ validationVideo: null }));
    navigation.navigate("MyProfile");
  };

  const modal = (
    <Modal visible={permissionVisible} contentContainerStyle={containerStyle}>
      <Text>
        Would you like to take a video to validate your identity now ?
        If not, you will be able to do it later in your profile, but you won't be able to use the app until you do it.
      </Text>
      <Button onPress={handleNo}>No</Button>
      <Button onPress={() => { setPermissionVisible(false); dispatch(clean()) }}>Yes</Button>
    </Modal>
  );

  // recuperation du son qui marche mais pas de possibilité de speech to text avec ExpoGo
  // Ne pas supprimer SVP

  // const playsSound = async () => {
  //   console.log('Loading Sound');
  //   console.log(videoSource.uri);
  //   const {sound} = await Audio.Sound.createAsync({uri: videoSource.uri});
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
          <View style={styles.randomNumberContainer}>
            {randomNumbers && randomNumbers.map((number) => (
              <Text style={styles.randomNumber}>{number}</Text>
            ))}
          </View>

          <View style={styles.snapButton}>
            <TouchableOpacity onPress={() => cameraRef && recordVideo()}>
              <FontAwesome name="circle-thin" size={95} color="pink" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => cameraRef && cameraRef.current.stopRecording()}>
              <FontAwesome name="circle" size={85} color="red" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handlePictures(video)}>
              <FontAwesome name="circle" size={85} color="green" />
            </TouchableOpacity>
            {modal}
            <Modal visible={visible} contentContainerStyle={containerStyle}>
              <Text style={styles.textModal}>
                An admin will check your identity soon!
              </Text>
              <View style={styles.modalBtn}>
                <Button style={styles.validateBtn} onPress={() => navigation.navigate("MyProfile")}>
                  <Text style={styles.textBtn}>See my profile</Text></Button>
              </View>
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
  textModal: {
    color: '#350040',
    alignSelf: 'center',
    fontSize: 16,

  },
  validateBtn: {

    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#9E15B8',
    borderRadius: 50,
  },
  textBtn: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'Inter'
  },
  randomNumberText: {
    color: 'black',
    fontSize: 800,
    fontFamily: 'Inter',
    marginTop: 20,
    marginBottom: 20,
  },
  modalBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
  },
  randomNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    height: 100,
    marginTop: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  randomNumberText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
});
