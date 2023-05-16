import { useState } from "react";
import { TextInput, Button } from "react-native-paper";
import { useDispatch } from "react-redux";
import { View, Text, Dimensions, StyleSheet } from "react-native";
// import { redirect } from 'react-router-dom';
// import Accueil from './Accueil';

export default function Signup(props, { navigation }) {
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
  };

  let button;
  let formulaire;

  if (props.signup2) {
    formulaire = (
      <View>
        <Text>Sign-up</Text>
        <TextInput
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          label="Firstname"
          onChangeText={(e) => setFirstname(e)}
          value={firstname}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <TextInput
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          label="Lastname"
          onChangeText={(e) => setLastname(e)}
          value={lastname}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <TextInput
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          label="Gender"
          onChangeText={(e) => setGender(e)}
          value={gender}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <TextInput
          mode='outlined'
          type="number"
          activeOutlineColor="pink"
          label="Age"
          onChangeText={(e) => setAge(e)}
          value={age}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <TextInput
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          label="Emergency Contact"
          onChangeText={(e) => setEmergencyContact(e)}
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
        <TextInput
          mode='outlined'
          type="email"
          activeOutlineColor="pink"
          label="Email"
          onChangeText={(e) => setsignUpEmail(e)}
          value={signUpEmail}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />

        <TextInput
          mode='outlined'
          type="password"
          activeOutlineColor="pink"
          label="Password"
          onChangeText={(e) => setSignUpPassword(e)}
          value={signUpPassword}
          color="secondary"
          sx={{ backgroundColor: "#FDF6D0", borderColor: "#ECC4D0" }}
        />
        <TextInput
          mode='outlined'
          type="password"
          activeOutlineColor="pink"
          label="Confirm Password"
          onChangeText={(e) => setConfirmPassword(e)}
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
        {button}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#FDF6D0",
  },
  registerSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FDF6D0",
    width: 400,
    height: 500,
    borderRadius: 10,
    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
  },
  signupBtn: {
    backgroundColor: "#F561E1",
    color: "#ffffff",
    fontSize: 18,
    width: 200,
    "&:hover": {
      backgroundColor: "#B086AA",
      cursor: "pointer",
    },
  },
});
