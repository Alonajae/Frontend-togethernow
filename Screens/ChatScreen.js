import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, PaperProvider, Portal, Modal } from "react-native-paper";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

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

export default function ChatScreen({ navigation }) {

  const [inputText, setInputText] = useState("");
  const [chatData, setChatData] = useState([]);

  const dispatch = useDispatch();
  const profilePicture = useSelector((state) => state.user.value.profilePicture);
  const buddy = useSelector((state) => state.map.value.buddy);

  const handleSend = () => {
    if (inputText.trim() === "") {
      return;
    }

    // const [picture, setPicture] = useState(user.profilePicture);

    const newMessage = {
      id: Date.now().toString(),
      message: inputText,
      isMe: true,
    };
    setChatData((prevChatData) => [...prevChatData, newMessage]);
    setInputText("");
  };

  handleBack = () => {
    navigation.navigate("Map");
  };

  return (
    <PaperProvider>
      <Portal>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.buddiesInfo}>
              <TouchableOpacity onPress={handleBack} style={styles.styleBtn}>
                <Text style={styles.backTextBtn}>Back</Text>
              </TouchableOpacity>
              <Image
                source={{ uri: profilePicture }}
                style={styles.profileImage}
              />
              <Text style={styles.headerText}>{buddy.firstname}</Text>
            </View>
          </View>
          <FlatList
            data={chatData}
            style={styles.flatList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ChatBubble
                message={item.message}
                isMe={item.isMe}
                style={styles.margin}
              />
            )}
          />
          <Image
            source={require("../assets/CityLogo.png")}
            style={styles.city}
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.PlusBtn}>
              <Text style={styles.btntext}>+</Text>
            </TouchableOpacity>
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
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  bubble: {
    padding: 8,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: "80%",
  },
  myBubble: {
    backgroundColor: "#F9F0FB",
    alignSelf: "flex-end",
  },
  otherBubble: {
    backgroundColor: "white",
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "pink",
  },
  myText: {
    color: "black",
  },
  otherText: {
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    marginBottom: 15,
    marginRight: 10,
    marginLeft: 10,
  },
  input: {
    width: "68%",
    borderWidth: 1,
    borderColor: "#350040",
    borderRadius: 8,
    padding: 12,
    margin: 8,
  },
  sendButton: {
    backgroundColor: "#350040",
    padding: 12,
    borderRadius: 8,
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold",
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
    position: "absolute",
    bottom: 0,
    opacity: 0.2,
    height: "25%",
    width: "100%",
  },
  headerText: {
    fontFamily: "Jomhuria",
    color: "#350040",
    fontSize: 50,
  },
  btntext: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  buddiesInfo: {
    width: "80%",
    flexDirection: "row",
    justifyContent: "flex-start",
    margin: 15,
    alignItems: "center",
    marginTop: 50,
  },
  styleBtn: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderColor: "#350040",
    borderRadius: 8,
    height: "45%",
    marginRight: "7%",
    alignItems: "center",
    justifyContent: "center",
  },
  backTextBtn: {
    color: "#350040",
    fontSize: 14,
    fontWeight: "bold",
  },
  PlusBtn: {
    width: "10%",
    backgroundColor: "#350040",
    borderRadius: 8,
    height: "30%",
    alignItems: "center",
    justifyContent: "center",
  },
});
