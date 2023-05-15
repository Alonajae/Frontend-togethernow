// import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, ImageBackground } from 'react-native';
// import React, { useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { login, register } from '../reducers/user';

// export default function HomeScreen() {

// const dispatch = useDispatch();

// //sign in = connexion & sign up = inscription
    
// const [signUpEmail, setSignUpEmail] = useState('');
// const [signUpPassword, setSignUpPassword] = useState('');
// const [confirmPassword, setConfirmPassword]= useState('');

// const [signInEmail, setSignInEmail] = useState('');
// const [signInPassword, setSignInPassword] = useState('');



//   const handleConnection = () => {
//     fetch('http://ip/users/signin', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ email : signInEmail, password: signInPassword }),
//     }).then(response => response.json())
//       .then(data => {
//         if (data.result) {
//           dispatch(login({ email: signInEmail, token: data.token }));
//           setSignInEmail('');
//           setSignInPassword('');
//         //   navigation.navigate('TabNavigator', { screen: 'Map' });
//         }
//       });
//   };

//   return (
//     <ImageBackground source={require('../assets/LOGO.jpg')} style={styles.background}>

//     <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

//     <View style={styles.registerContainer}>
//     <View style={styles.registerSection}>
//       <Text>Sign-up</Text>
//       <TextInput placeholder="Email" 
//         onChangeText={(value) => setSignUpEmail(value)}
//         value={signUpEmail}
//       />
//       <TextInput
//         placeholder="Password"
//         onChangeText={(value) => setSignUpPassword(value)}
//         value={signUpPassword}
//       />
//       <TextInput
//         placeholder="Confirm Password"
//         onChangeText={(value) => setSignUpPassword(value)}
//         value={signUpPassword}
//       />
//       <TouchableOpacity title="Sign up" onPress={handleRegister} > 
//       </TouchableOpacity>

//     </View>
//     <View style={styles.connectionSection}>
//       <Text>Sign-in</Text>
//       <TextInput
//         placeholder="Email"
//         onChangeText={(value) => setSignInEmail(value)}
//         value={signInEmail}
//       />
//       <TextInput
//         placeholder="Password"
//         onChangeText={(value) => setSignInPassword(value)}
//         value={signInPassword}
//       />
//       <TouchableOpacity  title="Sign in" onPress={handleConnection} >
//       </TouchableOpacity>
      
//     </View>
//   </View>

//   </KeyboardAvoidingView>
//   </ImageBackground>
//   )
// }

