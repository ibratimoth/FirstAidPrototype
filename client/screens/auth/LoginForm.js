import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/auth";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from 'react-native-toast-message';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [auth, setAuth] = useAuth();
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Both email and username are required.");
      return;
    }

    // Handle the login logic here
    console.log("Email:", email);
    const userData = {
      email,
      password,
    };
    const res = await axios.post(
      "http://192.168.211.147:8082/api/v1/auth/login",
      userData
    );
    if (res.data.success) {
      Alert.alert(res.data.message);
      setAuth({
        ...auth,
        user: res.data.user,
        token: res.data.token,
      });
      await AsyncStorage.setItem(
        "auth",
        JSON.stringify({
          user: res.data.user,
          token: res.data.token,
        })
      );
      navigation.navigate("Home");
    } else {
      Alert.alert(res.data.message);
    }

    // Clear the form and error
    setEmail("");
    setPassword("");
    setError("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.page}>LOGIN HERE</Text>
      <View style = {styles.imgCont}>
      <Image 
        source={require('./../../assets/login2.png')} 
        style={styles.image} 
      />
      </View>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
       <Text style={styles.label}>Password:</Text>
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    autoCapitalize="none"
                    secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
                    <Icon name={passwordVisible ? 'eye-off' : 'eye'} size={24} color="gray" />
                </TouchableOpacity>
            </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
<TouchableOpacity style={styles.button} onPress={handleLogin}>
      <Text style={styles.buttonText}>LOGIN</Text>
  </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("RegisterForm")}>
        <Text style={styles.registerText}>
          Don't have an account? Register here
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontFamily: 'serif'
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 8,
    fontFamily: 'serif',
    fontSize: 15,
    borderRadius: 5
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 25,
    paddingHorizontal: 8,
    borderRadius: 5
},
passwordInput: {
    flex: 1,
    height: 40,
    fontFamily: 'serif',
    fontSize: 15
},
  error: {
    color: "red",
    marginBottom: 12,
  },
  registerText: {
    color: "blue",
    textDecorationLine: "none",
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'serif'
  },
  button:{
    backgroundColor: '#eb6434',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    paddingVertical: 1, // Padding inside the button text
    paddingHorizontal: 10, // Padding inside the button text
    textAlign: 'center',
    fontFamily: 'serif'
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10, // Example of styling
  },
  imgCont: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  page: {
    textAlign: 'center',
    paddingBottom: 10,
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold'
  }
});

export default LoginForm;
