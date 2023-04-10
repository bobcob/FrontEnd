import React, { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReq,
  postReq,
  getDomain,
  deleteReq,
  getAuthToken,
  getUid,
  getTargetUser,
  putReq,
} from "./requests";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      password: "",
      status: "",
      contact: [],
    };
  }
  setName = (name) => {
    console.log(name);
    this.setState({ name });
  };

  setEmail = (email) => {
    this.setState({ email });
  };
  setPassword = (password) => {
    this.setState({ password });
  };

  handleSignOut = () => {
    AsyncStorage.removeItem("auth_token");
    AsyncStorage.removeItem("id");
    const { navigation } = this.props;
    navigation.navigate("Login");
  };

  handleSave = async (contact) => {
    if (this.state.name == "") {
      this.state.name = contact.name;
    }
    if (this.state.email == "") {
      this.state.name = contact.email;
    }
    const data = {
      id: contact.id,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    };
    const req = await putReq(getDomain() + "api/users/", data);
    this.setState({ loginStatus: "Information Updated!" });
  };

  getContact = async () => {
    const req = await getReq(getDomain() + "api/users/" + (await getUid()));
    const data = await req.json;
    this.setState({ contact: data });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getContact();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { contact } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Manage your account</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>ID:</Text>
          <Text style={styles.infoValue}>{contact.id}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Name:</Text>
          <TextInput
            style={styles.infoValue}
            onChangeText={this.setName}
            value={this.state.name}
            placeholder={contact.name}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Email:</Text>
          <TextInput
            style={styles.infoValue}
            onChangeText={this.setEmail}
            value={this.state.email}
            placeholder={contact.email}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>Password:</Text>
          <TextInput
            style={styles.infoValue}
            onChangeText={this.setPassword}
            value={this.state.password}
            placeholder="Enter password"
            secureTextEntry={true}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Sign out"
            onPress={this.handleSignOut}
            style={styles.button}
          />
          <Button
            title="Save"
            onPress={() => this.handleSave(contact)}
            style={styles.button}
          />
        </View>
        <Text>{this.state.loginStatus}</Text>
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
