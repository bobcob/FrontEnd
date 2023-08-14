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
class MessagePreview extends Component {
  render() {
   
    const { message, onPress , } = this.props;
    return (
      <TouchableOpacity onPress={onPress} style={styles.messagePreviewContainer}>
        <Text style={styles.chatTitle}>{message.title}</Text>
        <Text style={styles.chatMessage}>{message.message}</Text>
        <Text style={styles.chatTime}>{message.time}</Text>
      </TouchableOpacity>
    );
  }
}
class ContactCard extends Component {
  
  
  handleManage = (contact) => {
    const { group } = this.props.route.params;
    this.props.navigation.navigate("ManageContactInGroup", {
      group,
      groupID:group.organisationId,
      contactID: contact.id,
    });
  };


  render() {
    const { contact, navigation } = this.props;
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
    const { contacts, navigation, route } = this.props;
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
      messages: [],
      currentUserId: null,
    };
  }

  getCurrentUserId = async () => {
    const id = await getUid();
    this.setState({ currentUserId: Number(id) });
  };
  handleMessagePreviewClick = (message) => {
    console.log(message);
    const chatId = message.chatId;
    this.props.navigation.navigate("Conversation", { 
      groupID: message.organisationId,
      chatId,
     
    });
  };

  renderMessagePreview = ({ item }) => {
    return <MessagePreview message={item} onPress={() => this.handleMessagePreviewClick(item)} />;
  };


  getAllContacts = async () => {
    const { group} = this.props.route.params;
    console.log(group);
    const req = await getReq(
      getDomain() + "api/organisations/group/" + group.organisationId + "/users"
    );
    const data = await req.json;
    this.setState({ contacts: data });
  };

  getMessages = async () => {
    const { group } = this.props.route.params;
    const getMessages = await getReq(
      getDomain() + "api/organisations/group/" + group.organisationId + "/messages/" + await getUid()
    );
    const data = await getMessages.json.chats;
    if (!data) {
      this.setState({ messages: [] });
    } else {
      this.setState({ messages: data });
    }
  };


  handleAddContact = () => {
    const { group } = this.props.route.params;
    this.props.navigation.navigate("addUserToGroup", {
      group
    });
  };

  handleNewChat = () => {
    const { group } = this.props.route.params;
    console.log(group.organisationId);
    this.props.navigation.navigate("newChat", {
      groupID: group.organisationId
    });
  };
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getMessages();
       this.getAllContacts();
       this.getCurrentUserId();
       this.props.navigation.setOptions({ title: "Group information" });
    });
  }

  getTitle = async () => {
    const title = await getReq(
      getDomain() + "api/chats/" + (await getTargetChatContacts()) + "/title"
    );
    return title.json.title;
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { contacts , messages} = this.state;
    
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Threads</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={this.handleNewChat}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={messages}
          keyExtractor={(message) => message.id.toString()}
          renderItem={this.renderMessagePreview}
          style={styles.list}
        />
        <View style={styles.header}>
          <Text style={styles.heading}>Users in group</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={this.handleAddContact}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
        <ContactList contacts={contacts} navigation={this.props.navigation} route={this.props.route} currentUserId={this.state.currentUserId} />

      </View>
    );
    }}  

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
  messagePreviewContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  chatMessage: {
    fontSize: 16,
    fontWeight: "500",
  },
  chatTime: {
    fontSize: 12,
    color: "#aaa",
  },
});
