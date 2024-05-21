import React, { useState, useContext } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/auth";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/Ionicons";

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
      "http://192.168.211.231:8082/api/v1/auth/login",
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

      <Button title="Login" onPress={handleLogin} />
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
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
},
passwordInput: {
    flex: 1,
    height: 40,
},
  error: {
    color: "red",
    marginBottom: 12,
  },
  registerText: {
    color: "blue",
    textDecorationLine: "underline",
  },
 
});

export default LoginForm;
