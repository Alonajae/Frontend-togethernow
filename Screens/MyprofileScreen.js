import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch, TextInput, StyleSheet, TouchableOpacity, Image, Modal, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAvoidingView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addPhoto, removePhoto } from '../reducers/user';

export default function MyProfileScreen() {
  const [sharePositions, setSharePositions] = useState(false);
  const [editProfil, setEditProfil] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [firstname, setFirstname] = useState('');
  const [history, setHistory] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [emergencyContact, setEmergencyContact] = useState(17);

  const user = useSelector((state) => state.user.value);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("You have to allow the app to access your camera roll.");
      }
    })();
  }, []);

  const handleSharePosition = () => {
    setSharePositions(!sharePositions);
  };

  const handleEditProfil = () => {
    setEditProfil(!editProfil);
  };

  const handleHistory = () => {
    setHistory(!history);
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <Text style={styles.title}>My Profile</Text>

          <Modal visible={modalVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <TouchableOpacity style={styles.modalButton} onPress={deletePicture}>
                  <Text style={styles.modalButtonText}>Delete the photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={pickImage}>
                  <Text style={styles.modalButtonText}>Pick an image from camera roll</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={styles.profileImageContainer} onPress={handleImageUpload}>
            {user.picture ? (
              <Image source={{ uri: user.picture }} style={styles.profileImage} />
            ) : (
              <Text style={styles.uploadText}>Choose a picture</Text>
            )}
          </TouchableOpacity>

          <TextInput>Firstname: {firstname}</TextInput>

          <Text>Shared Routes:</Text>
          <Text>counter avec la BDD</Text>

          <View style={styles.personalInfos}>
            <Text style={styles.subtitle}>Personal Informations</Text>

            <TextInput>Firstname: {firstname}</TextInput>
            <TextInput>Email: {email}</TextInput>
            <TextInput>Phone: {phone}</TextInput>
            <TextInput>Address: {address}</TextInput>
            <TextInput>Emergency Contact: {emergencyContact}</TextInput>
          </View>

          <View>
            <Text>Share My Position:</Text>
            <Switch
              trackColor={{ false: 'FB8C7C', true: '#9E15B8' }}
              thumbColor={sharePositions ? '#9E15B8' : '#FB8C7C'}
              ios_backgroundColor="white"
              onValueChange={toggleSwitch}
              value={sharePositions}
            />
          </View>
          
          <Button onPress={() => navigation.navigate('Map')}>Next</Button>
          <Button onPress={handleEditProfil}>Edit my profil</Button>
          <Button onPress={handleHistory}>History</Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  modalButton: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'regular',
  },
});
