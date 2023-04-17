import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
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

export default class App extends Component {
  async componentDidMount() {
    const authToken = await AsyncStorage.getItem("auth_token");
    if (authToken) {
      this.props.navigation.navigate("Main", { screen: "Chats" });
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      loginStatus: "",
    };
  }

  setEmail = (email) => {
    this.setState({ email });
  };

  setPassword = (password) => {
    this.setState({ password });
  };

  // example get
  loginHandler = async (email, password) => {
    const { navigation } = this.props;
    const data = {
      email: email,
      password: password,
    };
    const req = await postReq(getDomain() + "api/login/", data);
    if (req.status == 200) {
      AsyncStorage.setItem("id", req.json.user_id);
      AsyncStorage.setItem("auth_token", req.json.auth_token);
      navigation.navigate("Main", { screen: "Chats" });
    } else {
      this.setState({ loginStatus: "Incorrect email/password" });
    }
    this.setState({ email: "", password: "" });
  };

  dataCheck = async (email, password) => {
    if (!areParametersPresent(email, password)) {
      this.setState({ loginStatus: "Missing credentials" });
    } else if (!isEmailValid(email) || !validatePassword(password)) {
      this.setState({ loginStatus: "Invalid email/password" });
    } else {
      this.loginHandler(email, password);
    }
  };

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
