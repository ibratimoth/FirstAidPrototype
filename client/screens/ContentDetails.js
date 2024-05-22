import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ContentDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { contentId } = route.params;
  const [content, setContent] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`http://192.168.211.231:8082/api/v1/content/get-content/${contentId}`);
      setContent(response.data.content);
      setVideoUri(response.data.content.video ? `http://192.168.211.231:8082/uploads/${response.data.content.video}` : null);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch content details');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.211.231:8082/api/v1/category/get-category');
      setCategories(response.data.categories);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch categories');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://192.168.211.231:8082/api/v1/content/delete-content/${contentId}`);
      Alert.alert('Success', 'Content deleted successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not delete content');
    }
  };

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('category', values.category);
      if (values.video) {
        formData.append('video', {
          uri: values.video.uri,
          type: 'video/mp4',
          name: values.video.uri.split('/').pop(),
        });
      }

      await axios.put(`http://192.168.211.231:8082/api/v1/content/update-content/${contentId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Success', 'Content updated successfully');
      setModalVisible(false);
      fetchContent();
    } catch (error) {
      Alert.alert('Error', 'Could not update content');
    }
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
  });

  const selectVideo = async (setFieldValue) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission denied', 'You need to allow access to your media library');
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });

    if (!pickerResult.canceled) {
      setVideoUri(pickerResult.uri);
      setFieldValue('video', pickerResult);
    }
  };

  if (!content) {
    return <Text>Loading...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>{content.title}</Text>
        {videoUri && (
          <Video
            source={{ uri: videoUri }}
            style={styles.video}
            useNativeControls
          />
        )}
        <Text style={styles.description}>{content.description}</Text>
        <Text style={styles.category}>Category: {content.category.injuryType}</Text>
        
        <Button title="Update Content" onPress={() => setModalVisible(true)} />
        <Button title="Delete Content" onPress={handleDelete} />
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Formik
            initialValues={{
              title: content.title,
              description: content.description,
              category: content.category._id,
              video: null,
            }}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
              <View>
                <Text>Category</Text>
                <Picker
                  selectedValue={values.category}
                  onValueChange={(itemValue) => setFieldValue('category', itemValue)}
                  style={styles.picker}
                >
                  {categories.map((category) => (
                    <Picker.Item key={category._id} label={category.injuryType} value={category._id} />
                  ))}
                </Picker>
                {touched.category && errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

                <Text>Title</Text>
                <TextInput
                  onChangeText={handleChange('title')}
                  onBlur={handleBlur('title')}
                  value={values.title}
                  style={styles.input}
                />
                {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

                <Text>Description</Text>
                <TextInput
                  onChangeText={handleChange('description')}
                  onBlur={handleBlur('description')}
                  value={values.description}
                  style={styles.input}
                />
                {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

                <Button title="Select Video" onPress={() => selectVideo(setFieldValue)} />
                {videoUri && (
                  <Video
                    source={{ uri: videoUri }}
                    style={styles.video}
                    useNativeControls
                  />
                )}

                <Button title="Update Content" onPress={handleSubmit} />
                <Button title="Cancel" onPress={() => setModalVisible(false)} />
              </View>
            )}
          </Formik>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  modalContainer: {
    padding: 20,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  picker: {
    borderWidth: 1,
    marginBottom: 10,
  },
  video: {
    width: '100%',
    height: 200,
    marginVertical: 10,
  },
  errorText: {
    color: 'red',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 18,
    marginVertical: 10,
  },
  category: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ContentDetails;
