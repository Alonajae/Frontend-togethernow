import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Button, View } from 'react-native';
import { useEffect, useState } from 'react';
import Voice from '@react-native-voice/voice';
import { View, StyleSheet, Button } from 'react-native';
import { Camera } from 'expo-camera';

/*
expo init expo-speech-to-text
cd expo-speech-to-text
expo install @react-native-voice/voice expo-dev-client

*/



export default function App() {

    // const video = React.useRef(null);
    // const [status, setStatus] = React.useState({});
    // let [started, setStarted] = useState(false);
    // let [results, setResults] = useState([]);


  const recordVideo = async () => {
    if (cameraRef.current) {
      try {
        const videoRecordPromise = cameraRef.current.recordAsync();
        if (videoRecordPromise) {
          setIsVideoRecording(true);
          const data = await videoRecordPromise;
          const source = data.uri;
          if (source) {
            setIsPreview(true);
            console.log("video source", source);
            setVideoSource(source);
          }
        }
      } catch (error) {
        console.warn(error);
      }
    }
  };


//   useEffect(() => {
//     Voice.onSpeechError = onSpeechError;
//     Voice.onSpeechResults = onSpeechResults;

//     return () => {
//       Voice.destroy().then(Voice.removeAllListeners);
//     }
//   }, []);

//   const startSpeechToText = async () => {
//     await Voice.start("en-NZ");
//     setStarted(true);
//   };

//   const stopSpeechToText = async () => {
//     await Voice.stop();
//     setStarted(false);
//   };

//   const onSpeechResults = (result) => {
//     setResults(result.value);
//   };

//   const onSpeechError = (error) => {
//     console.log(error);
//   };

  return (
        <Camera onPress={onLongPress={recordVideo}}></Camera>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


// export default function App() {

      {/* {!started ? <Button title='Start Speech to Text' onPress={startSpeechToText} /> : undefined}
      {started ? <Button title='Stop Speech to Text' onPress={stopSpeechToText} /> : undefined}
      {results.map((result, index) => <Text key={index}>{result}</Text>)}
      <StatusBar style="auto" /> */}
    // </View>
