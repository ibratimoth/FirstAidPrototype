// import React, { useState, useEffect } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList, SafeAreaView } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import axios from 'axios';
// import * as ImagePicker from 'expo-image-picker';
// import { Video } from 'expo-av';

// const ContentManagement = () => {
//   const [categories, setCategories] = useState([]);
//   const [contents, setContents] = useState([]);
//   const [selectedContent, setSelectedContent] = useState(null);
//   const [videoUri, setVideoUri] = useState(null);

//   useEffect(() => {
//     fetchCategories();
//     fetchContents();
//   }, []);

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('http://192.168.211.231:8082/api/v1/category/get-category');
//       setCategories(response.data.categories);
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch categories');
//     }
//   };

//   const fetchContents = async () => {
//     try {
//       const response = await axios.get('http://192.168.211.231:8082/api/v1/content/get-all-content');
//       setContents(response.data.contents);
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch contents');
//     }
//   };

//   const handleSelectContent = (content) => {
//     setSelectedContent(content);
//     setVideoUri(content.video ? `http://192.168.211.231:8082/uploads/${content.video}` : null);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://192.168.211.231:8082/api/v1/content/delete-content/${id}`);
//       Alert.alert('Success', 'Content deleted successfully');
//       fetchContents();
//     } catch (error) {
//       Alert.alert('Error', 'Could not delete content');
//     }
//   };

//   const handleSubmit = async (values) => {
//     try {
//       const formData = new FormData();
//       formData.append('title', values.title);
//       formData.append('description', values.description);
//       formData.append('category', values.category);
//       if (values.video) {
//         formData.append('video', {
//           uri: values.video.uri,
//           type: 'video/mp4',
//           name: values.video.uri.split('/').pop(),
//         });
//       }

//       if (selectedContent) {
//         await axios.put(`http://192.168.211.231:8082/api/v1/content/update-content/${selectedContent._id}`, formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         Alert.alert('Success', 'Content updated successfully');
//       } else {
//         await axios.post('http://192.168.211.231:8082/api/v1/content/create-content', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         Alert.alert('Success', 'Content created successfully');
//       }

//       fetchContents();
//       setSelectedContent(null);
//       setVideoUri(null);
//     } catch (error) {
//       Alert.alert('Error', `Could not ${selectedContent ? 'update' : 'create'} content`);
//     }
//   };

//   const validationSchema = Yup.object().shape({
//     title: Yup.string().required('Title is required'),
//     description: Yup.string().required('Description is required'),
//     category: Yup.string().required('Category is required'),
//   });

//   const selectVideo = async (setFieldValue) => {
//     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
//     if (permissionResult.granted === false) {
//       Alert.alert('Permission denied', 'You need to allow access to your media library');
//       return;
//     }

//     let pickerResult = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Videos,
//     });

//     if (!pickerResult.canceled) {
//       setVideoUri(pickerResult.uri);
//       setFieldValue('video', pickerResult);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <Formik
//         initialValues={{
//           title: selectedContent ? selectedContent.title : '',
//           description: selectedContent ? selectedContent.description : '',
//           category: selectedContent ? selectedContent.category._id : '',
//           video: null,
//         }}
//         enableReinitialize
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
//           <View>
//             <Text>Category</Text>
//             <Picker
//               selectedValue={values.category}
//               onValueChange={(itemValue) => setFieldValue('category', itemValue)}
//               style={styles.picker}
//             >
//               {categories.map((category) => (
//                 <Picker.Item key={category._id} label={category.injuryType} value={category._id} />
//               ))}
//             </Picker>
//             {touched.category && errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

//             <Text>Title</Text>
//             <TextInput
//               onChangeText={handleChange('title')}
//               onBlur={handleBlur('title')}
//               value={values.title}
//               style={styles.input}
//             />
//             {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

//             <Text>Description</Text>
//             <TextInput
//               onChangeText={handleChange('description')}
//               onBlur={handleBlur('description')}
//               value={values.description}
//               style={styles.input}
//             />
//             {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

//             <Button title="Select Video" onPress={() => selectVideo(setFieldValue)} />
//             {videoUri && (
//               <Video
//                 source={{ uri: videoUri }}
//                 style={styles.video}
//                 useNativeControls
//               />
//             )}

//             <Button title={selectedContent ? "Update Content" : "Create Content"} onPress={handleSubmit} />
//           </View>
//         )}
//       </Formik>

//       <FlatList
//         data={contents}
//         keyExtractor={(item) => item._id}
//         renderItem={({ item }) => (
//           <View style={styles.contentItem}>
//             <Text style={styles.title}>{item.title}</Text>
//             <Text>{item.description}</Text>
//             <Text>Category: {item.category.injuryType}</Text>
//             <Button
//               title="Edit"
//               onPress={() => handleSelectContent(item)}
//             />
//             <Button
//               title="Delete"
//               onPress={() => handleDelete(item._id)}
//             />
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   input: {
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 8,
//   },
//   picker: {
//     borderWidth: 1,
//     marginBottom: 10,
//   },
//   video: {
//     width: '100%',
//     height: 200,
//     marginVertical: 10,
//   },
//   errorText: {
//     color: 'red',
//   },
//   contentItem: {
//     marginVertical: 10,
//     padding: 10,
//     borderWidth: 1,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

// export default ContentManagement;
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const ContentManagement = () => {
  const [categories, setCategories] = useState([]);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchCategories();
    fetchContents();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.211.231:8082/api/v1/category/get-category');
      setCategories(response.data.categories);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch categories');
    }
  };

  const fetchContents = async () => {
    try {
      const response = await axios.get('http://192.168.211.231:8082/api/v1/content/get-all-content');
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

      if (selectedContent) {
        await axios.put(`http://192.168.211.231:8082/api/v1/content/update-content/${selectedContent._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('Success', 'Content updated successfully');
      } else {
        await axios.post('http://192.168.211.231:8082/api/v1/content/create-content', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        Alert.alert('Success', 'Content created successfully');
      }

      fetchContents();
      setSelectedContent(null);
      setVideoUri(null);
    } catch (error) {
      Alert.alert('Error', `Could not ${selectedContent ? 'update' : 'create'} content`);
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

  return (
    <SafeAreaView style={styles.container}>
      <Formik
        initialValues={{
          title: selectedContent ? selectedContent.title : '',
          description: selectedContent ? selectedContent.description : '',
          category: selectedContent ? selectedContent.category._id : '',
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

            <Button title={selectedContent ? "Update Content" : "Create Content"} onPress={handleSubmit} />
          </View>
        )}
      </Formik>

      <FlatList
        data={contents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleSelectContent(item)}>
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
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});

export default ContentManagement;
