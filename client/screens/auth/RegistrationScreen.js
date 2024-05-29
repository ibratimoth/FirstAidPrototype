// RegistrationScreen.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/Ionicons";

const RegistrationScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [sport, setSport] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleRegister = async () => {
    if (!email || !username || !password || !contact || !city || !sport) {
      setError("All fields are required.");
      return;
    }

    // Simulate a successful registration
    setError("");
    const userData = {
      username,
      email,
      password,
      contact,
      city,
      sport,
    };
    const res = await axios.post(
      "http://192.168.211.231:8082/api/v1/auth/register",
      userData
    );
    if (res.data.success) {
      Alert.alert(res.data.message);
      setSuccess("Registration successful!");
      navigation.navigate("LoginForm");
    } else {
      Alert.alert(res.data.message);
    }
    // clear form
    setUsername(" ");
    setPassword(" ");
    setEmail(" ");
    setContact(" ");
    setCity(" ");
    setSport(" ");
    // Optionally, navigate to the Login screen or Home screen after registration
    // navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.page}>REGISTER HERE</Text>
      <View style={styles.imgCont}>
        <Image
          source={require("./../../assets/login2.png")}
          style={styles.image}
        />
      </View>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Enter your username"
        autoCapitalize="none"
      />
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
          <Icon
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        value={contact}
        keyboardType={"numeric"}
        onChangeText={setContact}
        placeholder="Enter your contact"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="Enter your city"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={sport}
        onChangeText={setSport}
        placeholder="Enter your favourite sport"
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {success ? <Text style={styles.success}>{success}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("LoginForm")}>
        <Text style={styles.registerText}>
          Already have account ? Login here
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
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    fontFamily: "serif",
    fontSize: 15,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  passwordInput: {
    flex: 1,
    height: 40,
    fontFamily: "serif",
    fontSize: 15,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 12,
    textAlign: "center",
  },
  success: {
    color: "green",
    marginBottom: 12,
    textAlign: "center",
  },
  registerText: {
    color: "blue",
    textDecorationLine: "none",
    textAlign: "center",
    fontSize: 17,
    fontFamily: "serif",
  },
  button: {
    backgroundColor: "#eb6434",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 17,
    color: "#fff",
    paddingVertical: 1, // Padding inside the button text
    paddingHorizontal: 10, // Padding inside the button text
    textAlign: "center",
    fontFamily: "serif",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10, // Example of styling
  },
  imgCont: {
    justifyContent: "center",
    alignItems: "center",
  },
  page: {
    textAlign: "center",
    paddingBottom: 10,
    fontSize: 20,
    fontFamily: "serif",
    fontWeight: "bold",
  },
});

export default RegistrationScreen;
