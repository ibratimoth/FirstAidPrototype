// CategoryContentsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const CategoryContentsScreen = () => {
  const [contents, setContents] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { categoryId, categoryName: initialCategoryName } = route.params;

  useEffect(() => {
    setCategoryName(initialCategoryName);
    fetchContentsByCategory();
  }, []);

  const fetchContentsByCategory = async () => {
    try {
      const response = await axios.get(`http://192.168.211.185:8082/api/v1/content/category/${categoryId}`);
      if (response.data.contents.length === 0) {
        setErrorMessage('This category is empty.');
      } else {
        setContents(response.data.contents);
      }
    } catch (error) {
      setErrorMessage('Could not fetch contents for the category.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{categoryName}</Text>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : (
        contents.map(content => (
          <TouchableOpacity
            key={content._id}
            style={styles.item}
            onPress={() => navigation.navigate('ContentDetails', { contentId: content._id })}
          >
            <Text style={styles.itemText}>{content.title}</Text>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'serif'
  },
  item: {
    backgroundColor: '#f2e0cd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'serif'
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default CategoryContentsScreen;
