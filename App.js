
import React from "react";
import { StyleSheet, Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screens/Login";
import signUp from "./screens/signUp";
import Chats from "./screens/Chats";
import addContact from "./screens/addContact";
import Contacts from "./screens/Contacts";
import manageContact from "./screens/manageContact";
import settingsPage from "./screens/Settings";
import Conversation from "./screens/Conversation";
import newChat from "./screens/newChat";
import ChatInformation from "./screens/ChatInformation";
import {TouchableOpacity } from "react-native-web";
import { getTargetChatContacts } from "./screens/requests";
import ManageContactInChat from "./screens/ManageContactInChat";
import addContactToChat from "./screens/addContactToChat";
import Groups from "./screens/Groups";
import GroupInformation from "./screens/GroupInformation";
import newGroup from "./screens/newGroup";
import addUserToGroup from "./screens/addUserToGroup";
import ManageContactInGroup from "./screens/ManageContactInGroup";

// Importing all the screens from the folder making them available for later use

// creating both tab and stack navigators respectivly

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// defining a function main

function Main() {
  /*
  * building the tab navigator and importing the respective screens
  *These will all appear at the bottom of the application once logged in
  */
  return (
    <Tab.Navigator initialRouteName="mainNavigation">
      <Tab.Screen name="Chats" component={Chats} />
      <Tab.Screen name="Contacts" component={Contacts} />
      <Tab.Screen name="Groups" component={Groups} />
      <Tab.Screen name="Settings" component={settingsPage} />
    </Tab.Navigator>
  );
}
// defining the function main
function App() {
  return (
    /*

    Here the screens in the stack naviagtor are imported and defined , these are only able to be 
    naviagted to via on screen prompts

    The conversation stack screen has a button inside it and for athestical purpopes I wanted it defined in the header
    bar itself. As a result of this it has to be defined at this level hence the logic

    A function named fetchTargetChatContactsAndNavigate is used and the value is passed as a paramater to the next screen

    The remaining screens are imported and placed on the navigator

    */
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
        <Stack.Screen name="GroupInformation" component={GroupInformation} />
        <Stack.Screen name="newGroup" component={newGroup} />
        <Stack.Screen name="addUserToGroup" component={addUserToGroup} />
        <Stack.Screen name="ManageContactInGroup" component={ManageContactInGroup} />
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
