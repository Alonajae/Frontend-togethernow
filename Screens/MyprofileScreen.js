import React, { useState } from 'react';
import { View, Text, Button, Switch, TextInput, StyleSheet } from 'react-native';
import HistoryScreen from './HistoryScreen';

export default function MyProfileScreen() {
  const [sharePositions, setSharePosition] = useState(false);
  const [editProfil, setEditProfil] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [Firtname, setFirtname] = useState('');
  const [History, setHistory] = useState('');
  
  const handleSharePosition = () => {
    setSharePosition(!sharePosition);
  };
  
  const handleEditprofil = () => {
    setEditProfil(!editProfil);
  };

  const handleHistory = () => {
    setHistory(!History);
  };
  
  return (
    <View>
      <Text>My Profile</Text>
      
      <Text>First Name:</Text>
      <Text>{Firtname}</Text>
      
      <Text>Shared Routes:</Text>
      <Text>counter avec la BDD </Text>
      
      <Text>Personal Informations:</Text>
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
  )}
