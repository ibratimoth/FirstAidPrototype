import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NursePage = () => {
  const navigation = useNavigation();

  const navigateToCategoryPage = () => {
    navigation.navigate('Categorypage');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nurse Page</Text>
      <TouchableOpacity style={styles.button} onPress={navigateToCategoryPage}>
        <Text style={styles.buttonText}>Go to Create Category Page</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default NursePage;
