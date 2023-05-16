import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground
} from 'react-native';
// import { useDispatch } from 'react-redux';
import Signin from '../components/accueil/Signin';
import SignUp from '../components/accueil/SignUp';
import { Button } from 'react-native-paper';

export default function HomeScreen() {

  const [step, setStep] = useState('landing');
  const [state2, setState2] = useState(false);

  const handlePressSignin = () => {
    setStep('signin');
  };

  const handlePressSignup = () => {
    setStep('signup1');
  };

  const handlePressSignup2 = () => {
    setStep('signup2');
    setState2(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <ImageBackground source={require('../assets/CityLogo.png')} style={styles.imageCity}>
        {step === 'landing' && (
          <View style={styles.container}>
            
            <Text style={styles.title}>Together Now</Text>
            <Button style={styles.button} onPress={handlePressSignin} mode="contained">
              <Text style={styles.textButton}>Sign in</Text>
            </Button>
            <Button style={styles.buttonUp} onPress={handlePressSignup} mode="outlined">
              <Text style={styles.textButton}>Sign up</Text>
            </Button>
          </View>
        )}
        {step === 'signup1' && <SignUp step={handlePressSignup2} signup2={state2} />}
        {step === 'signup2' && <SignUp step={handlePressSignup2} signup2={state2} />}
        {step === 'signin' && <Signin step={handlePressSignin} />}
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  background: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '50%',
  },
  title: {
    fontFamily: 'Jomhuria',
    fontSize: 150,
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 110,
    textAlign: 'center',
    marginBottom: 50,
  },
  inputContainer: {
    width: '85%',
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 1,
  },
  input: {
    width: '100%',
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    fontSize: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#9E15B8',
    width: 227,
    height: 44,
    // borderRadius: 1,
  },
  buttonUp: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#9E15B8',
    width: 227,
    height: 44,
    marginTop: 30,

  },
  textButton: {
    fontFamily: 'Inter',

    fontWeight: '600',

  },
  error: {
    marginTop: 10,
    color: 'red',
  },
  imageCity: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    width: 400,
    height: 400,
    margin: 0,
    padding: 0,
  },
  // imageEllipse: {
  // backgroundColor: 'pink',
  // },
});
