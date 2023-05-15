import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useDispatch } from "react-redux";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { register } from '../reducers/user';
import { NavigationContainer } from '@react-navigation/native';
// import { redirect } from 'react-router-dom';
// import Accueil from './Accueil';

function Signup(props, { navigation }) {
  const dispatch = useDispatch();

  const [signUpEmail, setsignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const handleRegister = () => {
    // Send the registration data to verify if the email is not already in use
    fetch("http://localhost:3000/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signUpEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here
        console.log("Response data:", data);
        if (data.result) {
          // If the email is available for registration, store the user data in the redux store
          dispatch(
            register({
              email: signUpEmail,
              password: signUpPassword,
              confirmPassword: confirmPassword,
              token: data.token,
            })
          );
          // redirect to the next step of the registration;
          props.step();
        } else {
          // If the registration failed, show an error message
          alert(data.message);
        }
      });
  };

  const handleRegister2 = () => {
    // Store the user data in the redux store
    fetch("http://localhost:3000/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        // email: signUpEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data here
        console.log("Response data:", data);
        if (data.result) {
          // If the email is available for registration, store the user data in the redux store
          dispatch(
            register({
                gender: setGender,
                age: setAge,
                emergencyContact: setEmergencyContact,
                firstname: setFirstname,
                lastname: setLastname,
            })
          );
          // redirect to the next step of the registration;
        //   props.step();
         navigation.navigate('IdentityScan');

        } else {
          // If the registration failed, show an error message
          alert(data.message);
        }
      });
  };

  let button;
  let formulaire;

  if (props.signup2) {
    formulaire = (
      <View>
        <Text>Sign-up</Text>
        <br></br>
        <TextField
          type="text"
          placeholder="firstname"
          id="signUpfirstname"
          onChange={(e) => setFirstname(e.target.value)}
          value={firstname}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <br></br>
        <TextField
          type="text"
          placeholder="Lastname"
          id="lastname"
          onChange={(e) => setLastname(e.target.value)}
          value={lastname}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <TextField
          type="text"
          placeholder="gender"
          id="gender"
          onChange={(e) => setGender(e.target.value)}
          value={gender}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <TextField
          type="text"
          placeholder="age"
          id="age"
          onChange={(e) => setAge(e.target.value)}
          value={age}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
         <TextField
          type="text"
          placeholder="emergencyContact"
          id="emergencyContact"
          onChange={(e) => setEmergencyContact(e.target.value)}
          value={emergencyContact}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
      </View>
    );
    button = (
      <Button
        className={styles.signupBtn}
        variant="contained"
        sx={{
          backgroundColor: "#F561E1",
          color: "#ffffff",
          fontSize: 18,
          width: 200,
          "&:hover": {
            backgroundColor: "#B086AA",
            cursor: "pointer",
          },
        }}
        onPress={() => {
          handleRegister();
        }}
      >
        Next
      </Button>
    );
  } else {
    formulaire = (
      <View>
        <Text>Sign-up</Text>
        <br></br>
        <TextField
          type="text"
          placeholder="email"
          id="signUpEmail"
          onChange={(e) => setsignUpEmail(e.target.value)}
          value={signUpEmail}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <br></br>
        <TextField
          type="password"
          placeholder="Password"
          id="signUpPassword"
          onChange={(e) => setSignUpPassword(e.target.value)}
          value={signUpPassword}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <TextField
          type="confirmPassword"
          placeholder="Confirm Password"
          id="confirmPassword"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
      </View>
    );
    button = (
      <Button
        className={styles.signupBtn}
        variant="contained"
        sx={{
          backgroundColor: "#F561E1",
          color: "#ffffff",
          fontSize: 18,
          width: 200,
          "&:hover": {
            backgroundColor: "#B086AA",
            cursor: "pointer",
          },
        }}
        onPress={() => {
          handleRegister2();
        }}
      >
        Next
      </Button>
    );
  }

  return (
    <View className={styles.registerContainer}>
      <View className={styles.registerSection}>
        {formulaire}
        <br></br>
        {button}
      </View>
    </View>
  );
}

export default Signup;

// test