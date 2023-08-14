import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { getDomain, getReq, postReq, getUid } from "./requests";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
// importing all the custom and inbuilt functions to use in the code

export default class Conversation extends Component {
  // setting the paramaters in the state
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      messages: [],
      newMessage: "",
    };
    // allows a scroll view through the messages
    this.scrollViewRef = React.createRef();
  }
  //checks for messages every 2 seconds
  startPollingChat = () => {
    this.chatPollingInterval = setInterval(this.getChat, 2000 );
  }
  // gets the title in the conversation
  getTitle = async () => {
    const { chatId } = this.props.route.params;
    console.log(chatId);
    const title = await getReq(getDomain() + "api/chats/" + chatId + "/title");
    AsyncStorage.setItem("getTargetChatContacts", chatId);
    return title.json.chatName;
  };

  getChat = async () => {
    const { chatId } = this.props.route.params;
    const chatLog = await getReq(getDomain() + "api/chats/" + chatId);
    this.setState({ messages: chatLog.json });
  };

  async componentDidMount() {
    this.setState({ userID: await getUid() });
    this.getChat();
    this.startPollingChat();
    
    this.unsubscribe = this.props.navigation.addListener("focus", async () => {
      const chatTitle = await this.getTitle();
      this.props.navigation.setOptions({ title: chatTitle });
      this.getChat();
     
    });

    const chatTitle = await this.getTitle();
    this.props.navigation.setOptions({ title: chatTitle });
    // checks for a press on the button in the header
    this.props.navigation.setParams({
      handleHeaderButtonPress: this.handleHeaderButtonPress,
    });
  }


  componentWillUnmount() {
    clearInterval(this.chatPollingInterval);
    this.unsubscribe();
  }

  handleNewMessage = (text) => {
    this.setState({ newMessage: text });
  };

  // function that sends each message and its data via a post req
  handleSend = async () => {
    const { chatId , groupID  } = this.props.route.params;
    console.log(groupID);
    const newMessage = {
      title: await this.getTitle(),
      userId: this.state.userID,
      time: new Date(),
      message: this.state.newMessage,
      chatId: chatId,
      organisationId: groupID
    };
    await postReq(getDomain() + "api/chats/", newMessage);
    this.setState({ newMessage: "" });
    this.getChat();
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView
          ref={this.scrollViewRef}
          onContentSizeChange={() =>
            this.scrollViewRef.current.scrollToEnd({ animated: false })
          }
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        >
          {this.state.messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.message,
                parseInt(message.userId) === parseInt(this.state.userID)
                  ? styles.currentUserMessage
                  : styles.otherUserMessage,
              ]}
            >
              <Text style={styles.name}>{message.name}</Text>
              <Text>{message.message}</Text>
              <Text style={styles.time}>
                {new Date(message.time).toLocaleTimeString()}
              </Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={this.state.newMessage}
            onChangeText={this.handleNewMessage}
          />
          <Button title="Send" onPress={this.handleSend} />
        </View>
        <StatusBar style="auto" />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  messagesContainer: {
    flex: 1,
    alignSelf: "stretch",
  },
  messagesContent: {
    paddingHorizontal: 10,
  },
  message: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  currentUserMessage: {
    backgroundColor: "#e6e6e6",
    alignSelf: "flex-end",
  },
  otherUserMessage: {
    backgroundColor: "#d1e0ff",
    alignSelf: "flex-start",
  },
  name: {
    fontSize: 10,
    color: "#888",
    marginBottom: 5,
  },
  time: {
    fontSize: 10,
    color: "#888",
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f8f8f8",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
});
