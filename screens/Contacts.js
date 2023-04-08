import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { getReq, getDomain, getAuthToken, getUid } from "./requests";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const getAllContacts = async () => {
    const req = await getReq(getDomain() + "api/contacts/" + (await getUid()));
    console.log(req.json);
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <View>
      <Text>Contacts</Text>
    </View>
  );
}
