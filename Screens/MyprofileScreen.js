import React, { useState } from 'react';
import { View, Text, Button, Switch, TextInput, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAvoidingView } from 'react-native';
import { TouchableOpacity } from 'react-native';


export default function MyprofileScreen() {
  const [sharePositions, setSharePosition] = useState(false);
  const [editProfil, setEditProfil] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [firstname, setFirstname] = useState('');
  const [history, setHistory] = useState('');
  const [profileImage, setProfileImage] = useState(null)
  
  const handleSharePosition = () => {
    setSharePosition(!sharePosition);
  };
  
  const handleEditprofil = () => {
    setEditProfil(!editProfil);
  };

  const handleHistory = () => {
    setHistory(!history);
  };
  
  const toggleSwitch = () => {
    setSharePositions((previousState) => !previousState);
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("La permission d'accéder à la galerie est requise pour choisir une image de profil.");
      return;
    }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
        <Text style={styles.title}>My Profile</Text>

        {/* <Image style={styles.profileimage} source={require('../assets/PROFIL.jpg')} /> */}
          {/* <TouchableOpacity onPress={handleImageUpload}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.uploadText}>Choisir une photo</Text>
          )}
        </TouchableOpacity> */}
            
        <TextInput>Firstname: {Firtname}</TextInput>
                
        <Text>Shared Routes:</Text>
        <Text>counter avec la BDD </Text>
        
        <View style={styles.personnalinfos}>
          <Text style={styles.subtitle}>Personal Informations</Text>
          <TextInput>Firstname: {Firstname}</TextInput>
          <TextInput>Email: {email}</TextInput>
          <TextInput>Phone: {phone}</TextInput>
          <TextInput>Address: {address}</TextInput>
        </View>
        
        <View>
            <Text>Share My Position:</Text>
            <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={sharePositions ? "#9E15B8" : "#FB8C7C"}
            ios_backgroundColor="white"
            onValueChange={toggleSwitch}
            value={sharePositions}
            />
        </View>
        
        <Button title={styles.editprofile} onPress={() => handleEditprofil()} />
        <Button title={styles.history} onPress={() => handleHistory ()} />
        
        </View>
    </KeyboardAvoidingView>
  )}

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    profileImage: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
   });}