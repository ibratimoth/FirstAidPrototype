import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Avatar, Title } from "react-native-paper";
import { Caption } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Field from "../auth/Field";
import { useRoute } from "@react-navigation/native";


const EditProfile = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [city, setCity] = useState('')
  const [sport, setSport] = useState('')
  const route = useRoute()
  // const [image, setImage] = useState("");
  // const [modalVisible, setModalVisible] = useState(false)

// const uploadImage = async () => {
//   try {
//     await ImagePicker
//     requestCameraPermissionsAsync()
//     let result = await ImagePicker
//     launchCameraAsync({
//       cameraType: ImagePicker.CameraType.front,
//       allowsEditing: true,
//       aspect: [1,1],
//       quality: 1,
//     })

//     if (!result.canceled){
//       await saveImage(result.assets[0].uri)
//     }
//   } catch (error) {
//     alert("Error uploading image: " + error.message)
//     setModalVisible(false)
//   }
// }

// const saveImage = async (image) => {
//   try {
//     setImage(image)
//     setModalVisible(false)
//   } catch (error) {
//     throw error
//   }
// }
  // async function getData() {
  //   const token = await AsyncStorage.getItem("token");
  //   console.log(token);
  //   axios
  //     .post("http://192.168.211.231:8080/api/v1/auth/getsingleUser", {
  //       token: token,
  //     })
  //     .then((res) => {
  //       console.log(res.data);
  //       setUserData(res.data.data);
  //     });
  // }

  // useEffect(() => {
  //   getData();
  // }, []);

  // useEffect(() => {
  //   const userData = route.params.data
  //   setName(userData.name)
  //   setEmail(userData.email)
  //   setContact(userData.contact)
  //   setCity(userData.city)
  //   setSport(userData.sport)
  // })
  const updateProfile = () => {
    const formdata = {
      name: name,email, contact, city, sport
    }
    axios
      .post("http://192.168.211.231:8080/api/v1/auth/update-user", formdata)
      .then((res) => {
        console.log(res.data);
        navigation.navigate('Profile')
      });
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.userInfoSection}>
        <View
          style={{
            flexDirection: "column",
            marginTop: 15,
            alignItems: "center",
            justifyContent: "center",
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
      </View>
      <View
        style={{
          backgroundColor: "white",
          height: 730,
          paddingTop: 20,
          borderTopLeftRadius: 90,
          borderTopRightRadius: 90,
        }}
      >
        <View
          style={{
            height: 730,
            width: 400,
            paddingTop: 70,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e8e1e6",
              borderRadius: 100,
            }}
          >
            <FontAwesome
              name="user"
              color={"#345ea3"}
              style={{ marginRight: 10, fontSize: 24 }}
            />
            
            <Field
            
            placeholder="Your Name"
              value={name}
              onChange = {e => setName(e.nativeEvent.text)}
            />
          </View>
          <View
            style={{
              width: "85%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e8e1e6",
              borderRadius: 100,
              marginVertical: 15,
            }}
          >
            <MaterialIcons
              name="email"
              color={"#345ea3"}
              style={{ marginRight: 10, fontSize: 24 }}
            />
            <Field
              placeholder="Your Email"
              keyboardType={"email-address"}
              value={email}
              onChange = {e => setEmail(e.nativeEvent.text)}
            />
          </View>
          <View
            style={{
              width: "85%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e8e1e6",
              borderRadius: 100,
            }}
          >
            <FontAwesome
              name="phone"
              color={"#345ea3"}
              style={{ marginRight: 10, fontSize: 24 }}
            />
            <Field
            placeholder="Your Contact"
              keyboardType={'numeric'}
              value={contact}
              onChange = {e => setContact(e.nativeEvent.text)}
            />
          </View>
          <View
            style={{
              width: "85%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e8e1e6",
              borderRadius: 100,
              marginVertical: 15,
            }}
          >
            <MaterialIcons
              name="place"
              color={"#345ea3"}
              style={{ marginRight: 10, fontSize: 24 }}
            />
            <Field
              placeholder="Your City"
              value={city}
              onChange = {e => setCity(e.nativeEvent.text)}
            />
          </View>
          <View
            style={{
              width: "85%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#e8e1e6",
              borderRadius: 100,
            }}
          >
            <MaterialIcons
              name="sports"
              color={"#345ea3"}
              style={{ marginRight: 10, fontSize: 24 }}
            />
            <Field
              placeholder="Your favourite sport"
              value={sport}
              onChange = {e => setSport(e.nativeEvent.text)}
            />
          </View>
          <TouchableOpacity
            style={{
              backgroundColor: "#eb6434",
              borderRadius: 100,
              alignItems: "center",
              width: 300,
              paddingVertical: 5,
              marginTop: 30,
              marginBottom: 40,
            }}
            onPress={() => updateProfile()}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              UPDATE YOUR PROFILE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
    // <View style = {styles.container}>
    //   <Text style = {styles.headingStyle}>{userData.name}</Text>
    //   <Text style = {styles.textStyle}>{userData.email}</Text>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eb6434",
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: "500",
    color: "#345ea3",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: "#dddddd",
    borderBottomWidth: 1,
    borderTopColor: "#dddddd",
    borderTopWidth: 1,
    flexDirection: "row",
    height: 100,
  },
  infoBox: {
    width: "50%",
    alignItems: "center",
    justifyContent: "center",
  },
  menuWrapper: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuItemText: {
    color: "#345ea3",
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 18,
    lineHeight: 26,
  },
});

export default EditProfile;
