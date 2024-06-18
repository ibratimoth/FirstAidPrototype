import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView, TouchableOpacity} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import {useAuth} from './../context/auth'
import axios from 'axios';

const CreateFeedbackPage = () => {
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [comment, setComment] = useState('');
  const [auth] = useAuth()

  useEffect(() => {
    fetchTitles();
  }, []);

  const fetchTitles = async () => {
    try {
      const response = await axios.get('http://192.168.211.147:8082/api/v1/feedback/titles');
      setTitles(response.data.titles);
    } catch (error) {
      console.error('Error fetching titles:', error);
      Alert.alert('Error', 'Failed to fetch titles');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('http://192.168.211.147:8082/api/v1/feedback/create-feedback', {
        title: selectedTitle,
        description: comment,
        user: auth?.user?._id, // Replace 'user_id' with the actual user ID
      });
      Alert.alert('Success', 'Feedback created successfully');
      // Clear form fields after successful submission
      setSelectedTitle('');
      setComment('');
    } catch (error) {
      console.error('Error creating feedback:', error);
      Alert.alert('Error', 'Failed to create feedback');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style = {styles.title}>Title:</Text>
      <Picker
        selectedValue={selectedTitle}
        onValueChange={(itemValue) => setSelectedTitle(itemValue)}
        style={styles.picker}
      >
        {titles.map((title) => (
          <Picker.Item key={title} label={title} value={title} />
        ))}
      </Picker>
      <Text style = {styles.title}>Comment:</Text>
      <TextInput
        style={styles.input}
        onChangeText={setComment}
        value={comment}
        multiline={true}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>SUBMIT</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  picker: {
    borderWidth: 1,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    height: 100,
    borderRadius: 5,
    fontFamily: 'serif'
  },
  title: {
    fontSize: 17,
    fontFamily: 'serif',
    marginBottom: 10
  },
  button:{
    backgroundColor: '#eb6434',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 20
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    paddingVertical: 1, // Padding inside the button text
    paddingHorizontal: 10, // Padding inside the button text
    textAlign: 'center',
    fontFamily: 'serif'
  },
});

export default CreateFeedbackPage;
