import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Pressable,
} from "react-native";
import { Component } from "react";
import styles from "/styles/StyleSheet";
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
  // Include db check for existing user info
  // check for plain text in name

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sign up</Text>
        <TextInput
          placeholder="Email"
          onChangeText={this.setEmail}
          value={this.state.email}
        ></TextInput>
        <TextInput
          placeholder="Password"
          onChangeText={this.setPassword}
          value={this.state.password}
        ></TextInput>
        <TextInput
          placeholder="Full name"
          onChangeText={this.setName}
          value={this.state.name}
        ></TextInput>
        <Button
          style={styles.button}
          title="Sign up"
          onPress={() =>
            this.dataCheck(
              this.state.email,
              this.state.password,
              this.state.name
            )
          }
        ></Button>
        <Text>{this.state.loginStatus}</Text>
      </View>
    );
  }
}
