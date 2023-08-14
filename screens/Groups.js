import React, { Component } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity  , Button} from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { getDomain, getReq, getUid } from "./requests";

const Stack = createNativeStackNavigator();

class GroupCard extends Component {
  render() {
    const { name, organisationId, onPress } = this.props;

    return (
      <View style={styles.card}>
        <Text style={styles.boldText}>{name}</Text>
        <Text>Organisation ID: {organisationId}</Text>
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>View</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class App extends Component {
  state = {
    groups: [],
  };
  
  getGroups = async () => {
    const getGroups = await getReq(getDomain() + "api/organisations/" + (await getUid()));
    this.setState({ groups: getGroups.json });
  };

  componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.getGroups();
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { groups } = this.state;
    const { navigation } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.newGroupButtonContainer}>
          <TouchableOpacity
            style={styles.newGroupButton}
            onPress={() => navigation.navigate("newGroup")}
          >
            <Text style={styles.newGroupButtonText}>New Group</Text>
          </TouchableOpacity>
        </View>
        {groups.map((group) => (
          <GroupCard
            key={group.id}
            name={group.name}
            organisationId={group.organisationId}
            onPress={() => navigation.navigate("GroupInformation", { group })}
          />
        ))}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  newGroupButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 10,
  },
  newGroupButton: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  newGroupButtonText: {
    color: "#fff",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default App;
