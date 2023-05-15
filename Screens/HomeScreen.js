import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Signin from '../components/accueil/Signin';
import SignUp from  '../components/accueil/Register';

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
    setState2(true );
  };

  return (
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            {step === 'landing' && (
              <View style={styles.container}>
                <Text style={styles.title}>Together Now</Text>
                <TouchableOpacity style={styles.button} onPress={handlePressSignin}>
                  <Text style={styles.textButton}>Sign in</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonUp} onPress={handlePressSignup}>
                  <Text style={styles.textButton}>Sign up</Text>
                </TouchableOpacity>
              </View>
            )}
            {step === 'signup1' && <SignUp step={handlePressSignup2} signup2={state2} />}
            {step === 'signup2' && <SignUp step={handlePressSignup2} signup2={state2}/>}
            {step === 'signin' && <Signin step={handlePressSignin} />}
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
    backgroundColor: 'rgba(	255, 190, 11, 0.4)'
  },
  image: {
    width: '100%',
    height: '50%',
  },
  title: {
    fontFamily: 'Jomhuria',
    fontSize: 120,
    fontWeight: '600',
    marginBottom: 20
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
    paddingTop: 8,
    width: '100%',
    marginTop: 30,
    backgroundColor: '#9E15B8',
    // borderRadius: 1,
  },
  buttonUp: {
    alignItems: 'center',
    paddingTop: 8,
    width: '100%',
    marginTop: 30,
    borderColor: '#9E15B8',
    borderRadius: 1,
  },
  textButton: {
    fontFamily: 'Futura',
    height: 30,
    fontWeight: '600',
    fontSize: 16,
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
});
