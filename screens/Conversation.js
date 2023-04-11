import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import { getDomain, getReq, postReq, getUid } from "./requests";
import { StatusBar } from "expo-status-bar";
export default class Conversation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      messages: [],
      newMessage: "",
    };
  }

  getChat = async () => {
    const { chatId } = this.props.route.params;
    const chatLog = await getReq(getDomain() + "api/chats/" + chatId);
    this.setState({ messages: chatLog.json });
  };

  async componentDidMount() {
    this.setState({ userID: await getUid() });
    this.getChat();
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getChat();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleNewMessage = (text) => {
    this.setState({ newMessage: text });
  };

  handleSend = async () => {
    const { chatId } = this.props.route.params;
    const newMessage = {
      userID: this.state.userID,
      message: this.state.newMessage,
      chatId: chatId,
    };
    await postReq(getDomain() + "api/messages", newMessage);
    this.setState({ newMessage: "" });
    this.getChat();
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.messagesContainer}>
          {this.state.messages.map((message) => (
            <View
              key={message.id}
              style={[
                styles.message,
                parseInt(message.userID) === parseInt(this.state.userID)
                  ? styles.currentUserMessage
                  : styles.otherUserMessage,
              ]}
            >
              <Text>{message.message}</Text>
            </View>
          ))}
        </View>
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
    alignItems: "center",
    justifyContent: "center",
  },
  messagesContainer: {
    flex: 1,
    alignSelf: "stretch",
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
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
