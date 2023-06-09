import { useState } from "react";
import { TextInput, Button, ProgressBar, MD3Colors, List } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  PaperProvider,
  TouchableOpacity,
} from "react-native";
import { registerStep1, registerStep2 } from "../../reducers/user";

export default function SignUp(props) {
  const dispatch = useDispatch();

  // const backendAdress = 'http://192.168.10.142:4000';
  const backendAdress = "https://backend-together-mvp.vercel.app";

  const [signUpEmail, setsignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const [passwordShown2, setPasswordShown2] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [reasons, setReasons] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [error, setError] = useState(null);
  const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const handleRegister = () => {
    // Send the registration data to verify if the email is not already in use
    if (!signUpEmail || !signUpPassword || !confirmPassword) {
      alert("Please fill all the fields")
      return;
    } else if (signUpPassword !== confirmPassword) {
      alert("Passwords don't match")
      return;
    } else if (!EMAIL_REGEX.test(signUpEmail)) {
      setError("Please enter a valid email address.")
      return;
    }

    fetch(`${backendAdress}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: signUpEmail,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.result) {
          // If the email is available for registration, store the user data in the redux store

          dispatch(
            registerStep1({
              email: signUpEmail,
              password: signUpPassword
            })
          );
          // redirect to the next step of the registration;
          props.step();
        } else {
          // If the registration failed, show an error message
          alert(data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });

  };

  const handleRegister2 = () => {
    // Verify if all the fields are filled
    if (!age || !reasons || !firstname || !lastname) {
      alert("Please fill all the fields")
    } else if (isNaN(age)) {
      // Verify if the age is a number
      alert("Please enter a valid age")
    } else {
      // If all the fields are filled, store the user data in the redux store
      dispatch(
        registerStep2({
          age: age,
          reasons: reasons,
          emergencyContact: emergencyContact,
          firstname: firstname,
          lastname: lastname,
        })
      );
      // redirect to the next step of the registration;
      props.navigate();
    };
  };

  const [expandedId, setExpandedId] = useState("");

  const handleAccordionPress = (id) => {
    setExpandedId(expandedId === id ? "" : id);
  };

  let formulaire;

  if (props.signup2) {
    // If the user is on the second step of the registration, display the second form
    formulaire = (
      <View style={styles.formulaire}>
        <View style={styles.menu}>
        <Text style={styles.title}>Create an account!</Text>
          <List.Section>
            <List.Accordion
              id="reasons"
              expanded={expandedId === "reasons"}
              onPress={() => handleAccordionPress("reasons")}
              title="Why are you using Together Now?"
              mode="outlined"
              style={styles.accordion}
            >
              <List.Item
                title="Safety Concerns"
                style={styles.listItem}
                onPress={() => {
                  setReasons("Safety Concerns")
                  setExpandedId(" ")
                }}
              />
              <List.Item
                title="Community Support"
                style={styles.listItem}
                onPress={() => {
                  setReasons("Community Support")
                  setExpandedId(" ")
                }}
              />
              <List.Item
                title="Reporting Incidents"
                style={styles.listItem}
                onPress={() => {
                  setReasons("Reporting Incidents")
                  setExpandedId(" ")
                }}
              />
              <List.Item
                title="Allies and Supportive Individuals"
                style={styles.listItem}
                onPress={() => {
                  setReasons("Allies and Supportive Individuals")
                  setExpandedId(" ")
                }}
              />
            </List.Accordion>
          </List.Section>
        </View>
        <TextInput
          style={styles.input}
          mode="outlined"
          type="text"
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Firstname"
          onChangeText={(e) => setFirstname(e)}
          value={firstname}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          type="text"
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Lastname"
          onChangeText={(e) => setLastname(e)}
          value={lastname}
        />

        <TextInput
          style={styles.input}
          mode="outlined"
          type="number"
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Age"
          onChangeText={(e) => setAge(e)}
          value={age}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          type="text"
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Emergency Contact"
          onChangeText={(e) => setEmergencyContact(e)}
          value={emergencyContact}
        />
        <View style={styles.signup} >
          <Button style={styles.signupBtnHome} onPress={() => props.setStep("landing")} mode="outlined">
            <Text style={styles.signupBtnTextBack} >Cancel</Text>
          </Button>
          <Button
            style={styles.signupBtn}
            mode="outlined"
            onPress={() => {
              handleRegister2();
            }}
          >
            <Text style={styles.signupBtnText}> Next </Text>
          </Button>
        </View>
        <View style={styles.progressBar}>
          <ProgressBar progress={0.5} color={'#9E15B8'} visible={true} />
        </View>
      </View>
    );
  } else {
    // If the user is on the first step of the registration, display the first form
    formulaire = (
      <View style={styles.formulaire}>
       <Text style={styles.title}>Create an account!</Text>
        <TextInput
          style={styles.input}
          mode="outlined"
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Email"
          onChangeText={(e) => setsignUpEmail(e)}
          value={signUpEmail}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          secureTextEntry={!passwordShown}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => {
                setPasswordShown(!passwordShown);
              }}
            />
          }
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Password"
          onChangeText={(e) => setSignUpPassword(e)}
          value={signUpPassword}
        />
        <TextInput
          style={styles.input}
          mode="outlined"
          secureTextEntry={!passwordShown2}
          right={
            <TextInput.Icon
              icon="eye"
              onPress={() => {
                setPasswordShown2(!passwordShown2);
              }}
            />
          }
          activeOutlineColor="pink"
          outlineColor="#9E15B8"
          label="Confirm Password"
          onChangeText={(e) => setConfirmPassword(e)}
          value={confirmPassword}
        />
        <Text>{error}</Text>
        <View style={styles.signup} >
          <Button style={styles.signupBtnHome} onPress={() => props.setStep("landing")} mode="outlined">
            <Text style={styles.signupBtnTextBack} >Cancel</Text>
          </Button>
          <Button
            style={styles.signupBtn}
            mode="outlined"
            onPress={() => {
              handleRegister();
            }}
          >
            <Text style={styles.signupBtnText}>Next</Text>
          </Button>
        </View>
        <View style={styles.progressBar}>
          <ProgressBar progress={0.25} color={'#9E15B8'} visible={true} />
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {formulaire}
    </SafeAreaView>
  );
}

{/* <Button style={styles.button} onPress={() => navigation.navigate("Home")} mode="outlined">
<Text style={styles.textButton} >Back Home</Text>
</Button> */}


const styles = StyleSheet.create({
  signup: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
  },
  signupBtn: {
    borderColor: "#9E15B8",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "15%",
  },
  signupBtnHome: {
    borderColor: "#FB8C7C",
    width: "40%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "15%",
  },
  signupBtnText: {
    color: "#9E15B8",
    fontSize: 16,
    fontWeight: "bold",
  },
  signupBtnTextBack: {
    color: "#FB8C7C",
    fontSize: 16,
  },
  container: {
    display: "flex",
    flex: 1,
  },
  formulaire: {
    height: "90%",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width * 1,
  },
  input: {
    width: "80%",
    height: 56,
    margin: 10,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  title: {
    alignSelf: "center",
    marginBottom: Dimensions.get("window").height * 0.05,
    top: 0,
    fontSize: 35,
    fontWeight: "bold",
    color: "#9E15B8",
  },
  progressBar: {
    height: 10,
    width: '60%',
    alignSelf: 'center', 
    marginTop: Dimensions.get("window").height * 0.05,
  },
  accordion: {
    marginBottom: 8,
  },
  // listItemsContainer: {
  //   width: '100%', // Adjust the width as needed
  // },
  listItem: {
    width: "80%", // Adjust the width as needed
    borderBottomColor: "#9E15B8",
    borderBottomWidth: 0.3,
    width: "90%",
    marginLeft: "5%",
    marginRight: "5%",
  },
  menu: {
    width: "80%", // Adjust the width as needed
  },
  accordion: {
    borderWidth: 1,
    borderRadius: 5,
    height: 56,
    borderColor: "#9E15B8",
    backgroundColor: "#ffffff",
  },
});
