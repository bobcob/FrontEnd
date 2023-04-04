import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import styles from '/styles/StyleSheet';
import { Component } from 'react';
import { Button, TextInput } from 'react-native-web';

export default class App extends Component{

  constructor(props){

    super(props);

    this.state = {
      email:'',
      password:'',
    }

  }

    loginHandler = () => {
      console.log("login");

    }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
        <TextInput placeholder = "Email"></TextInput>
        <TextInput secureTextEntry={true} placeholder = "Password"></TextInput>
        <Button style={styles.button} title = "Log in" onPress={this.loginHandler}></Button>
      </View>
    );
  }
}
