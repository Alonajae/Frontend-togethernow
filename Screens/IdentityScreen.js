import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { Camera } from "expo-camera";

export default function SpeechRecognitionScreen() {
  const [results, setResults] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const cameraRef = useRef(null);

  useEffect(() => {
    generateRandomNumbers();
  }, []);

  useEffect(() => {
    const onSpeechResults = ({ value }) => {
      setResults(value ?? []);
      compareResults(value ?? []);
    };

    const startSpeechRecognition = async () => {
      try {
        Speech.stop();
        setResults([]);
        await Speech.startListeningAsync();
        setIsListening(true);
      } catch (error) {
        console.error(error);
      }
    };

    const stopSpeechRecognition = async () => {
      try {
        await Speech.stopListeningAsync();
        setIsListening(false);
      } catch (error) {
        console.error(error);
      }
    };

    Speech.addListener(onSpeechResults);

    return () => {
      Speech.stop();
      Speech.removeAllListeners();
    };
  }, []);

  const generateRandomNumbers = () => {
    const numbers = [];
    for (let i = 0; i < 5; i++) {
      const randomNum = Math.floor(Math.random() * 100);
      numbers.push(randomNum);
    }
    setRandomNumbers(numbers);
  };

  const compareResults = (spokenResults) => {
    spokenResults.forEach((spokenResult) => {
      randomNumbers.forEach((randomNumber, index) => {
        if (spokenResult.includes(randomNumber.toString())) {
          console.log(`Spoken result ${spokenResult} matches random number ${randomNumber}`);
        }
      });
    });
  };

  const toggleListening = () => {
    if (isListening) {
      stopSpeechRecognition();
    } else {
      startSpeechRecognition();
    }
  };

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} ref={cameraRef} />

      <View style={styles.overlay}>
        <Text style={styles.overlayText}>Press the button and start speaking.</Text>
        <Button
          title={isListening ? "Stop Recognizing" : "Start Recognizing"}
          onPress={toggleListening}
        />
        <Text style={styles.overlayText}>Results:</Text>
        {results.map((result, index) => (
          <Text key={`result-${index}`}>{result}</Text>
        ))}
        <Text style={styles.overlayText}>Random Numbers:</Text>
        {randomNumbers.map((number, index) => (
          <Text key={`number-${index}`}>{number}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayText: {
    color: "#FFF",
    fontSize: 16,
    marginBottom: 8,
  },
});



// import { View, Text } from 'react-native'
// import React from 'react'
// import { Camera, CameraType } from 'expo-camera'
// import { useState, useEffect, useRef } from 'react'
// import { TouchableOpacity } from 'react-native'
// import { Ionicons } from '@expo/vector-icons'
// import { useDispatch } from 'react-redux'
// import { useIsFocused } from '@react-navigation/native'

// export default function IdentityScreen ({ navigation }) {

//   // camera states
//   const [hasPermission, setHasPermission] = useState(null)
//   const [type, setType] = useState(CameraType.back);
//   const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
//   const [camera, setCamera] = useState(null)
//   const isFocused = useIsFocused();
//   const dispatch = useDispatch();

//   let cameraRef = useRef(null);

//   // ask for permission
//   useEffect(() => {
//     (async () => {
//       const { status } = await Camera.requestCameraPermissionsAsync();
//       setHasPermission(status === 'granted');
//     })()
//   }, [])

//   // take the picture
//   const takePicture = async () => {
//     const photo = await cameraRef.takePictureAsync({ quality: 0.3 });
//     console.log(photo.width, photo.height);
//     console.log(photo.uri);
//     // store the picture in redux
//   }

//   // if no permission, return empty view
//   if (!hasPermission || !isFocused) {
//     return <View></View>;
//   }


//   return (
//     <Camera type={type} ref={(ref) => cameraRef = ref}>
//       <Button
//         title="Flip"
//         onPress={() => setType(type === CameraType.back ? CameraType.front : CameraType.back)}
//       />
//       <Button title="Snap" onPress={() => takePicture()} />
//     </Camera>
//   )
// }