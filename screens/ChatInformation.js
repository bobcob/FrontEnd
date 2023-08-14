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
  deleteReq,
  getUid,
  getTargetChatContacts,
} from "./requests";
// importing all the custom and inbuilt functions to use in the code
class ContactCard extends Component {
  handleManage = async (contact) => {
    this.props.navigation.navigate("ManageContactInChat", {
      admin: "true",
      creator: "true",
      contactID: contact.id,
    });
  };

  render() {
    const { contact } = this.props;
  
    return (
      <TouchableOpacity style={styles.card}>
        <Text style={styles.email}>{contact.id}</Text>
        <Text style={styles.name}>{contact.name}</Text>
        <Text style={styles.email}>{contact.email}</Text>
        
        <View style={styles.buttonContainer}>
        {contact.id !== this.props.currentUserId && (
    <TouchableOpacity
      style={styles.button}
      onPress={() => this.handleManage(contact)}
    >
      <Text style={styles.buttonText}>View actions</Text>
    </TouchableOpacity>
  )}
        </View>
      </TouchableOpacity>
    );
  }
}

class ContactList extends Component {
  render() {
    const { contacts, navigation , route } = this.props;
    return (
      <FlatList
        data={contacts}
        keyExtractor={(contact) => contact.id.toString()}
        renderItem={({ item }) => (
          <ContactCard contact={item} navigation={navigation} route={route} currentUserId={this.props.currentUserId} />
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
      currentUserId:null
    };
  }
  handleLeaveChat = async () => {
    const data = {      
      chatId: parseInt(await getTargetChatContacts()),
      userId: parseInt(await getUid())
    }
    const leaveChat = await deleteReq(getDomain() + "api/chats/relationships/" , data)
    this.props.navigation.navigate("Chats");
  }
  getCurrentUserId = async () => {
    const id = await getUid();
    this.setState({ currentUserId: Number(id) });
  };

  getAllContacts = async () => {
    const { targetChatContacts } = this.props.route.params;
    const req = await getReq(
      getDomain() + "api/contacts/inchat/" + targetChatContacts
    );
    const data = await req.json;
    this.setState({ contacts: data });
  };

  handleAddContact = () => {
    this.props.navigation.navigate("addContactToChat");
  };

  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getAllContacts();
      this.getCurrentUserId();
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
          <Text style={styles.heading}>Users in chat</Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleAddContact}
          >
            <Text style={styles.buttonText}>Add user</Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={styles.button}
              onPress={this.handleLeaveChat}
            >
              <Text style={styles.buttonText}>Leave chat</Text>
            </TouchableOpacity>
        </View>
        <ContactList contacts={contacts} navigation={this.props.navigation} route={this.props.route} currentUserId={this.state.currentUserId} />
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
