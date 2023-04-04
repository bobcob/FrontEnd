import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View , Button, TextInput , Pressable} from 'react-native';
import { Component } from 'react';
import styles from '/styles/StyleSheet';


export default class App extends Component{





    render() {
    const { navigation } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Sign up</Text>
        <TextInput placeholder = "Email"></TextInput>
        <TextInput placeholder = "Password"></TextInput>
        <TextInput placeholder = "Full name"></TextInput>
        <Button style={styles.button} title = "Sign up" onPress={this.loginHandler}></Button>
      </View>
    );
  }


}
