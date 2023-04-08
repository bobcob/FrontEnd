import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import styles from "/styles/StyleSheet";
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
    console.log(email);
    console.log(password);
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
          placeholder="Email"
          onChangeText={this.setEmail}
          value={this.state.email}
        ></TextInput>
        <TextInput
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={this.setPassword}
          value={this.state.password}
        ></TextInput>
        <Button
          style={styles.button}
          title="Log in"
          onPress={() => this.dataCheck(this.state.email, this.state.password)}
        ></Button>
        <Pressable onPress={() => navigation.navigate("signUp")}>
          <Text>Not got an account? Sign up here</Text>
        </Pressable>
        <Text>{this.state.loginStatus}</Text>
      </View>
    );
  }
}
