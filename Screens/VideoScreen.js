import React, { useState, useEffect, useRef } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import * as Speech from "expo-speech";
import { Camera } from "expo-camera";

export default function VideoScreen({ navigation }) {
  
  const [results, setResults] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [randomNumbers, setRandomNumbers] = useState([]);
  const cameraRef = useRef(null);

  // 
  const onSpeechResults = (value) => {
    setResults(value ?? []);
    compareResults(value ?? []);
  };
  // 
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

  useEffect(() => {
    generateRandomNumbers();
  }, []);

  useEffect(() => {
    Speech.addListener(onSpeechResults);

    return () => {
      Speech.stop();
      Speech.removeAllListeners();
    };
  }, [randomNumbers]);

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
          <Text key={`result-${index}`}>{String(result)}</Text>
        ))}
        <Text style={styles.overlayText}>Random Numbers:</Text>
        {randomNumbers.map((number, index) => (
          <Text key={`number-${index}`}>{String(number)}</Text>
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

/*
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
    */