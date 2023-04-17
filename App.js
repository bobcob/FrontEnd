import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Settings, StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screens/Login";
import signUp from "./screens/signUp";
import Circles from "./screens/Circles";
import Chats from "./screens/Chats";
import addContact from "./screens/addContact";
import Contacts from "./screens/Contacts";
import manageContact from "./screens/manageContact";
import settingsPage from "./screens/Settings";
import Conversation from "./screens/Conversation";
import newChat from "./screens/newChat";
import ChatInformation from "./screens/ChatInformation";
import { Button, TextInput, TouchableOpacity } from "react-native-web";
import { getTargetChatContacts } from "./screens/requests";
import ManageContactInChat from "./screens/ManageContactInChat";
import addContactToChat from "./screens/addContactToChat";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Main() {
  return (
    <Tab.Navigator initialRouteName="mainNavigation">
      <Tab.Screen name="Circles" component={Circles} />
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Settings" component={settingsPage} />
    </Tab.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoggedOutNav">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="signUp" component={signUp} />
        <Stack.Screen name="addContact" component={addContact} />
        <Stack.Screen name="manageContact" component={manageContact} />
        <Stack.Screen
          name="Conversation"
          component={Conversation}
          options={({ route, navigation }) => ({
            headerRight: () => {
              const fetchTargetChatContactsAndNavigate = async () => {
                const targetChatContacts = await getTargetChatContacts();
                navigation.navigate("ChatInformation", {
                  targetChatContacts,
                });
              };

              return (
                <TouchableOpacity
                  onPress={fetchTargetChatContactsAndNavigate}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Chat Information</Text>
                </TouchableOpacity>
              );
            },
          })}
        />
        <Stack.Screen name="ChatInformation" component={ChatInformation} />
        <Stack.Screen name="addContactToChat" component={addContactToChat} />
        <Stack.Screen
          name="ManageContactInChat"
          component={ManageContactInChat}
        />
        <Stack.Screen name="newChat" component={newChat} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default App;
