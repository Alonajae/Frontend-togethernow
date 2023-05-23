import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Button, PaperProvider, Portal, Modal,   TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useDispatch, useSelector } from "react-redux";
import { addPhoto, removePhoto } from "../reducers/user";

export default function MyProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.value);
  const containerStyle = {padding: 50, margin: 30, borderRadius: 10, backgroundColor: '#F9F0FB' };

  const [sharePositions, setSharePositions] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age);
  const [firstname, setFirstname] = useState(user.firstname);
  const [name, setName] = useState(user.lastname);
  const [profileImage, setProfileImage] = useState(user.profilePicture);
  const [visible, setVisible] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState(17);
  const [disabled, setDisabled] = useState(true);

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

  const handleEdit = () => {
    setDisabled(false);
  };

  const handleBackToMap = () => {
    navigation.navigate("Map");
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
            marginTop: 10,
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
        <Button style={styles.backMapBtn} onPress={handleBackToMap}>
          <Text style={styles.textBackBtn}>Back</Text>
        </Button>
          <Text style={styles.title}>My Profile</Text>
          <View style={styles.headerInfo}>
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
          <View style={styles.mainInfo}>
          <Text style={styles.name}>{firstname}</Text>
          <Text>Shared Routes: counter BDD</Text>
          </View>
          </View>
          <View style={styles.personalInfos}>
            <TextInput label={'Firstname:'} mode={"flat"} disabled={disabled} style={styles.input}> {firstname}</TextInput>
            <TextInput label={'Name:'} mode="flat" disabled={disabled} style={styles.input}> {name} </TextInput>
            <TextInput label={'Email:'} mode="flat" disabled={disabled} style={styles.input}>{email}</TextInput>
            <TextInput label={'Age:'} mode="flat" disabled={disabled} style={styles.input}>{age}</TextInput>
            <TextInput label={'Emergency Contact:'} mode="flat" disabled={disabled} style={styles.input}>{emergencyContact}</TextInput>
          </View>
          <View style={styles.sharePosition}>
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
          <View style={styles.btnEditHistory}>
          <Button style={styles.editBtn} onPress={handleEdit}>
          <Text style={styles.textBackBtn}>Edit</Text>
        </Button>
        <Button style={styles.historyBtn}>
          <Text style={styles.textBackBtn}>History</Text>
        </Button>
        </View>
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
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 21,
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
    width: 24,
    height: 24,
    fontSize: 16,
    color: "#9E15B8",
    backgroundColor: "pink",
  },
  personalInfos: {
    marginBottom: 10,
    marginTop: 0,
    width: "90%",
  },
  imageContainer: {
    alignSelf: "center",
    margin: 20,
    height: 300,
    width: 300,
    padding: 20,
    backgroundColor: "#F9F0FB",
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
    textAlign: 'center',
  },
  textBackBtn: {
    color: 'black',
    fontSize: 16,
    fontFamily: "Inter",
    textDecorationLine: 'underline',
  },
  backMapBtn: {
    position: 'absolute',
    top: 60,
    left: 20,
  },
  btnEditHistory: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 10,
    marginTop: '5%',
    alignItems: 'center',
  },
  name: {
    fontSize: 40,
    fontFamily: 'Jomhuria',
  },
  input: {
    height: 44,
    margin: 10,
    fontSize: 16,
    backgroundColor: "#ffffff",
  },
  sharePosition: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  }
});
