import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getReq, getDomain, getAuthToken, getUid } from "./requests";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, TextInput } from "react-native-web";

const ContactCard = ({ contact }) => {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.name}>{contact.name}</Text>
      <Text style={styles.email}>{contact.email}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Manage</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const ContactList = ({ contacts }) => {
  return (
    <FlatList
      data={contacts}
      keyExtractor={(contact) => contact.id.toString()}
      renderItem={({ item }) => <ContactCard contact={item} />}
      style={styles.list}
    />
  );
};

export default function App({ navigation }) {
  const [contacts, setContacts] = useState([]);

  const getAllContacts = async () => {
    const req = await getReq(getDomain() + "api/contacts/" + (await getUid()));
    const data = await req.json;
    setContacts(data);
  };

  const handleAddContact = () => {
    navigation.navigate("addContact");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getAllContacts();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Contacts</Text>
      <Button
        style={styles.button}
        title="Add contact"
        onPress={handleAddContact}
      ></Button>
      <ContactList contacts={contacts} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
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
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
