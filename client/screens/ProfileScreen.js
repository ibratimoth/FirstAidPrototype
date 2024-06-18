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
import { useNavigation } from '@react-navigation/native'

const ProfileScreen = () => {

  const navigation = useNavigation()
  const [userData, setUserData] = useState("");
  async function getData() {
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    axios
      .post("http://192.168.211.147:8080/api/v1/auth/getsingleUser", {
        token: token,
      })
      .then((res) => {
        console.log(res.data);
        setUserData(res.data.data);
      });
  }

  useEffect(() => {
    getData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate('editprofile', {data: userData}) }>
        <View style={{marginVertical: 15, flexDirection: 'row', justifyContent: 'center', }}>
          <Text style={{fontSize: 20, color: 'white', paddingRight: 170}}>Your Profile</Text>
          <Icon name="account-edit" color="white" size={35} />
        </View>
      </TouchableOpacity>
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
            size={80}
            style={{ marginTop: 5 }}
          />
          <View style={{ marginLeft: 20 }}>
            <Title
              style={[
                styles.title,
                {
                  marginTop: 15,
                  marginBottom: 5,
                },
              ]}
            >
              {userData.name}
            </Title>
          </View>
        </View>
      </View>
      <View
        style={{
          backgroundColor: "white",
          height: 730,
          paddingTop: 70,
          borderTopLeftRadius: 90,
          borderTopRightRadius: 90,
        }}
      >
        <View style={styles.userInfoSection}>
          <View style={styles.row}>
            <Icon name="map-marker-radius" color="#eb6434" size={20} />
            <Text style={{ color: "#345ea3", marginLeft: 20, fontSize: 18 }}>
              {userData.city}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="phone" color="#eb6434" size={20} />
            <Text style={{ color: "#345ea3", marginLeft: 20, fontSize: 18 }}>
              {userData.contact}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="email" color="#eb6434" size={20} />
            <Text style={{ color: "#345ea3", marginLeft: 20, fontSize: 18 }}>
              {userData.email}
            </Text>
          </View>
        </View>
        <View style={styles.menuWrapper}>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="heart-outline" color="#eb6434" size={25} />
              <Text style={styles.menuItemText}>Your Favourite</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="share-outline" color="#eb6434" size={25} />
              <Text style={styles.menuItemText}>Tell your friends</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icon name="account-check-outline" color="#eb6434" size={25} />
              <Text style={styles.menuItemText}>Support</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.menuItem}>
              <Icons name="settings-outline" color="#eb6434" size={25} />
              <Text style={styles.menuItemText}>Settings</Text>
            </View>
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
export default ProfileScreen;
