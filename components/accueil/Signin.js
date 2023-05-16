import { View, Text, TouchableOpacity, KeyboardAvoidingView, ImageBackground, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../reducers/user'

export default function Signin() {

  const dispatch = useDispatch();

  //sign in = connexion & sign up = inscription

  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [passwordShown, setPasswordShown] = useState(false);
  const [error, setError] = useState(null);

  const backendAdress = 'localhost:3000';

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleSubmit = () => {
    if (EMAIL_REGEX.test(email)) {
      navigation.navigate('TabNavigator', { screen: 'MapScreen' });
    } else {
      setEmailError(true);
    }
  };

  // Function to handle the connection

  const handleConnection = () => {

    // Check if the email and password are not empty

    if (signInEmail === '' || signInPassword === '') {
      setError("Please enter your email and password.");
      return;
    } else if (!EMAIL_REGEX.test(email)) {
      // Check if the email is valid

      setError("Please enter a valid email address.");
      return;
    }

    // Send the connection data to the server

    fetch(`http://${backendAdress}/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: signInEmail, password: signInPassword }),
    }).then(response => response.json())
      .then((data) => {
        if (data.result) {

          // If the registration was successful, update the user's infos in the Redux store
          
          const infos = {
            email: signInEmail,
            token: data.user.token,
            firstname: data.user.firstname,
            lastname: data.user.lastname,
            age: data.user.age,
            genre: data.user.genre,
            emergencyContact: data.user.emergencyContact,
            inscriptionDate: data.user.inscriptionDate,
            profilePicture: data.user.profilePicture,
          };
          dispatch(login(infos));
          setSignInEmail('');
          setSignInPassword('');
        }
        else {
          
          // If the registration failed, show an error message

          setError(data.error);
        }
      })
  };


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.registerContainer}>
        <View style={styles.connectionSection}>
          <Text>Sign-in</Text>
          <TextInput
            style={styles.input}
            label="Email"
            mode='outlined'
            onChangeText={(value) => setSignInEmail(value)}
            value={signInEmail}
          />
          <TextInput
            style={styles.input}
            label="Password"
            mode='outlined'
            secureTextEntry={!passwordShown}
            right={<TextInput.Icon icon="eye" onPress={() => { setPasswordShown(!passwordShown) }} />}
            onChangeText={(value) => setSignInPassword(value)}
            value={signInPassword}
          />
          <TouchableOpacity title="Sign in" onPress={handleConnection} >
          </TouchableOpacity>
          <Button style={styles.button} onPress={handleConnection} mode="outlined">
              <Text style={styles.textButton}>Sign up</Text>
            </Button>
          <Text>{error}</Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  registerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionSection: {
    width: '80%',
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  textButton: {
    color: '#fff',
    fontSize: 20,
  },
});

