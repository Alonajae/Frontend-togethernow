import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TextInput, StyleSheet, TouchableOpacity, Image, Modal, SafeAreaView } from 'react-native';
import { Button, PaperProvider, Portal } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAvoidingView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPhoto, removePhoto } from '../reducers/user';

export default function MyProfileScreen({ navigation }) {
  
  const [sharePositions, setSharePositions] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [age, setAge] = useState(user.age);
  const [firstname, setFirstname] = useState(user.firstname);
  const [name, setName] = useState(user.lastname);
  const [profileImage, setProfileImage] = useState(user.profilePicture);
  const [modalVisible, setModalVisible] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState(17);


  useEffect(() => {
    (async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You have to allow the app to access your camera roll.");
      }
    })();
  }, []);

  if(emergencyContact != 17) {
    setEmergencyContact(user.emergencyContact);
  }

  const handleSharePosition = () => {
    setSharePositions(!sharePositions);
  };


  const toggleSwitch = () => {
    setSharePositions((previousState) => !previousState);
  };

  const handleImageUpload = async () => {
    setModalVisible(true);
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
      setModalVisible(false);
    }
  };

  const deletePicture = () => {
    dispatch(removePhoto());
    setModalVisible(false);
  };

  let modal = (
    <Modal visible={modalVisible}  contentContainerStyle={containerStyle} style={styles.modal}>
      <View style={styles.imageContainer}>
        <Text style={styles.textModal}>Almost done!</Text>
        <Image source={{ uri: user.profilePicture }} style={{ width: 250, height: 250, marginTop: 20, borderRadius: '500%' }} />
      </View>
      <View style={styles.modalBtn}>
        <Button style={styles.modalButton} onPress={deletePicture}>
          <Text style={styles.modalButtonText}>Delete the photo</Text>
        </Button>
        <Button style={styles.modalButton} onPress={pickImage}>
          <Text style={styles.modalButtonText}>Pick an image from your camera roll</Text>
        </Button>
        <Button style={styles.modalButton} onPress={() => setModalVisible(false)}>
          <Text style={styles.modalButtonText}>Cancel</Text>
        </Button>
      </View>
    
  </Modal>
  )

//   <Modal visible={visible} contentContainerStyle={containerStyle} style={styles.modal}>
//   <View style={styles.imageContainer}>
//     <Text style={styles.textModal}>Almost done!</Text>
//     <Image source={{ uri: user.profilePicture }} style={{ width: 250, height: 250, marginTop: 20 }} />
//   </View>
//   <View style={styles.modalBtn}>
//   <Button onPress={handleBack} style={styles.backBtn}>
//   <Text style={styles.textBtn}>Cancel</Text>
//   </Button>
//   <Button onPress={handleValidate}  style={styles.validateBtn} >
//   <Text style={styles.textBtn}>Validate</Text>
//   </Button>
//   </View>
//   {/* <Button onPress={() => navigation.navigate('Map')}>Next</Button> */}
// </Modal>

  return (
      <PaperProvider>
        <Portal >
        <View style={styles.container} >
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity style={styles.profileImageContainer} onPress={handleImageUpload}>
            {user.picture ? (
              <Image source={{ uri: user.picture }} style={styles.profileImage} />
            ) : (
              <Text style={styles.uploadText}>Choose a picture</Text>
            )}
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
              trackColor={{ false: 'FB8C7C', true: '#9E15B8' }}
              thumbColor={sharePositions ? '#9E15B8' : '#FB8C7C'}
              ios_backgroundColor="white"
              onValueChange={toggleSwitch}
              value={sharePositions}
            />
          </View>
        </View>   
        {modal} 
        </Portal>
        </PaperProvider>   
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileImageContainer: {
    alignItems: 'left',
    marginBottom: 20,
    
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
  },
  uploadText: {
    fontSize: 16,
    color: '#9E15B8',
  },
  personalInfos: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'regular',
    marginBottom: 10,
  },
  modalBtn: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 20,
    width: '100%',
    height: '50%',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'regular',
  },
  modalButton: {
    backgroundColor: '#9E15B8',
    borderRadius: 10,
    padding: 10,
    width: '30%',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F0FB',
    margin: 20,
  },
  modalContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    height: '80%',
  },
});
