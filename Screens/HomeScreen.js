import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  ImageBackground
} from 'react-native';
// import { useDispatch } from 'react-redux';
import Signin from '../components/accueil/Signin';
import SignUp from '../components/accueil/SignUp';
import { Button } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../reducers/user';

export default function HomeScreen({ navigation }) {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);

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

  const handleSignout = () => {
    dispatch(logout());
    setStep('landing');
  };

  // Go to the map screen or the profile screen if the access is granted

  const handleAccess = () => {
    if (user.token && user.accessGranted) {
      navigation.navigate('Map');
    } else if (user.token && !user.accessGranted) {
      navigation.navigate('Profile');
    }
  };

  // Display the landing page or give access to the map or profile screen

  let landingpage;
  if (!user.token) {
    landingpage = (
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
    )
  } else {
    landingpage = (
      <View style={styles.landingpage}>
      <Image source={require('../assets/EllipseHome.png')} style={styles.ellipse} />
      <Text style={styles.title}>Together Now</Text>
      <Button style={styles.button} onPress={handleAccess} mode="contained">
        <Text style={styles.textButton}>Enter the App</Text>
      </Button>
      <Button style={styles.buttonUp} onPress={handleSignout} mode="outlined">
        <Text style={styles.textButtonUp}>Sign out</Text>
      </Button>
      <Text style={styles.welcome}>Welcome {user.firstname}</Text>
    </View>
    )
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      {step === 'landing' && landingpage}
      <Image source={require('../assets/CityLogo.png')} style={styles.city} /> 

      {step === 'signup1' && <SignUp step={handlePressSignup2} signup2={state2} navigate={handleNavigation} setStep={setStep} />}
      {step === 'signup2' && <SignUp step={handlePressSignup2} signup2={state2} navigate={handleNavigation}  setStep={setStep}/>}
      {step === 'signin' && <Signin navigate={handleAccess}  setStep={setStep}/>}
    </KeyboardAvoidingView>
    
  );
}
  //merci de ne pas supprimer la ligne 61 ni de la modifier, cela a tout fait sauter

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  welcome: {
    fontFamily: 'Jomhuria',
    color: 'black',
    fontSize: 40,
    fontWeight: '400',
    marginBottom: 10,
    textAlign: 'center',
  },
});
