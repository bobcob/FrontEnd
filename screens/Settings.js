import React, { Component } from "react";
import { StyleSheet, Text, View, Button, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  getReq,
  getDomain,
  getUid,
  putReq,
} from "./requests";
// importing all the custom and inbuilt functions to use in the code
export default class App extends Component {
  // constructor for the screen , variables which can be accesed from within the class that can be saved
  constructor(props) {
    super(props);
    this.state = {
      // paramaters that need to be sent in the request and taken from the user input are stored here
      name: "",
      email: "",
      password: "",
      // status of the request/screen state is stored here
      status: "",
      // contact object to be displayed on screen is stored here 
      contact: [],
    };
  }
  // function that sets the name from the user input to the state
  setName = (name) => {
    this.setState({ name });
  };
  // function that sets the email from the user input to the state 
  setEmail = (email) => {
    this.setState({ email });
  };
  // function that sets the password from the user input to the state 
  setPassword = (password) => {
    this.setState({ password });
  };
  /* 
    function that signs the user out , removing the AsyncStorage values that renders the screen in a logged in state
    the application checks for auth_token and id in order to decide which state to render the app in when loaded 
    thus removing these forces the app in a logged out state
  */
  handleSignOut = () => {
    AsyncStorage.removeItem("auth_token");
    AsyncStorage.removeItem("id");
    const { navigation } = this.props;
    // navigating to the login page
    navigation.navigate("Login");
  };
  // function that sends the request to save the users details to the api
  handleSave = async (contact) => {
    // conditional functions that check if the user input is empty as a user may not want to change particular paramaters
    if (this.state.name == "") {
      this.state.name = contact.name;
    }
    if (this.state.email == "") {
      this.state.email = contact.email;
    }
    // data object that pulls all the respective paramaters that are saved in the state
    const data = {
      id: contact.id,
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    };
    // variable that sends the request and stores the returned object
    const req = await putReq(getDomain() + "api/users/", data);
    // if the request is succesfull show the user a message which indicates so
    if (req.status == 200) {
      this.setState({ status: "Information Updated!" });
    } else {
      // else show a error message
      this.setState({ status: "Could not update information" });
    }
  };
  // function which gets the user information , returning it all as a contact then setting it in the state to be rendered
  getContact = async () => {
    const req = await getReq(getDomain() + "api/users/" + (await getUid()));
    const data = await req.json;
    this.setState({ contact: data });
  };
  // inbuilt function that performs the action inside it whenever the app is focused on it
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      // getting the contact object every time the screen is viewed
      this.getContact();
      // setting the title of the screen
      this.props.navigation.setOptions({ title: "Settings" });
    });
  }
  // cleans up any running proccesses when focus is taken off the screen
  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    // contact is taken from the state and stored as a variable here for rendering 
    const { contact } = this.state;
    /*
    Here the user contact is rendered in the front end of the application. The paramaters are taken and rendered
    There are multiple buttons for sign out and save user functionality
    They are each respictivley linked to their own function which is called when clicked
    */
    return (
      <View style={styles.container}>
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
        <Text>{this.state.status}</Text>
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
