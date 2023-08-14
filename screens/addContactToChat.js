import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  getDomain,
  getReq,
  postReq,
  getUid,
  getTargetChatContacts,
} from "./requests";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      userId: "",
      warning: "",
    };
  }

  getTitle = async () => {
    const title = await getReq(
      getDomain() + "api/chats/" + (await getTargetChatContacts()) + "/title"
    );
    return title.json;
  };

  handleCreateChat = async () => {
    if (this.state.userId.includes(parseInt(await getUid()))) {
      this.setState({
        warning: "You cannot add yourself to a chat",
      });
      return;
    }
    const chatinfo = await this.getTitle();
    const data = {
      admin: "false",
      groupCreator: "false",
      chatName:chatinfo.Title,
      chatId: parseInt(await getTargetChatContacts()),
      userId: parseInt(this.state.userId),
      organisationId:chatinfo.organisationId

    };
    var sendRelationship = await postReq(
      getDomain() + "api/chats/relationships/addUserToChat",
      data
    );
    if (sendRelationship.status == 200) {
      this.props.navigation.navigate("ChatInformation", {
        targetChatContacts: sendRelationship.json.chat,
      });
    }
    if (sendRelationship.status == 404) {
      this.setState({
        warning: "User not in group",
      });
    } else {
      this.props.navigation.navigate("ChatInformation", {
        targetChatContacts: sendRelationship.json.chat,
      });
    }
  };

  handleAddUser = () => {
    this.setState((prevState) => ({
      userIds: [...prevState.userIds, ""],
    }));
  };

  handleUserIdChange = (userId) => {
    this.setState({ userId: userId });
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Add user to chat</Text>
        <View>
          <TextInput
            style={styles.input}
            placeholder="User ID"
            onChangeText={(userId) => this.handleUserIdChange(userId)}
            value={this.state.userId}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={this.handleAddUser}>
          <Text style={styles.buttonText}>Add additional user</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={this.handleCreateChat}>
          <Text style={styles.buttonText}>Add user(s) to chat</Text>
        </TouchableOpacity>
        <Text>{this.state.warning}</Text>
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
