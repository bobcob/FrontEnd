import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import styles from '/styles/StyleSheet';
import { Component } from 'react';
import { Button, TextInput } from 'react-native-web';
import { getReq, getPost } from './requests';

export default class App extends Component{

  constructor(props){

    super(props);

    this.state = {
      email:'',
      password:'',
    }

  }

    loginHandler = async() => {
      const text = await getReq("https://jsonplaceholder.typicode.com/todos/1");
      console.log(text);
    }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Login</Text>
        <TextInput placeholder = "Email"></TextInput>
        <TextInput secureTextEntry={true} placeholder = "Password"></TextInput>
        <Button style={styles.button} title = "Log in" onPress={this.loginHandler}></Button>
        <Pressable onPress={() => navigation.navigate('signUp')}>
            <Text>Not got an account? Sign up here</Text>
        </Pressable>
      </View>
    );
  }
}
