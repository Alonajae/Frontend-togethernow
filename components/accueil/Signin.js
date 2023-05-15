import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ImageBackground } from 'react-native';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

export default function Signin() {

const dispatch = useDispatch();

//sign in = connexion & sign up = inscription
    

const [signInEmail, setSignInEmail] = useState('');
const [signInPassword, setSignInPassword] = useState('');


// const [email, setEmail] = useState('');
const [emailError, setEmailError] = useState(false);

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const handleSubmit = () => {
    if (EMAIL_REGEX.test(email)) {
      navigation.navigate('TabNavigator', { screen: 'MapScreen' });
    } else {
      setEmailError(true);
    }
  };


  const handleConnection = () => {
    fetch('http://localhost:3000/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email : signInEmail, password: signInPassword }),
    }).then(response => response.json())
      .then((data) => {
        if (data.result) {
          dispatch(login({ email: signInEmail, token: data.token }));
          setSignInEmail('');
          setSignInPassword('');
        }
        else {
            // If the registration failed, show an error message
            alert(data.message);
          }
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch request
          console.error("Error occurred:", error);
          // Show an error message to the user
          alert("An error occurred while trying to register. Please try again later.");
        });
      };


  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

    <View style={styles.registerContainer}>
    <View style={styles.connectionSection}>
      <Text>Sign-in</Text>
      <TextInput
        placeholder="Email"
        onChangeText={(value) => setSignInEmail(value)}
        value={signInEmail}
      />
      <TextInput
        placeholder="Password"
        onChangeText={(value) => setSignInPassword(value)}
        value={signInPassword}
      />
      <TouchableOpacity  title="Sign in" onPress={handleConnection} >
      </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSubmit()} style={styles.button} activeOpacity={0.8}>
            <Text style={styles.textButton}>Go to Map</Text>
          </TouchableOpacity>

    </View>
  </View>

  </KeyboardAvoidingView>
  )
}

