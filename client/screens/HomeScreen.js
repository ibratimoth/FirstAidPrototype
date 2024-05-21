// HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button ,BackHandler, Alert} from 'react-native';
import { useAuth } from '../context/auth';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = ({  navigation }) => {
//   const { email } = route.params;
 const [auth, setAuth] = useAuth()
  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    })
    AsyncStorage.removeItem("auth")
    // Implement your logout logic here, for now, we will just navigate back to the login screen
    Alert.alert("Loged out successfully")
    navigation.navigate('LoginForm');
  };

  const handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are sure you want to exit ?',
      [{
        text: 'Cancel',
        onPress : () => null,
        style: 'cancel'
      },{
        text: 'Exit',
        onPress : () => BackHandler.exitApp(),
      }]
    )
    return true
  }

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress)

   return() => {
    BackHandler.removeEventListener('hardwareBackPress', handleBackPress)
   }
    })
  )
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Screen</Text>
      <Text style={styles.text}>You are logged in as {auth?.user?.username}</Text>
      <Text>{JSON.stringify(auth, null, 4)}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
});

export default HomeScreen;
