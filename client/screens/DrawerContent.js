import { View, Text, StyleSheet, Alert } from 'react-native'
import React, {useState, useEffect} from 'react'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Title } from 'react-native-paper'
import  Icon  from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'
import Toast from 'react-native-toast-message';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import {useAuth} from '../context/auth'

const DrawerList = [
    {icon: 'home-outline', label: 'Home', navigateTo: 'Home'},
    {icon: 'account-multiple', label: 'Profile', navigateTo: 'Profile'},
    {icon: 'login-variant', label: 'Admin', navigateTo: 'Admin'},
    {icon: 'login-variant', label: 'Nurse', navigateTo: 'Nurse'},
    {icon: 'message', label: 'feedback', navigateTo: 'feedback'},
    {icon: 'message-alert', label: 'T-feedback', navigateTo: 'technical'},
    {icon: 'message-alert', label: 'C-feedback', navigateTo: 'contentfeed'},
]

const DrawerLayout = ({icon, label, navigateTo}) => {
    const navigation = useNavigation()

    return(
        <DrawerItem
            icon = {({color, size}) => <Icon name={icon} color={color} size={size}/>}
            label = {label}
            onPress={() => {
                navigation.navigate(navigateTo)
            }}
        />
    )
}

const DrawerItems = props => {
    const [auth, setAuth] = useAuth()

    // const filteredDrawerList = auth?.user?.role === 1
    // ? DrawerList
    // : DrawerList.filter(item => item.navigateTo !== 'Admin');
    const filteredDrawerList = DrawerList.filter(item => {
        if (auth?.user?.role === 0) {
          return item.navigateTo !== 'Admin' && item.navigateTo !== 'Nurse' && item.navigateTo !== 'technical' && item.navigateTo !== 'contentfeed';
        } else if (auth?.user?.role === 2) {
          return item.navigateTo !== 'Admin' && item.navigateTo !== 'technical';
        } else {
        //   return true; // Show all items for role 1
          return item.navigateTo !== 'Nurse' && item.navigateTo !== 'contentfeed' && item.navigateTo !== 'feedback';
        }
      });
    return filteredDrawerList.map((el, i) => {
        return (
            <DrawerLayout
                key = {i}
                icon = {el.icon}
                label={el.label}
                navigateTo={el.navigateTo}
            />
        )
    })
}
const DrawerContent = (props) => {
    const [auth, setAuth] = useAuth()
    const navigation = useNavigation()
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

// Load Google Fonts
let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Roboto_400Regular,
  })

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style = {styles.drawerContent}>
            <TouchableOpacity activeOpacity={0.8}>
                <View style = {styles.userInfoSection}>
                    <View style = {{flexDirection: 'row', marginTop: 15}}>
                        <Avatar.Image
                            source = {{
                                uri: 'https://cdn-icons-png.freepik.com/256/847/847969.png?ga=GA1.1.1665601381.1712936655&semt=ais_hybrid'
                            }}
                            size={50}
                            style = {{marginTop: 5}}
                        />
                        <View style = {{marginLeft: 10, flexDirection: 'column'}}>
                            <Title style = {styles.title}>{auth?.user?.username}</Title>
                            <Text style = {styles.caption} numberOfLines={1}>
                            {auth?.user?.email}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.drawerSection}>
                <DrawerItems style={styles.drawerIt}/>
            </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
            <DrawerItem
            onPress={() => handleLogout()}
                icon={({color, size}) => (
                    <Icon name = 'exit-to-app' color = {color} size = {size}/>
                )}
                label = 'Sign Out'
            />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    drawerContent:{
        flex: 1,
    },
    userInfoSection:{
        paddingLeft: 20,
        fontFamily: 'Roboto_400Regular'
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
        fontFamily: 'Roboto_400Regular'
    },
    caption: {
        fontSize: 13,
        lineHeight: 14,
        fontFamily: 'Roboto_400Regular'
    },
    drawerSection: {
        marginTop: 25,
        paddingLeft: 15,
        borderBottomColor: '#e3e3de',
        borderBottomWidth: 1,
    },
    bottomDrawerSection: {
        borderTopColor: '#e3e3de',
        borderTopWidth: 1,
        borderBottomWidth: 0,
    },
    drawerIt:{
        fontFamily: 'Roboto_400Regular'
    }
})
export default DrawerContent