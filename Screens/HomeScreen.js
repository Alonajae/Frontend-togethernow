import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
// import { useDispatch } from 'react-redux';
import Signin from '../components/accueil/Signin';
import Signup from '../components/accueil/SignUp';
import { Button } from 'react-native-paper';

export default function HomeScreen({navigation}) {

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

  const handleNavigation = () => {
    navigation.navigate('TakePicture');
  };

  return (
    <ImageBackground source={require('../assets/CityLogo.png')} style={styles.background}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        {step === 'landing' && (
          <View style={styles.landingpage}>

            <Text style={styles.title}>Together Now</Text>
            <Button style={styles.button} onPress={handlePressSignin} mode="contained">
              <Text style={styles.textButton}>Sign in</Text>
            </Button>
            <Button style={styles.buttonUp} onPress={handlePressSignup} mode="outlined">
              <Text style={styles.textButton}>Sign up</Text>
            </Button>
          </View>
        )}
        {step === 'signup1' && <Signup step={handlePressSignup2} signup2={state2} />}
        {step === 'signup2' && <Signup step={handleNavigation} signup2={state2} />}
        {step === 'signin' && <Signin step={handlePressSignin} />}
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  background: {
    position: 'absolute',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
    resizeMode: 'cover',
  },
  landingpage: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }
  ,
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
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
  // imageEllipse: {
  // backgroundColor: 'pink',
  // },
});
