import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getDomain, postReq, getUid } from "./requests";
// importing all the custom and inbuilt functions to use in the code

export default class App extends Component {
  constructor(props) {
    super(props);
    // declaring the variables which need to be stored within the state
    this.state = {
      ID: "",
      name: "",
      status: "",
    };
  }

  setId = (ID) => {
    this.setState({ ID });
  };

  // function that handles the submission of the data in order to add add a new contact
  handleSubmit = async (id2) => {
    const { navigation } = this.props;
    const now = new Date();
    const data = {
      user1Id: parseInt(await getUid()),
      user2Id: parseInt(id2),
      dateAdded: now,
    };
    const req = await postReq(getDomain() + "api/contacts/", data);
    console.log(req.status);
    if (req.status == 200) {
      navigation.navigate("Main", { screen: "Contacts" });
    } else {
      this.setState({ status: "User already contact" });
      console.log(this.state.status);
    }
  };
  // renders the title every time the page is loaded
  componentDidMount() {
    this.props.navigation.setOptions({ title: "Add contact" });
  }
  /*

  renders a page which allows the input of another user id , ready to make it a contact
  the state variable id changes every time there is input in the box

  */
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID:</Text>
            <TextInput
              style={styles.input}
              onChangeText={this.setId}
              value={this.state.ID}
              placeholder="Enter recipient's user ID"
              required
            />
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.handleSubmit(this.state.ID)}
          >
            <Text style={styles.buttonText}>Add Contact</Text>
          </TouchableOpacity>
          <Text>{this.state.status}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop:20
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  form: {
    width: "80%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: "#0080ff",
    borderRadius: 5,
    padding: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
