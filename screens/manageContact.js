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
} from "./requests";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  getContact = async () => {
    const req = await getReq(
      getDomain() + "api/users/" + (await getTargetUser())
    );
    const data = await req.json;
    this.setState({ contacts: data });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getContact();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handlePressMessage = () => {
    const { navigation } = this.props;
    navigation.navigate("Conversation");
  };

  handlePressRemove = async (contact) => {
    const { navigation } = this.props;
    const now = new Date();
    const data = {
      user1ID: await getUid(),
      user2ID: contact.id,
      dateAdded: now,
    };
    const req = await deleteReq(getDomain() + "api/contacts/", data);
    if (req.status == 200) {
      navigation.navigate("Main", { screen: "Contacts" });
    }
  };

  render() {
    const { contacts } = this.state;
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
          <Button
            title="Remove"
            onPress={() => this.handlePressRemove(contacts)}
            style={styles.button}
          />
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
