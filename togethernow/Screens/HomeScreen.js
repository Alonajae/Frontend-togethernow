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
import { login } from '../reducers/user';
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
                <TouchableOpacity style={styles.button} onPress={handlePressSignup}>
                  <Text style={styles.textButton}>Sign up</Text>
                </TouchableOpacity>
              </View>
            )}
            {step === 'signup1' && <SignUp step={handlePressSignup2} signup2={state2} />}    {/* signup2={state2} is a prop step={handlePressSignup2} is a prop  --> nous permet */}
            {step === 'signup2' && <SignUp step={handlePressSignup2} signup2={state2}/>}  {/* signup2={state2} is a prop step={handlePressSignup2} is a prop */}
            {step === 'signin' && <Signin step={handlePressSignin} />}  {/* step={handlePressSignin} is a prop */}
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
    fontSize: 40,
    fontWeight: '600',
    fontFamily: 'Futura',
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
    backgroundColor: '#fbe29c',
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
