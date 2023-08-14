import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Component } from "react";
import { Button, TextInput } from "react-native-web";
import {
  getReq,
  postReq,
  getDomain,
  validatePassword,
  areParametersPresent,
  isEmailValid,
} from "./requests";
// importing all the custom and inbuilt functions to use in the code

export default class App extends Component {
  /*
  This screen is the one which is loaded upon app launch
  this function checks for the presence of the auth_token
  and navigates the user to the chats screen if it is true
  */
  async componentDidMount() {
    const authToken = await AsyncStorage.getItem("auth_token");
    if (authToken) {
      this.props.navigation.navigate("Main", { screen: "Chats" });
    }
  }

  constructor(props) {
    super(props);
    // declaring the variables which are stored in the state
    this.state = {
      email: "",
      password: "",
      loginStatus: "",
    };
  }
  // function that takes the email paramater and sets it in the state
  setEmail = (email) => {
    this.setState({ email });
  };
  // function that takes the password paramater and sets it in the state
  setPassword = (password) => {
    this.setState({ password });
  };

  // function that handles the login request
  handleLogin = async (email, password) => {
    // getting the naviagtion structure from a higher state so the application can be navigated through
    const { navigation } = this.props;
    // defining the data structure
    const data = {
      email: email,
      password: password,
    };
    // sending the request
    const req = await postReq(getDomain() + "api/login/", data);
    if (req.status == 200) {
      // if the request is succesfull set the response into the AsyncStorage
      AsyncStorage.setItem("id", req.json.user_id);
      AsyncStorage.setItem("auth_token", req.json.auth_token);
      // naviagte to the chats screen
      navigation.navigate("Main", { screen: "Chats" });
    } else {
      // else show the user incorrect email/password
      this.setState({ loginStatus: "Incorrect email/password" });
    }
    this.setState({ email: "", password: "" });
  };
  // function to handle the validity of the data ,  passing all the data through before its sent
  dataCheck = async (email, password) => {
    if (!areParametersPresent(email, password)) {
      this.setState({ loginStatus: "Missing credentials" });
    } else if (!isEmailValid(email) || !validatePassword(password)) {
      this.setState({ loginStatus: "Invalid email/password" });
    } else {
      this.handleLogin(email, password);
    }
  };
  /*

  here the page is rendered , displaying a login screen fo rthe user to input their details and log in
  everytime a value is changed in the input box the value is sent to the state and updated


  */

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={this.setEmail}
          value={this.state.email}
          keyboardType="email-address"
          autoCapitalize="none"
        ></TextInput>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={this.setPassword}
          value={this.state.password}
        ></TextInput>
        <Button
          title="Log in"
          onPress={() => this.dataCheck(this.state.email, this.state.password)}
        />
        <Pressable onPress={() => navigation.navigate("signUp")}>
          <Text>Not got an account? Sign up here</Text>
        </Pressable>
        <Text>{this.state.loginStatus}</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#1e90ff",
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
  },
  input: {
    width: "80%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
});
