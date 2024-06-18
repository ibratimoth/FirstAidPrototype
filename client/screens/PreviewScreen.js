import React from "react";
import { View, Text, Image, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useAuth } from "../context/auth";

const PreviewScreen = ({ route }) => {
  const { imageUri } = route.params;
  const navigation = useNavigation();
  const [auth, setAuth] = useAuth();

  const handleSavePhoto = async () => {
    if (imageUri) {
      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: "image/jpeg",
        name: "profilePic.jpg",
      });

      try {
        const response = await axios.post("http://192.168.211.147:8082/api/v1/auth/profile-picture", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.data.success) {
          Alert.alert("Success", "Profile picture updated successfully");
          setAuth((prev) => ({
            ...prev,
            user: {
              ...prev.user,
              profilePic: {
                url: response.data.url,
              },
            },
          }));
          navigation.goBack();
        }
      } catch (error) {
        console.log(error);
        Alert.alert("Error", "Failed to update profile picture");
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <TouchableOpacity style={styles.button} onPress={handleSavePhoto}>
        <Text style={styles.buttonText}>SAVE PHOTO</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#eb6434",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
    fontFamily: "serif",
  },
});

export default PreviewScreen;
