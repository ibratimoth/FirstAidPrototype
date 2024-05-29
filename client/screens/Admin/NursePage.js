import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/auth';

const NursePage = () => {
  const navigation = useNavigation();
  const [auth] = useAuth()

  const navigateToCategoryPage = () => {
    navigation.navigate('Categorypage');
  };

  const navigateToContentManagementPage = () => {
    navigation.navigate('contents');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>You are Welcome {auth?.user?.username}</Text>
      <TouchableOpacity style={styles.button} onPress={navigateToCategoryPage}>
        <Text style={styles.buttonText}>Go to Create Category Page</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={navigateToContentManagementPage}>
        <Text style={styles.buttonText}>Go to Content Management Page</Text>
      </TouchableOpacity>
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'serif'
  },
  button: {
    backgroundColor: '#f2e0cd',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10, // Added margin to separate the buttons
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'serif'
  },
});

export default NursePage;
