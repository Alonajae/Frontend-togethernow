import { useState } from "react";
import { TextInput, Button, ProgressBar } from "react-native-paper";
import { useDispatch } from "react-redux";
import { View, Text, Dimensions, StyleSheet } from "react-native";
// import { redirect } from 'react-router-dom';
// import Accueil from './Accueil';

export default function Signup(props) {
  const dispatch = useDispatch();

  const [signUpEmail, setsignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");

  const handleRegister = () => {
    // Send the registration data to verify if the email is not already in use

    // fetch("http://localhost:3000/verify", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     email: signUpEmail,
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {

    // Handle the response data here

    // console.log("Response data:", data);
    // if (data.result) {
    // If the email is available for registration, store the user data in the redux store
    // dispatch(
    //   register({
    //     email: signUpEmail,
    //     password: signUpPassword,
    //     confirmPassword: confirmPassword,
    //     token: data.token,
    //   })
    // );

    // redirect to the next step of the registration;

    props.step();

    // } else {

    // If the registration failed, show an error message

    //     alert(data.message);
    //   }
    // });
  };

  const handleRegister2 = () => {
    // Store the user data in the redux store

    // If the email is available for registration, store the user data in the redux store

    // dispatch(
    //   register({
    //     gender: setGender,
    //     age: setAge,
    //     emergencyContact: setEmergencyContact,
    //     firstname: setFirstname,
    //     lastname: setLastname,
    //   })
    // );

    // // redirect to the next step of the registration;

    // //   props.step();

    // navigation.navigate('IdentityScan');
    props.navigate();
  };

  let formulaire;

  if (props.signup2) {
    formulaire = (
      <View style={styles.formulaire2}>
        <TextInput
          style={styles.input}
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          label="Firstname"
          onChangeText={(e) => setFirstname(e)}
          value={firstname}
          // color="secondary"
        />
        <TextInput
          style={styles.input}
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          label="Lastname"
          onChangeText={(e) => setLastname(e)}
          value={lastname}
          // color="secondary"
        />
        <TextInput
          style={styles.input}
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          label="Gender"
          onChangeText={(e) => setGender(e)}
          value={gender}
          // color="secondary"
        />
        <TextInput
          style={styles.input}
          mode='outlined'
          type="number"
          activeOutlineColor="pink"
          label="Age"
          onChangeText={(e) => setAge(e)}
          value={age}
          // color="secondary"
        />
        <TextInput
          style={styles.input}
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          label="Emergency Contact"
          onChangeText={(e) => setEmergencyContact(e)}
          value={emergencyContact}
          // color="secondary"
        />
              <Button
        style={styles.signupBtn}
        mode="outlined"
        onPress={() => {
          handleRegister2();
        }}
      >
        <Text style={styles.signupBtnText}> Next </Text>
      </Button>
      <ProgressBar progress={0.3} color="green" style={styles.progressBar}/>
      </View>
    );
  } else {
    formulaire = (
      <View style={styles.formulaire}>
        <TextInput
          style={styles.input}
          mode='outlined'
          activeOutlineColor="pink"
          label="Email"
          onChangeText={(e) => setsignUpEmail(e)}
          value={signUpEmail}
          theme={{

              borderColor: "#9E15B8", // Change border color here
          }}

          // color="#9E15B8"
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          secureTextEntry={!passwordShown}
          right={<TextInput.Icon icon="eye" onPress={() => { setPasswordShown(!passwordShown) }} />}
          activeOutlineColor="pink"
          label="Password"
          onChangeText={(e) => setSignUpPassword(e)}
          value={signUpPassword}
          theme={{
            colors: {
              placeholder: "#9E15B8", // Change placeholder color here
              text: "black", // Change text color here
              borderColor: "red", // Change border color here
              selectionColor: "red", // Change selection color here
            },
          }}

          // color="secondary"
        />
        <TextInput
          style={styles.input}
          mode='outlined'
          secureTextEntry={!passwordShown2}
          right={<TextInput.Icon icon="eye" onPress={() => { setPasswordShown2(!passwordShown2) }} />}
          activeOutlineColor="pink"
          label="Confirm Password"
          onChangeText={(e) => setConfirmPassword(e)}
          value={confirmPassword}
          // color="secondary"
        />
          <Button
        style={styles.signupBtn}
        mode="outlined"
        onPress={() => {
          handleRegister();
        }}
      >
        <Text style={styles.signupBtnText}> Next </Text>
      </Button>
      <ProgressBar progress={0.3} color="green" style={styles.progressBar} />
      </View>
    );
  }

  return (
    <View className={styles.registerContainer}>
        <Text style={styles.title}>Create an account</Text>
      <View className={styles.registerSection}>
        {formulaire}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  signupBtn: {
    borderColor: "#9E15B8",
    width: '80%',
    justifyContent: "center",
    alignItems: "center",
    marginTop: '15%',
  },
  signupBtnText: {
    color: "#9E15B8",
    fontSize: 16,
    fontWeight: "bold",
  },
  formulaire: {
    alignItems: "center",
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").height * 0.5,
    borderRadius: 10,
  },
  formulaire2: {
    alignItems: "center",
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").height * 0.5,
  },
  input: {
    width: '80%',
    height: '15%',
    margin: 10,
    borderRadius: 14,
    fontSize: 18,
    borderColor: "#9E15B8",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9E15B8",
    marginTop: 10,
    alignSelf: "center",
  },
  progressBar: {
    width: '80%',
    marginTop: 10,
  }


});
