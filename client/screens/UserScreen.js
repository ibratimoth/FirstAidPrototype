import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const UserScreen = () => {
  return (
    <View style = {styles.container}>
    <Text style = {styles.headingStyle}>React Navigation</Text>
    <Text style = {styles.textStyle}>User Screen</Text>
  </View>
  )
}

const styles = StyleSheet.create({
    container: {
       display: 'flex',
       justifyContent : 'center',
       alignItems: 'center',
       flex: 1,
     },
     textStyle: {
       fontSize: 28,
       color: 'black',
     },
     headingStyle: {
       fontSize: 30,
       color: 'black',
       textAlign: 'center'
     }
   })
export default UserScreen