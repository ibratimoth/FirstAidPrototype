import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from 'axios';

const TechnicalContentPage = () => {
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    fetchTechnicalFeedback();
  }, []);

  const fetchTechnicalFeedback = async () => {
    try {
      const response = await axios.get('http://192.168.211.147:8082/api/v1/feedback/technical-feedback');
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
            <Text style = {styles.txt}>{item.description}</Text>
            <Text style = {styles.txt}>By: {item.username}</Text>
            <View style = {styles.dt}>
              <View style={styles.row}>
              <Icon name="calendar-month-outline" color="#eb6434" size={15} />
              <Text>{new Date(item.createdAt).toLocaleDateString()}</Text>
              </View>
              <View style={styles.row}>
              <Icon name="clock-time-eight-outline" color="#eb6434" size={15} />
              <Text>{new Date(item.createdAt).toLocaleTimeString()}</Text>
              </View>
            </View>
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
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "serif",
  },
  feedbackItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f2e0cd',
    borderRadius: 5
  },
  dt: {
    display: 'flex',
    flexDirection: 'row',
  },
  txt : {
    fontFamily: 'serif'
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    paddingTop: 5,
    paddingEnd: 20
  },
});

export default TechnicalContentPage;
