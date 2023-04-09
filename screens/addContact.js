import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getDomain, postReq, getUid } from "./requests";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ID: "",
      name: "",
      status: "",
    };
  }

  handleSubmit = async (id2) => {
    const { navigation } = this.props;
    const now = new Date();
    const data = {
      user1ID: await getUid(),
      user2ID: id2,
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

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Add Contact</Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ID:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ ID: text })}
              value={this.state.ID}
              placeholder="Enter recipient's user ID"
              required
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => this.setState({ name: text })}
              value={this.state.email}
              placeholder="Enter recipient's full name"
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
    justifyContent: "center",
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
