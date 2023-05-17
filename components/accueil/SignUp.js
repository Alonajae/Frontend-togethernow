import { useState } from "react";
import { TextInput, Button, ProgressBar, List } from "react-native-paper";
import { useDispatch } from "react-redux";
import { View, Text, Dimensions, StyleSheet, SafeAreaView, PaperProvider } from "react-native";
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


    const [expandedId, setExpandedId] = useState('');
  
    const handleAccordionPress = (id) => {
      setExpandedId(expandedId === id ? '' : id);
    };

  let formulaire;

  if (props.signup2) {
    formulaire = (
      <View style={styles.formulaire}>
        <TextInput
          style={styles.input}
          mode='outlined'
          type="text"
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
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
          outlineColor="#9E15B8"
          label="Lastname"
          onChangeText={(e) => setLastname(e)}
          value={lastname}
        // color="secondary"
        />
        <List.AccordionGroup style={styles.input}>
        <List.Accordion
          title="Why are you downloading the app?"
          id="reasons"
          expanded={expandedId === 'reasons'}
          onPress={() => handleAccordionPress('reasons')}
          contentContainerStyle={styles.accordionContent}
          style={styles.accordion}
        >       
          
            <List.Item title="Safety Concerns" style={styles.listItem} />
            <List.Item title="Community Support" style={styles.listItem} />
            <List.Item title="Reporting Incidents" style={styles.listItem} />
            <List.Item title="Allies and Supportive Individuals" style={styles.listItem} />
     </List.Accordion>
      </List.AccordionGroup>
        <TextInput
          style={styles.input}
          mode='outlined'
          type="number"
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
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
          outlineColor="#9E15B8"
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
        <ProgressBar progress={0.3} color="green" style={styles.progressBar} />
      </View>
    );
  } else {
    formulaire = (
      <View style={styles.formulaire}>
        <TextInput
          style={styles.input}
          mode='outlined'
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Email"
          onChangeText={(e) => setsignUpEmail(e)}
          value={signUpEmail}
        />

        <TextInput
          style={styles.input}
          mode='outlined'
          secureTextEntry={!passwordShown}
          right={<TextInput.Icon icon="eye" onPress={() => { setPasswordShown(!passwordShown) }} />}
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Password"
          onChangeText={(e) => setSignUpPassword(e)}
          value={signUpPassword}
        // color="secondary"
        />
        <TextInput
          style={styles.input}
          mode='outlined'
          secureTextEntry={!passwordShown2}
          right={<TextInput.Icon icon="eye" onPress={() => { setPasswordShown2(!passwordShown2) }} />}
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
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
    <PaperProvider>
    <SafeAreaView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Create an account</Text>
        {formulaire}
    </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({

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
  container: {  
    display: "flex",
    flex: 1,
  },
  formulaire: {
    height: '100%',
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width * 1,
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
  progressBar: {
    width: '80%',
    marginTop: 10,
  },
  accordion: {
    marginBottom: 8,
  },
  listItemsContainer: {
    width: '100%', // Adjust the width as needed
  },
  listItem: {
    width: '100%', // Adjust the width as needed
  },
});
