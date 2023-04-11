import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import {
  getReq,
  postReq,
  getDomain,
  deleteReq,
  getAuthToken,
  getUid,
} from "./requests";
import AsyncStorage from "@react-native-async-storage/async-storage";

class ContactCard extends Component {
  handleManage = (contact) => {
    AsyncStorage.setItem("targetUserID", contact.id);
    this.props.navigation.navigate("manageContact");
  };

  render() {
    const { contact, navigation } = this.props;
    return (
      <TouchableOpacity style={styles.card}>
        <Text style={styles.email}>{contact.id}</Text>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.email}>{contact.email}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.handleManage(contact)}
          >
            <Text style={styles.buttonText}>Manage</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
}

class ContactList extends Component {
  render() {
    const { contacts, navigation } = this.props;
    return (
      <FlatList
        data={contacts}
        keyExtractor={(contact) => contact.id.toString()}
        renderItem={({ item }) => (
          <ContactCard contact={item} navigation={navigation} />
        )}
        style={styles.list}
      />
    );
  }
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }

  getAllContacts = async () => {
    const req = await getReq(getDomain() + "api/contacts/" + (await getUid()));
    const data = await req.json;
    this.setState({ contacts: data });
  };

  handleAddContact = () => {
    this.props.navigation.navigate("addContact");
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getAllContacts();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { contacts } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Contacts</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={this.handleAddContact}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <ContactList contacts={contacts} navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  list: {
    marginTop: 20,
  },
  card: {
    padding: 10,
    backgroundColor: "#f2f2f2",
    marginVertical: 5,
  },
  name: {
    fontSize: 18,
  },
  email: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007aff",
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
});
