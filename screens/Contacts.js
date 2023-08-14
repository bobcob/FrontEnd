import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  getReq,
  getDomain,
  getUid,
} from "./requests";
import AsyncStorage from "@react-native-async-storage/async-storage";

// importing all the custom and inbuilt functions to use in the code

// defining a class for each contact card

class ContactCard extends Component {
  // function for when the manage button is pressed in each contact
  handleManage = (contact) => {
    // setting the target user id in async storage
    AsyncStorage.setItem("targetUserID", contact.id);
    // navigating to the manage contact screen 
    this.props.navigation.navigate("manageContact");
  };

  render() {
    // getting the contact from the state 
    const { contact } = this.props;
    return (
      /*
      Rendering the contact details and their paramaters

      Includes a button which calls handleManage when clicked 

      */
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
// creating the contact list class 
class ContactList extends Component {
  render() {
    // importing contacts and naviagtion from class
    const { contacts, navigation } = this.props;
    /*
    Rendering a flatlist to naviagte through all the contacts , passing each one through as a item
    */
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
// declaring the class which renders the main app
export default class App extends Component {
  constructor(props) {
    super(props);
    // setting the list of contacts in the state
    this.state = {
      contacts: [],
    };
  }
  // request function which gets and returns all contacts
  getAllContacts = async () => {
    const req = await getReq(getDomain() + "api/contacts/" + (await getUid()));
    const data = await req.json;
    this.setState({ contacts: data });
  };
  // navigates to the add contact page 
  handleAddContact = () => {
    this.props.navigation.navigate("addContact");
  };
  // getting all the contacts once the page has loaded 
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getAllContacts();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    // getting all the contacts from the state
    const { contacts } = this.state;

    /*
    Rendering the page with a add contacts button at the top 
    followed by the contact list defined earlier with the list of contacts passed through
    */
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Add contact</Text>
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
