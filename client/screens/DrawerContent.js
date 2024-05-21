import { View, Text, StyleSheet } from 'react-native'
import React, {useState, useEffect} from 'react'
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { Avatar, Title } from 'react-native-paper'
import  Icon  from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'
import Toast from 'react-native-toast-message';
import {useAuth} from '../context/auth'
const DrawerList = [
    {icon: 'home-outline', label: 'Home', navigateTo: 'Home'},
    {icon: 'account-multiple', label: 'Profile', navigateTo: 'Profile'},
    {icon: 'account-group', label: 'User', navigateTo: 'User'},
    {icon: 'login-variant', label: 'Admin', navigateTo: 'Admin'},
    {icon: 'login-variant', label: 'Nurse', navigateTo: 'Nurse'},
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
          return item.navigateTo !== 'Admin' && item.navigateTo !== 'Nurse';
        } else if (auth?.user?.role === 2) {
          return item.navigateTo !== 'Admin';
        } else {
          return true; // Show all items for role 1
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
    function signOut(){
        AsyncStorage.setItem("isLoggedIn", "")
        AsyncStorage.setItem('token', '')
        Toast.show({
            type: 'success',
            text1: 'Congratulation !!',
            text2: 'Logout successfully',
            visibilityTime: 5000
          })
        navigation.navigate('Login')
    }

//     const [userData, setUserData] = useState('')
//   async function getData(){
//     const token = await AsyncStorage.getItem('token') 
//     console.log(token);
//     axios.post("http://192.168.211.231:8080/api/v1/auth/getsingleUser", {token: token})
//     .then(res => {console.log(res.data);
//     setUserData(res.data.data)})
//   }

//   useEffect(() => {
//     getData();
//   }, [])
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
                <DrawerItems/>
            </View>
        </View>
      </DrawerContentScrollView>
      <View style={styles.bottomDrawerSection}>
            <DrawerItem
            onPress={() => signOut()}
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
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 13,
        lineHeight: 14
    },
    drawerSection: {
        marginTop: 25,
        paddingLeft: 15,
        borderBottomColor: '#e3e3de',
        borderBottomWidth: 1
    },
    bottomDrawerSection: {
        borderTopColor: '#e3e3de',
        borderTopWidth: 1,
        borderBottomWidth: 0,
    }
})
export default DrawerContent