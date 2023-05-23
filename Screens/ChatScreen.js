import React, { useState } from 'react';

import {
  Button,
  PaperProvider,
  Portal,
  Modal,
} from "react-native-paper";

import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';

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
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item.message} isMe={item.isMe} style={styles.margin}/>
        )}
      />
      <View style={styles.inputContainer}>
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
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: 'pink',
    padding: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});

export default ChatScreen;
