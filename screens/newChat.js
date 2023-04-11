import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getDomain, getReq, postReq, sortArray, getUid } from "./requests";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userIds: [""],
    };
  }

  handleCreateChat = async () => {
    const { navigation } = this.props;
    const chatID = await getReq(getDomain() + "api/chats/relationships/");
    this.state.userIds.push(await getUid());
    const sortedIDs = sortArray(this.state.userIds).map(Number);
    var data = {
      chatId: chatID.json.int,
      userID: sortedIDs,
    };
    var sendRelationship = await postReq(
      getDomain() + "api/chats/relationships/",
      data
    );
    if (sendRelationship.status == 200) {
      this.props.navigation.navigate("Conversation", {
        chatId: sendRelationship.json.chat,
      });
    } else {
      this.props.navigation.navigate("Conversation", {
        chatId: sendRelationship.json.chat,
      });
    }
  };

  handleAddUser = () => {
    this.setState((prevState) => ({
      userIds: [...prevState.userIds, ""],
    }));
  };

  handleUserIdChange = (text, index) => {
    const newUserIds = [...this.state.userIds];
    newUserIds[index] = text;
    this.setState({ userIds: newUserIds });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>New Chat</Text>
        {this.state.userIds.map((userId, index) => (
          <View key={index}>
            <TextInput
              style={styles.input}
              placeholder="User ID"
              onChangeText={(text) => this.handleUserIdChange(text, index)}
              value={userId}
            />
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={this.handleAddUser}>
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.handleCreateChat}>
          <Text style={styles.buttonText}>Create new chat</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#007aff",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
