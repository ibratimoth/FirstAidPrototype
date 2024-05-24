import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const TechnicalContentPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchTechnicalFeedback();
  }, []);

  const fetchTechnicalFeedback = async () => {
    try {
      const response = await axios.get('http://192.168.211.231:8082/api/v1/feedback/technical-feedback');
      setFeedbackList(response.data.feedback);
    } catch (error) {
      console.error('Error fetching technical feedback:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Technical Feedback</Text>
      <FlatList
        data={feedbackList}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.feedbackItem}>
            <Text>Title: {item.title}</Text>
            <Text>Description: {item.description}</Text>
            <Text>User: {item.username}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default TechnicalContentPage;
