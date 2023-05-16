import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import Voice from "@react-native-voice/voice";
import { RNCamera } from "react-native-camera";

export default function SpeechRecognitionScreen() {
  const [results, setResults] = useState([]); // State for storing speech recognition results
  const [isListening, setIsListening] = useState(false); // State for tracking if speech recognition is active
  const [randomNumbers, setRandomNumbers] = useState([]); // State for storing random numbers
  const cameraRef = useRef(null); // Reference to the RNCamera component

  useEffect(() => {
    generateRandomNumbers(); // Generate random numbers when component mounts
  }, []);

  useEffect(() => {
    const onSpeechResults = (e) => {
      setResults(e.value ?? []); // Update the speech recognition results state
      compareResults(e.value ?? []); // Compare the spoken results with random numbers
    };
    const onSpeechError = (e) => {
      console.error(e); // Log any speech recognition errors
    };
    Voice.onSpeechError = onSpeechError; // Set the error event handler for speech recognition
    Voice.onSpeechResults = onSpeechResults; // Set the results event handler for speech recognition

    return function cleanup() {
      Voice.destroy().then(Voice.removeAllListeners); // Clean up speech recognition when the component unmounts
    };
  }, []);

  const generateRandomNumbers = () => {
    const numbers = [];
    for (let i = 0; i < 5; i++) {
      const randomNum = Math.floor(Math.random() * 100);
      numbers.push(randomNum);
    }
    setRandomNumbers(numbers); // Set the random numbers state
  };

  const compareResults = (spokenResults) => {
    spokenResults.forEach((spokenResult) => {
      randomNumbers.forEach((randomNumber, index) => {
        if (spokenResult.includes(randomNumber.toString())) {
          // Do something when a spoken number matches a random number
          console.log(`Spoken result ${spokenResult} matches random number ${randomNumber}`);
        }
      });
    });
  };

  const toggleListening = async () => {
    try {
      if (isListening) {
        await Voice.stop(); // Stop speech recognition
        setIsListening(false); // Update the isListening state
      } else {
        setResults([]); // Clear the speech recognition results
        await Voice.start("en-US"); // Start speech recognition with the specified locale
        setIsListening(true); // Update the isListening state
      }
    } catch (e) {
      console.error(e); // Log any errors that occur during speech recognition
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera ref={cameraRef} style={styles.camera} />

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