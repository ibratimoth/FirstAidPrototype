import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const ContentManagement = () => {
  const [categories, setCategories] = useState([]);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCategories();
    fetchContents();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.211.185:8082/api/v1/category/get-category');
      setCategories(response.data.categories);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch categories');
    }
  };

  const fetchContents = async () => {
    try {
      const response = await axios.get('http://192.168.211.185:8082/api/v1/content/get-all-content');
      setContents(response.data.contents);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch contents');
    }
  };

  const handleSelectContent = (content) => {
    navigation.navigate('ContentDetails', { contentId: content._id });
  };

  const handleSubmit = async (values) => {
    try {
      const formData = {
        title: values.title,
        description: values.description,
        category: values.category,
      };

      if (selectedContent) {
        await axios.put(`http://192.168.211.185:8082/api/v1/content/update-content/${selectedContent._id}`, formData);
        Alert.alert('Success', 'Content updated successfully');
      } else {
        await axios.post('http://192.168.211.185:8082/api/v1/content/create-content', formData);
        Alert.alert('Success', 'Content created successfully');
      }

      fetchContents();
      setSelectedContent(null);
    } catch (error) {
      Alert.alert('Error', `Could not ${selectedContent ? 'update' : 'create'} content`);
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
  });

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          title: selectedContent ? selectedContent.title : '',
          description: selectedContent ? selectedContent.description : '',
          category: selectedContent ? selectedContent.category._id : '',
        }}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
          <View>
            <Text style={styles.label}>Category</Text>
            <RNPickerSelect
              onValueChange={(itemValue) => setFieldValue('category', itemValue)}
              items={categories.map((category) => ({
                label: category.injuryType, // Assuming category has a 'name' field
                value: category._id,
                key: category._id,
              }))}
              style={{
                inputIOS: styles.picker,
                inputAndroid: styles.picker,
                placeholder: {
                  color: 'black',
                  fontSize: 16,
                  fontFamily: 'serif',
                },
                inputIOSContainer: {
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 5,
                  marginBottom: 10,
                },
                inputAndroidContainer: {
                  borderWidth: 1,
                  borderColor: 'gray',
                  borderRadius: 5,
                  marginBottom: 10,
                },
              }}
              value={values.category}
            />
            {touched.category && errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

            <Text style={styles.label}>Title</Text>
            <TextInput
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              value={values.title}
              style={styles.input}
            />
            {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

            <Text style={styles.label}>Description</Text>
            <TextInput
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              style={styles.input}
            />
            {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

            <TouchableOpacity onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>{selectedContent ? 'UPDATE CONTENT' : 'CREATE CONTENT'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </Formik>

      <Text style={styles.acontent}>Available contents</Text>
      <FlatList
        data={contents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.content} onPress={() => handleSelectContent(item)}>
            <Text style={styles.title}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    marginBottom: 15,
    padding: 8,
    borderRadius: 5,
    fontFamily: 'serif',
    fontSize: 15,
  },
  picker: {
    fontFamily: 'serif',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  errorText: {
    color: 'red',
    fontFamily: 'serif',
  },
  title: {
    fontSize: 18,
    marginVertical: 5,
    backgroundColor: '#f2e0cd',
    paddingVertical: 10,
    fontFamily: 'serif',
    textAlign: 'center',
    borderRadius: 5
  },
  label: {
    fontFamily: 'serif',
    fontSize: 16,
    marginBottom: 10
  },
  button: {
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
  acontent: {
    textAlign: 'center',
    fontFamily: 'serif',
    fontSize: 19,
    marginTop: 12,
    marginBottom: 12,
    fontWeight: 'bold'
  }
});

export default ContentManagement;
