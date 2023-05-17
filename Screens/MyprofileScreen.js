import React, { useState } from 'react';
import { View, Text, Button, Switch, TextInput, StyleSheet } from 'react-native';

export default function MyProfileScreen() {
  const [sharePositions, setSharePosition] = useState(false);
  const [editProfil, setEditProfil] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [firstname, setFirstname] = useState('');
  const [history, setHistory] = useState('');
  
  const handleSharePosition = () => {
    setSharePosition(!sharePosition);
  };
  
  const handleEditprofil = () => {
    setEditProfil(!editProfil);
  };

  const handleHistory = () => {
    setHistory(!history);
  };
  
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View>
        <Text style={styles.title}>My Profile</Text>

        {/* <Image style={styles.profileimage} source={require('../assets/PROFIL.jpg')} /> */}
            
        <TextInput>Firstname: {Firtname}</TextInput>
                
        <Text>Shared Routes:</Text>
        <Text>counter avec la BDD </Text>
        
        <Text style={styles.subtitle}>Personal Informations</Text>
        <TextInput>Firstname: {Firstname}</TextInput>
        <TextInput>Email: {email}</TextInput>
        <TextInput>Phone: {phone}</TextInput>
        <TextInput>Address: {address}</TextInput>
        
        <View>
            <Text>Share My Position:</Text>
            <Switch onChange={(e) => setSharePosition(e)} value={sharePosition} />
        </View>
        
        <Button title={styles.editprofile} onPress={() => handleEditprofil()} />
        <Button title={styles.history} onPress={() => handleHistory ()} />
        </View>
    </KeyboardAvoidingView>
  )}

//probleme bug