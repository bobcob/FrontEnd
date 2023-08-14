import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getDomain, getReq, postReq, sortArray, getUid } from "./requests";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      userIds: [""],
      warning: "",
      groupID: null,
    };
  }

  handleCreateChat = async () => {
    if (this.state.userIds.includes(parseInt(await getUid()))) {
      this.setState({
        warning: "You cannot add yourself to a chat",
      });
      return;
    }
    const chatID = await getReq(getDomain() + "api/chats/relationships/");
    const userID = await getUid();
    const newUserIds = [...this.state.userIds, userID];
  const sortedIDs = sortArray(newUserIds).map(Number);
  // conditionally getting the variable as it may not be set , returning null if it is not
    const groupID = this.props.route.params?.groupID;
    const groupData = groupID ? { groupID } : {};
    var data = {
      creatorID: parseInt(await getUid()),
      title: this.state.title,
      chatId: chatID.json.int,
      userID: sortedIDs,
      // conditionally sending the group data paramater as it is not applicable for the screen in all scenarios
      ...groupData,
    };
    var sendRelationship = await postReq(
      getDomain() + "api/chats/relationships/",
      data
    );
    console.log(sendRelationship.status);

    if (sendRelationship.status == 200) {
      console.log(groupData.groupID);
      console.log(groupData);
      this.props.navigation.navigate("Conversation", {
        groupID:groupData.groupID,
        chatId: sendRelationship.json.chat,
      });
    
    }   if (sendRelationship.status == 400) {
        this.setState({
          warning: sendRelationship.json.error,
        });
      } else {
      this.props.navigation.navigate("Conversation", {
        chatId: sendRelationship.json.chat,
        ...groupData,
      });
    }
  };
  // adding a new empty string to the array - effectivly making a space for a potential id when the button is clicked
  handleAddUser = () => {
    this.setState((prevState) => ({
      userIds: [...prevState.userIds, ""],
    }));
  };
  // updates the space with the user id after the input box has been created
  handleUserIdChange = (text, index) => {
    const newUserIds = [...this.state.userIds];
    newUserIds[index] = text.trim() === "" ? "" : parseInt(text, 10);
    this.setState({ userIds: newUserIds });
  };
  componentDidMount() {
    this.props.navigation.setOptions({ title: "New chat" });
  }


  render() {
    return (
      <View style={styles.container}>

        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={(text) => this.setState({ title: text })}
          value={this.state.title}
        />

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
