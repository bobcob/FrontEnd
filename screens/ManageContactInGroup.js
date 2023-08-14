import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import {
  getReq,
  postReq,
  getDomain,
  deleteReq,
  getUid,
  sortArray,
} from "./requests";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "Chat",
      userIds: [],
      contacts: [],
      // stores the credentoals of the user
      credentials: "",
      message:""
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
      this.props.navigation.setOptions({ title: "Manage user" });
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
      creatorID: parseInt(await getUid()),
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
    const { group} = this.props.route.params;
    const data = {
      organisationId:group.organisationId,
      userId: contact.id,
    };
    const req = await postReq(
      getDomain() + "api/organisations/admin",
      data
    );
  };

  handlePressRemove = async (contact) => {
    const { group} = this.props.route.params;
    const data = {
      organisationId:group.organisationId,
      userId: contact.id,
    };
    const req = await deleteReq(getDomain() + "api/organisations/", data);
    if (req.status == 200) {
      const getGroups = await getReq(getDomain() + "api/organisations/" + (await getUid()));
      this.setState({ groups: getGroups.json });
      this.props.navigation.navigate("GroupInformation", {
        group
      });
    }
    else{
      this.setState({ message: "Cannot remove user" });
    }
  };

  checkCredentials = async (contacts) => {
    const { groupID } = this.props.route.params;
    const checkCredentials = await getReq(
      getDomain() + "api/organisations/admin/"+await getUid() + "/check/" + groupID
    );
    return checkCredentials.json.user;
  };

  render() {
    const { contacts, credentials } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>User actions</Text>
        
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
              title="Remove"
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
        <Text>{this.state.message}</Text>
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
