import { StatusBar } from "expo-status-bar";
import React, { Component } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
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
      name: "",
      loginStatus: "",
    };
  }

  setEmail = (email) => {
    this.setState({ email });
  };

  setPassword = (password) => {
    this.setState({ password });
  };

  setName = (name) => {
    this.setState({ name });
  };

  setLoginStatus = (loginStatus) => {
    this.setState({ loginStatus });
  };

  signUpHandler = async (email, password, name) => {
    const { navigation } = this.props;
    const data = {
      email: email,
      password: password,
      name: name,
    };
    const signUp = await postReq(getDomain() + "api/users/", data);
    if (signUp.status == 200) {
      navigation.navigate("Login");
    } else {
      this.setState({ loginStatus: "Email already exists" });
    }
  };

  dataCheck = async (email, password, name) => {
    if (!areParametersPresent(email, password)) {
      this.setState({ loginStatus: "Missing credentials" });
    } else if (!isEmailValid(email) || !validatePassword(password)) {
      this.setState({ loginStatus: "Invalid email/password" });
    } else {
      this.signUpHandler(email, password, name);
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <Text style={styles.title}>Sign up</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          onChangeText={this.setEmail}
          value={this.state.email}
        />
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Password"
          onChangeText={this.setPassword}
          value={this.state.password}
        />
        <TextInput
          style={styles.input}
          placeholder="Full name"
          onChangeText={this.setName}
          value={this.state.name}
        />
        <Button
          title="Sign up"
          onPress={() =>
            this.dataCheck(
              this.state.email,
              this.state.password,
              this.state.name
            )
          }
        />
        <Text>{this.state.loginStatus}</Text>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});
