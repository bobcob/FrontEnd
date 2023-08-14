import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  FlatList,
} from "react-native";
import { getDomain, getReq, getUid } from "./requests";

// importing all the custom and inbuilt functions to use in the code

export default class App extends Component {

  // rendering the two arrays needed in the stae chatPreviews and visible chat previews
  constructor(props) {
    super(props);
    this.state = {
      chatPreviews: [],
      visibleChatPreviews: [],
    };
  }
  // function which gets the chats which the user is part of 
  getUserChats = async () => {
    // variable stores all the chats the chat objects the user is a part of
    const getChatPreviews = await getReq(
      getDomain() + "api/chats/preview/" + (await getUid())
    );
    // filtering out any chats with null values , when a chat has been created but no messages have been sent
    const filteredChatPreviews = getChatPreviews.json.filter(
      (item) => item !== null
    );
    // if the chat is part of a group it will have a organisationId , filtering all those that do and not rendering them
    const visibleChatPreviews = filteredChatPreviews.filter(
      (item) => item.organisationId === null
    );
    // setting them in the state for rendering
    this.setState({ chatPreviews: filteredChatPreviews, visibleChatPreviews });
  };
  // getting the chats when the page is loaded
  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getUserChats();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }
  // navigating to the new chat screen
  newChat = () => {
    const { navigation } = this.props;
    navigation.navigate("newChat");
  };
    // dynamically creating each chat preview , passing in a item from the flatlist and rendering its properties 
  renderChatPreview = ({ item }) => {
    // if the chat has a organisationId do not render it
    if (item.organisationId !== null) {
      console.log(item.organisationId);
      return null;
    }
    
    /*
    rendering the message previews by their characteristics
    each render is able to be clicked , going to the naviagtion screen to render the whole chat. Passing with it a chat id variable
    */
    return (
      <TouchableOpacity
        style={styles.chatPreviewContainer}
        onPress={() => {
          this.props.navigation.navigate("Conversation", {
            chatId: item.chatId,
          });
        }}
      >
        <View>
          <Text style={styles.chatTitle}>{item.title}</Text>
          <Text style={styles.chatMessage}>{item.message}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  

  render() {
    // getting the visible chat previews from the state 
    const { visibleChatPreviews } = this.state;

    /*
    Rendering the screen with a new chat button and a conditional statment incase the user
    is in no chats

    The flatlist both renders the renderChatPreviews and iterates through visibleChatPreviews
    sending each item to the variabel for population
    
    */

    return (
      <View style={styles.container}>
        <Text style={styles.header}></Text>
        <TouchableOpacity style={styles.newChatButton} onPress={this.newChat}>
          <Text style={styles.buttonText}>New Chat</Text>
        </TouchableOpacity>
        {visibleChatPreviews.length === 0 ? (
          <Text style={styles.noChatsMessage}>
            You are currently in no chats, use the button above to create a new one!
          </Text>
        ) : (
          <FlatList
            contentContainerStyle={styles.chatPreviews}
            data={visibleChatPreviews}
            renderItem={this.renderChatPreview}
            keyExtractor={(item) => item.id.toString()}
          />
        )}
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  header: {
    fontSize: 24,
    marginTop: 70,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  newChatButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  chatPreviews: {
    alignSelf: "stretch",
  },
  chatPreviewContainer: {
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
  noChatsMessage: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 30,
  },
});
