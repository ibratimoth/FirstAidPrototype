import { View, Text, StyleSheet, Image } from 'react-native'
import React from 'react'
import Icon from './assets/mysplash.png'

const SplashScreenView = () => {
  return (
    <View style = {styles.container}>
      <Image source={Icon} style= {styles.image}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eb6434'
    },
    image: {
        width: 300,
        height: 200,
        resizeMode: 'cover'
    }
})
export default SplashScreenView