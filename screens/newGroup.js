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

  handleCreateGroup = async () => {
    if (this.state.userIds.includes(parseInt(await getUid()))) {
      this.setState({
        warning: "You cannot add yourself to a chat",
      });
      return;
    }
    const orgID = await getReq(getDomain() + "api/organisations/");
    this.state.userIds.push(await getUid());
    const sortedIDs = sortArray(this.state.userIds).map(Number);
    const groupID = this.props.route.params?.groupID;
    const groupData = groupID ? { groupID } : {};
    var data = {
      creatorID: parseInt(await getUid()),
      Name: this.state.title,
      orgID: orgID.json.int,
      userIDs: sortedIDs,
    };
    var sendRelationship = await postReq(
      getDomain() + "api/organisations/",
      data
    );

    if (sendRelationship.status == 200) {
      this.props.navigation.navigate("Groups");
    }
  };

  handleAddUser = () => {
    this.setState((prevState) => ({
      userIds: [...prevState.userIds, ""],
    }));
  };

  handleUserIdChange = (text, index) => {
    const newUserIds = [...this.state.userIds];
    newUserIds[index] = text.trim() === "" ? "" : parseInt(text, 10);
    this.setState({ userIds: newUserIds });
  };

  componentDidMount() {
    this.props.navigation.setOptions({ title: "New group" });
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
        <TouchableOpacity style={styles.button} onPress={this.handleCreateGroup}>
          <Text style={styles.buttonText}>Create new group</Text>
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
