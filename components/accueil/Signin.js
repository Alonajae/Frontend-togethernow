import { View, Text, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
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

  const backendAdress = 'http://192.168.10.137:3000';

  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  // Function to handle the connection

  const handleConnection = () => {

    // Check if the email and password are not empty

    if (signInEmail === '' || signInPassword === '') {
      setError("Please enter your email and password.");
      return;
    } else if (!EMAIL_REGEX.test(signInEmail)) {
      // Check if the email is valid

      setError("Please enter a valid email address.");
      return;
    }

    // Send the connection data to the server

    fetch(`${backendAdress}/signin`, {
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
            reasons: data.user.reasons,
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
    <SafeAreaView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.registerContainer}>
        <Text style={styles.title}>Welcome Back</Text>
        <View style={styles.connectionSection}>
          <TextInput
            style={styles.input}
            label="Email"
            mode='outlined'
            outlineColor="#9E15B8"
            onChangeText={(value) => setSignInEmail(value)}
            value={signInEmail}
          />
          <TextInput
            style={styles.input}
            label="Password"
            mode='outlined'
            outlineColor="#9E15B8"
            secureTextEntry={!passwordShown}
            right={<TextInput.Icon icon="eye" onPress={() => { setPasswordShown(!passwordShown) }} />}
            onChangeText={(value) => setSignInPassword(value)}
            value={signInPassword}
          />
          <Text style={styles.error}>{error}</Text>
          <Button style={styles.button} onPress={handleConnection} mode="outlined">
          <Text style={styles.textButton}>Go</Text>
        </Button>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
  },
  registerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectionSection: {
      height: Dimensions.get('window').height * 1,
  alignItems: "center",
  justifyContent: "center",
  width: Dimensions.get("window").width * 1,
  },
  button: {
      borderColor: "#9E15B8",
  width: '80%',
  justifyContent: "center",
  alignItems: "center",
  marginTop: '15%',
  },
  textButton: {
     color: "#9E15B8",
  fontSize: 16,
  fontWeight: "bold",
  },
  input: {
  width: '80%',
  height: 56,
  margin: 10,
  fontSize: 16,
  backgroundColor: "#ffffff",

  },
  title: {
  position: 'absolute',
  alignSelf: 'center',
  marginTop: Dimensions.get('window').height * 0.15,
  top: 0,
  fontSize: 22,
  fontWeight: "bold",
  color: "#9E15B8",
},
  error: {
    color: 'red',
    fontSize: 20,
  },
});

// signupBtnText: {
//   color: "#9E15B8",
//   fontSize: 16,
//   fontWeight: "bold",
// },
// registerContainer: {  
//   display: "flex",
//   flex: 1,
// },
// formulaire: { 
//   height: '100%',
//   alignItems: "center",
//   justifyContent: "center",
//   width: Dimensions.get("window").width * 1,
// },
// input: {
//   width: '80%',
//   height: 56,
//   margin: 10,
//   fontSize: 16,
//   backgroundColor: "#ffffff",
// },

// progressBar: {
//   width: '80%',
//   marginTop: 10,
// }
