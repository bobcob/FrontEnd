import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import {
  getReq,
  postReq,
  getDomain,
  deleteReq,
  getAuthToken,
  getUid,
  getTargetUser,
  getTargetChat,
  sortArray,
  getTargetChatContacts,
} from "./requests";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Chat",
      userIds: [],
      contacts: [],
      credentials: "",
    };
  }

  getContact = async () => {
    const { contactID } = this.props.route.params;
    const req = await getReq(getDomain() + "api/users/" + contactID);
    const data = await req.json;
    this.setState({ contacts: data });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getContact();
    });
    this.checkCredentialsAndUpdateState();
  }

  checkCredentialsAndUpdateState = async () => {
    const { contacts } = this.state;
    const credentials = await this.checkCredentials(contacts);
    this.setState({ credentials });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  handlePressMessage = async () => {
    const { contacts } = this.state;
    const chatID = await getReq(getDomain() + "api/chats/relationships/");
    this.state.userIds.push(await getUid());
    this.state.userIds.push(contacts.id);
    const sortedIDs = sortArray(this.state.userIds).map(Number);
    var data = {
      title: this.state.title,
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

  handleAdmin = async (contact) => {
    console.log(await getTargetChatContacts());
    const data = {
      chatId: parseInt(await getTargetChatContacts()),
      userID: parseInt(await getTargetChat()),
    };
    const req = await postReq(
      getDomain() + "api/chats/relationships/admin/",
      data
    );
  };

  handlePressRemove = async (contact) => {
    const { navigation } = this.props;
    const data = {
      chatId: parseInt(await getTargetChatContacts()),
      userID: contact.id,
    };
    const req = await deleteReq(getDomain() + "api/chats/relationships/", data);
    if (req.status == 200) {
      const targetChatContacts = await getTargetChatContacts();
      navigation.navigate("ChatInformation", {
        targetChatContacts,
      });
    }
  };

  checkCredentials = async (contacts) => {
    const data = {
      chatID: 3,
      id: parseInt(await getUid()),
    };
    const checkCredentials = await postReq(
      getDomain() + "api/chats/relationships/admin/check",
      data
    );
    return checkCredentials.json.user;
  };

  render() {
    const { admin } = this.props.route.params;
    const { creator } = this.props.route.params;
    const { contacts, credentials } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Manage Contact</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>ID:</Text>
          <Text style={styles.infoValue}>{contacts.id}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Name:</Text>
          <Text style={styles.infoValue}>{contacts.name}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{contacts.email}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Message"
            onPress={this.handlePressMessage}
            style={styles.button}
          />
          {credentials === "Admin" || credentials === "Creator" ? (
            <Button
              title="Remove from chat"
              onPress={() => this.handlePressRemove(contacts)}
              style={styles.button}
            />
          ) : null}
          {credentials === "Creator" ? (
            <Button
              title="Give admin role"
              onPress={() => this.handleAdmin(contacts)}
              style={styles.button}
            />
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  infoContainer: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "bold",
    marginRight: 8,
  },
  infoValue: {},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});
