import { View, StyleSheet, Image } from "react-native";
import React from "react";
import { Camera, CameraType } from "expo-camera";
import { useState, useEffect, useRef } from "react";
import { TouchableOpacity } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { registerStep5, clean, logout } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import { Modal, PaperProvider, Button, Text, Portal } from "react-native-paper";
import { Permissions } from "expo";

export default function VideoScreen({ navigation }) {
  const backendAdress = "https://backend-together-mvp.vercel.app";
  const dispatch = useDispatch();
  const formData = new FormData();
  const user = useSelector((state) => state.user.value);
  const [visible, setVisible] = useState(false);
  const [permissionVisible, setPermissionVisible] = useState(true);

  // camera states
  const [type, setType] = useState(CameraType.back);
  const isFocused = useIsFocused();
  const containerStyle = {
    padding: 40,
    margin: 30,
    borderRadius: 10,
    backgroundColor: "#F9F0FB",
  };
  const [video, setVideo] = useState(null);
  const [randomNumbers, setRandomNumbers] = useState(null);

  useEffect(() => {
    generateRandomNumbers();
    // const getAudioPermission = async () => {
    //   const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    //   if (status !== 'granted') {
    //     console.log('Audio permission not granted');
    //   }
    // };

    // getAudioPermission();
  }, []);

  useEffect(() => {
    if (video) {
      formData.append("video", {
        uri: video,
        name: `video.mov`,
        type: "video/mov",
      });

      console.log("video mise a jour", video);
      fetch(`${backendAdress}/users/uploadVideo`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("data", data);
          if (data.result) {
            dispatch(registerStep5({ validationVideo: data.url }));
            setVisible(true);
          } else {
            alert("Something went wrong");
          }
        });
      setVideo(null);
    }
  }, [video]);

  const generateRandomNumbers = () => {
    const numbers = Array.from(
      { length: 5 },
      () => Math.floor(Math.random() * 10) + 1
    );
    setRandomNumbers(numbers);
  };

  console.log("====================================");
  console.log(video);
  console.log("====================================");

  let cameraRef = useRef(null);
  // take the video

  const recordVideo = async () => {
    if (cameraRef) {
      try {
        const videoRecordPromise = await cameraRef.current.recordAsync();
        // console.log("====================================");
        console.log("videoRecordPromise", videoRecordPromise.uri);
        // console.log("====================================");
        setVideo(videoRecordPromise.uri);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handlePictures = () => {
    if (cameraRef) {
      cameraRef.current.stopRecording();

      // send video to server
      // fetch(`http://192.168.10.192:3000/users/uploadVideo`, {
      //   method: "POST",
      //   body: formData,
      // })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     if (data.result) {
      //       dispatch(registerStep5({ validationVideo: data.url }));
      //       setVisible(true);
      //     } else {
      //       alert("Something went wrong");
      //     }
      //   });
    }
  };

  // if the user don't want to take a video

  const handleNo = () => {
    dispatch(clean());
    dispatch(registerStep5({ validationVideo: null }));
    navigation.navigate("MyProfile");
  };

  const modal = (
    <Modal visible={permissionVisible} contentContainerStyle={containerStyle}>
      <Text>
        We'll need to verify your identity before you can use the app. Would you
        like to finish the process now ? You'll need to read the numbers on the
        screen while taking a video of yourself. If not, you will be able to do
        it later but you won't be able to use the app.
      </Text>
      <View style={styles.modalBtn}>
        <Button onPress={handleNo} style={styles.noBtn}>
          {" "}
          <Text style={styles.textBtn}>No</Text>
        </Button>
        <Button
          onPress={() => {
            setPermissionVisible(false);
            dispatch(clean());
          }}
          style={styles.yesBtn}
        >
          <Text style={styles.textBtn}>Yes</Text>
        </Button>
      </View>
    </Modal>
  );

  // if the user took a video and want to leave the app waiting for the admin to validate his identity

  const handleLogOut = () => {
    dispatch(logout());
    setStep("landing");
    dispatch(clean());
  };

  // if the user took a video and want to go to the profile

  const handleSeeProfile = () => {
    fetch(`${backendAdress}/users/grantAccess`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: user.token,
        validationVideo: user.validationVideo,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(clean());
          navigation.navigate("MyProfile");
        } else {
          alert("Something went wrong");
        }
      });
  };

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
            {randomNumbers &&
              randomNumbers.map((number) => (
                <Text style={styles.randomNumber}>{number}</Text>
              ))}
          </View>

          <View style={styles.snapButton}>
            <TouchableOpacity onPress={() => cameraRef && recordVideo()}>
              <FontAwesome name="circle-thin" size={95} color="pink" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePictures()}>
              <FontAwesome name="circle" size={85} color="red" />
            </TouchableOpacity>
            {modal}
            <Modal visible={visible} contentContainerStyle={containerStyle}>
              <Text style={styles.textModal}>You've done it! 🎊</Text>
              <Text style={styles.textModal}>
                An admin will check your identity soon!
              </Text>
              <View style={styles.modalBtn}>
                <Button style={styles.validateBtn} onPress={handleSeeProfile}>
                  <Text style={styles.textBtn}>See my profile</Text>
                </Button>
                <Button style={styles.noBtn} onPress={handleLogOut}>
                  <Text style={styles.textBtn}>Log Out</Text>
                </Button>
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
    color: "#350040",
    alignSelf: "center",
    fontSize: 16,
  },
  validateBtn: {
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9E15B8",
    borderRadius: 50,
  },
  textBtn: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter",
  },
  randomNumberText: {
    color: "black",
    fontSize: 800,
    fontFamily: "Inter",
    marginTop: 20,
    marginBottom: 20,
  },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 20,
    width: "100%",
  },
  randomNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    height: 100,
    marginTop: 100,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  randomNumberText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  noBtn: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FB8C7C",
    borderRadius: 50,
  },
  yesBtn: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9E15B8",
    borderRadius: 50,
  },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 20,
    width: "100%",
  },
  textBtn: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter",
  },
});
