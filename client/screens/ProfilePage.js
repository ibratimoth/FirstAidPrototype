import React, { useContext } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Avatar, Title } from "react-native-paper";
import { useAuth } from "../context/auth";

const ProfilePage = () => {
  const [auth, setAuth] = useAuth();
  const navigation = useNavigation();

  const navigateToUpdateProfile = () => {
    navigation.navigate("Updateprofile");
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        <View
          style={{
            marginTop: 5,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
          }}
        >
          <Avatar.Image
            source={{
              uri: "https://cdn-icons-png.freepik.com/256/847/847969.png?ga=GA1.1.1665601381.1712936655&semt=ais_hybrid",
            }}
            size={150}
            style={{ marginTop: 5 }}
          />
        </View>
        <View style={styles.row}>
          <Icon name="lead-pencil" color="#eb6434" size={20} />
          <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
            {auth?.user?.username}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#eb6434" size={20} />
          <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
            {auth?.user?.city}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#eb6434" size={20} />
          <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
            {auth?.user?.contact}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#eb6434" size={20} />
          <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
            {auth?.user?.email}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="basketball" color="#eb6434" size={20} />
          <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
            {auth?.user?.sport}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={navigateToUpdateProfile}
        >
          <Text style={styles.buttonText}>UPDATE PROFILE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  profileInfo: {
    marginBottom: 20,
  },
  userInfoSection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 25,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f2e0cd",
    padding: 10,
    borderRadius: 5
  },
  button: {
    backgroundColor: "#eb6434",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 17,
    color: "#fff",
    paddingVertical: 1, // Padding inside the button text
    paddingHorizontal: 10, // Padding inside the button text
    textAlign: "center",
    fontFamily: "serif",
  },
});

export default ProfilePage;
