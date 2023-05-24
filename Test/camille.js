import { useState } from "react";
import { TextInput, Button, ProgressBar, MD3Colors, List, Modal } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
} from "react-native";
import { registerStep1, registerStep2 } from "../../reducers/user";

export default function BuddiesList() {
  
    const dispatch = useDispatch();

    const [share, setShare] = useState(false);
    const containerStyle = {
        padding: 40,
        margin: 30,
        borderRadius: 10,
        backgroundColor: "#F9F0FB",
      };

    const handleShare = () => {
        setShare(true);
    };

  let liste;

  if (share) {
    // If the user is on the second step of the registration, display the second form
    liste = (
      <View style={styles.liste}>
        <Text style={styles.title}>Buddies nearby</Text>
        {BuddiesList}
        </View>
    
    );
  } else {
    // If the user is on the first step of the registration, display the first form
    liste = (
      <View style={styles.liste}>
       <Text style={styles.title}>Your info</Text>
       <Text>Info du trajet</Text>
       <Button onPress={handleShare}><Text>Find Buddies</Text></Button>
      </View>
    );
  }

  return (
    <Modal 
        contentContainerStyle={containerStyle}
    >
      {liste}
    </Modal>
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
