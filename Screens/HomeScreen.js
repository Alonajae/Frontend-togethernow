import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
} from 'react-native';
// import { useDispatch } from 'react-redux';
import Signin from '../components/accueil/Signin';
import SignUp from '../components/accueil/SignUp';
import { Button } from 'react-native-paper';

export default function HomeScreen({ navigation }) {

  const [step, setStep] = useState('landing');
  const [state2, setState2] = useState(false);

  // Get to the connection step
  const handlePressSignin = () => {
    setStep('signin');
  };

  // Get to the first step of the registration
  const handlePressSignup = () => {
    setStep('signup1');
  };

  // Get to the second step of the registration
  const handlePressSignup2 = () => {
    setStep('signup2');
    setState2(true);
  };

  // Get to the camera screen
  const handleNavigation = () => {
    navigation.navigate('TakePicture');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {step === 'landing' && (
        <View style={styles.landingpage}>
          <Image source={require('../assets/EllipseHome.png')} style={styles.ellipse} />

          <Text style={styles.title}>Together Now</Text>
          <Button style={styles.button} onPress={handlePressSignin} mode="contained">
            <Text style={styles.textButton}>Sign in</Text>
          </Button>
          <Button style={styles.buttonUp} onPress={handlePressSignup} mode="outlined">
            <Text style={styles.textButtonUp}>Sign up</Text>
          </Button>
        </View>
      )}
      {step === 'signup1' && <SignUp step={handlePressSignup2} signup2={state2} navigate={handleNavigation} />}
      {step === 'signup2' && <SignUp step={handlePressSignup2} signup2={state2} navigate={handleNavigation} />}
      {step === 'signin' && <Signin step={handlePressSignin} />}
      <Image source={require('../assets/CityLogo.png')} style={styles.city} /> 
    </KeyboardAvoidingView>
  );
}
  //merci de ne pas supprimer la ligne 61 ni de la modifier, cela a tout fait sauter



const styles = StyleSheet.create({

  background: {
    position: 'absolute',
    bottom: 0,
    height: '25%',
    width: '100%',
  },
  landingpage: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },

  title: {
    fontFamily: 'Jomhuria',
    color: '#350040',
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

  textButtonUp: {
    fontFamily: 'Inter',
    fontWeight: '600',
    color: '#350040',
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
  ellipse: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '65%',
    width: '100%',
  },
  city: {
    position: 'absolute',
    bottom: 0,
    height: '25%',
    width: '100%',
  },
});
