import React, { useState } from 'react';

import {
  Button,
  PaperProvider,
  Portal,
  Modal,
} from "react-native-paper";

import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

const ChatBubble = ({ message, isMe }) => {
  const bubbleStyles = isMe
    ? [styles.bubble, styles.myBubble]
    : [styles.bubble, styles.otherBubble];

  const textStyles = isMe ? styles.myText : styles.otherText;

  return (
    <View style={bubbleStyles}>
      <Text style={textStyles}>{message}</Text>
    </View>
  );
};

const ChatScreen = () => {
  const [inputText, setInputText] = useState('');
  const [chatData, setChatData] = useState([]);

  const handleSend = () => {
    if (inputText.trim() === '') {
      return;
    }

    const newMessage = { id: Date.now().toString(), message: inputText, isMe: true };
    setChatData((prevChatData) => [...prevChatData, newMessage]);
    setInputText('');
  };

  return (
    <PaperProvider>
      <Portal>
    <View style={styles.container}>
      <View style={styles.header}>
        <Image></Image>
        <Text style={styles.headerText}>Buddies name</Text>
      </View>
      <FlatList
        data={chatData}
        style={styles.flatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item.message} isMe={item.isMe} style={styles.margin}/>
        )}
      />
       <Image source={require('../assets/CityLogo.png')} style={styles.city} /> 

      <View style={styles.inputContainer}>
        <Image source={require('../assets/Group 9.png')} style={styles.plusIcon}/>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={(text) => setInputText(text)}
          placeholder="Type your message"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity> 
      </View>
    </View>
    </Portal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bubble: {
    padding: 8,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: '80%',
  },
  myBubble: {
    backgroundColor: '#F9F0FB',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'pink',
  },
  myText: {
    color: 'black',
  },
  otherText: {
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 50,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#350040',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#350040',
    padding: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  flatList: {
    margin: 10,
  },
  header: {
    backgroundColor: "#F9F0FB",
    height: "15%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  city: {
    position: 'absolute',
    bottom: 0,
    opacity: 0.2,
    height: '25%',
    width: '100%',
  },
  plusIcon: {
    position: 'absolute',
    left: 10,
    height: 30,
    width: 30,
  },
});

export default ChatScreen;
