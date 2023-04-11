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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chatPreviews: [],
    };
  }

  getUserChats = async () => {
    const getChatPreviews = await getReq(
      getDomain() + "api/chats/preview/" + (await getUid())
    );
    this.setState({ chatPreviews: getChatPreviews.json });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getUserChats();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  newChat = () => {
    const { navigation } = this.props;
    navigation.navigate("newChat");
  };

  renderChatPreview = ({ item }) => {
    const { navigation } = this.props;
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
          <Text style={styles.chatTitle}>Title</Text>
          <Text style={styles.chatMessage}>{item.message}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Chats</Text>
        <TouchableOpacity style={styles.newChatButton} onPress={this.newChat}>
          <Text style={styles.buttonText}>New Chat</Text>
        </TouchableOpacity>
        <FlatList
          contentContainerStyle={styles.chatPreviews}
          data={this.state.chatPreviews}
          renderItem={this.renderChatPreview}
          keyExtractor={(item) => item.id.toString()}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
    alignItems: "center",
  },
  chatPreviewContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
    width: "90%",
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
