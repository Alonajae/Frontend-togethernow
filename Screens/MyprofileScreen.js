import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Button, PaperProvider, Portal, Modal } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { KeyboardAvoidingView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { addPhoto, removePhoto } from "../reducers/user";

export default function MyProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const containerStyle = { padding: 20, margin: 30, borderRadius: 10, backgroundColor: '#F9F0FB' };

  const [sharePositions, setSharePositions] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age);
  const [firstname, setFirstname] = useState(user.firstname);
  const [name, setName] = useState(user.lastname);
  const [profileImage, setProfileImage] = useState(user.profilePicture);
  const [visible, setVisible] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState(17);

  useEffect(() => {
    (async () => {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You have to allow the app to access your camera roll.");
      }
    })();
  }, []);

  if (emergencyContact != 17) {
    setEmergencyContact(user.emergencyContact);
  }

  const handleSharePosition = () => {
    setSharePositions(!sharePositions);
  };

  const toggleSwitch = () => {
    setSharePositions((previousState) => !previousState);
  };

  const handleImageUpload = async () => {
    setVisible(true);
  };

  const pickImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!_image.cancelled) {
      dispatch(addPhoto(_image.assets[0].uri));
      setVisible(false);
    }
  };

  let modal = (
    <Modal visible={visible} contentContainerStyle={containerStyle} transparent={true}>
      <Text style={styles.textModal}>Update your profile picture 📸</Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: user.profilePicture }}
          style={{
            width: 250,
            height: 250,
            marginTop: 20,
            borderRadius: "500%",
          }}
        />
      </View>
      <View style={styles.modalBtn}>
        <Button onPress={pickImage} style={styles.validateBtn}>
          <Text style={styles.textBtn}>Change</Text>
        </Button>
        <Button style={styles.backBtn} onPress={() => setVisible(false)}>
          <Text style={styles.textBtn}>Cancel</Text>
        </Button>
      </View>
    </Modal>
  );

  return (
    <PaperProvider>
      <Portal>
        <View style={styles.container}>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity
            style={styles.profileImageContainer}
            onPress={handleImageUpload}
          >
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profileImage}
            />

            <Button style={styles.uploadText}>+</Button>
          </TouchableOpacity>
          <TextInput>{firstname}</TextInput>
          <Text>Shared Routes:</Text>
          <Text>counter avec la BDD</Text>
          <View style={styles.personalInfos}>
            <Text style={styles.subtitle}>Personal Informations</Text>
            <TextInput>Firstname: {firstname}</TextInput>
            <TextInput>Name: {name}</TextInput>
            <TextInput>Email: {email}</TextInput>
            <TextInput>Age: {age}</TextInput>
            <TextInput>Emergency Contact: {emergencyContact}</TextInput>
          </View>
          <View>
            <Text>Share my position:</Text>
            <Switch
              trackColor={{ false: "FB8C7C", true: "#9E15B8" }}
              thumbColor={sharePositions ? "#9E15B8" : "#FB8C7C"}
              ios_backgroundColor="white"
              onValueChange={toggleSwitch}
              value={sharePositions}
            />
          </View>
          {modal}
        </View>
      </Portal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: "left",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadText: {
    fontSize: 16,
    color: "#9E15B8",
    backgroundColor: "pink",
  },
  personalInfos: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "regular",
    marginBottom: 10,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    height: 300,
    width: 300,
  },
  backBtn: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FB8C7C",
    borderRadius: 50,
  },
  validateBtn: {
    width: 100,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#9E15B8",
    borderRadius: 50,
  },
  modalBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingTop: 20,
    width: "100%",
  },
  textBtn: {
    color: "white",
    fontSize: 16,
    fontFamily: "Inter",
  },
  textModal: {
    color: "#350040",
    fontSize: 16,
    fontFamily: "Inter",
  },
  
});
