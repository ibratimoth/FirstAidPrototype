import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import axios from 'axios';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/auth';
import { WebView } from 'react-native-webview';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import RenderHtml from 'react-native-render-html';
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const transformContentToHtml = (content) => {
  // Convert URLs into image tags
  let htmlContent = content.replace(/(https?:\/\/[^\s]+)/g, (url) => {
    return `<img src="${url}" style="max-width: 100%; height: auto; display: block; margin: 10px 0;" />`;
  });

  // Format based on keywords (simple implementation)
  htmlContent = htmlContent.replace(/^Definition: /gm, '<h2>Definition</h2><p>')
                           .replace(/^Causes: /gm, '</p><h2>Causes</h2><p>')
                           .replace(/^Symptoms: /gm, '</p><h2>Symptoms</h2><p>')
                           .replace(/^First Aid /gm, '</p><h2>First Aid </h2><ul>')
                           .replace(/^When to Seek Immediate Medical Attention/gm, '</ul><h2>When to Seek Immediate Medical Attention</h2><ul>');

  // Split sentences into list items for specific sections
  htmlContent = htmlContent.replace(/(<h2>First Aid <\/h2><ul>)([^<]+)/, (match, p1, p2) => {
    const listItems = p2.split('.').filter(item => item.trim()).map(item => `<li>${item.trim()}.</li>`).join('');
    return `${p1}${listItems}`;
  });

  htmlContent = htmlContent.replace(/(<h2>When to Seek Immediate Medical Attention<\/h2><ul>)([^<]+)/, (match, p1, p2) => {
    const listItems = p2.split('.').filter(item => item.trim()).map(item => `<li>${item.trim()}.</li>`).join('');
    return `${p1}${listItems}`;
  });

  // Close open paragraphs and lists at the end of the content
  htmlContent += '</p></ul>';

  return htmlContent;
};

const ContentDetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { contentId } = route.params;
  const [content, setContent] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [auth, setAuth] = useAuth();

  // Load Google Fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    fetchContent();
    fetchCategories();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get(`http://192.168.211.147:8082/api/v1/content/get-content/${contentId}`);
      const formattedDescription = transformContentToHtml(response.data.content.description);
      setContent({ ...response.data.content, formattedDescription });
      if (response.data.content.video) {
        const videoResponse = await axios.get(`http://192.168.211.147:8082/api/v1/content/video/${response.data.content.video}`, {
          responseType: 'blob',
        });
        const videoBlob = new Blob([videoResponse.data], { type: 'video/mp4' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setVideoUri(videoUrl);
      }
    } catch (error) {
      Alert.alert('Error', 'Could not fetch content details');
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.211.147:8082/api/v1/category/get-category');
      setCategories(response.data.categories);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch categories');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://192.168.211.147:8082/api/v1/content/delete-content/${contentId}`);
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

      await axios.put(`http://192.168.211.147:8082/api/v1/content/update-content/${contentId}`, formData, {
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
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {videoUri && (
            <Video
              source={{ uri: videoUri }}
              style={styles.video}
              useNativeControls
            />
          )}
          <View style={styles.contentWrapper}>
            <RenderHtml
              contentWidth={width}
              source={{ html: content.formattedDescription }}
              tagsStyles={htmlStyles}
            />
            <Text style={styles.category}>Category: {content.injuryType}</Text>
          </View>
        </View>
        <View>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.button}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={[styles.button, styles.deleteButton]}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={styles.modalContainer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Formik
              initialValues={{
                title: content.title,
                description: content.description,
                category: content.category,
                video: null,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
                <>
                  <TextInput
                    style={styles.input}
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                    value={values.title}
                    placeholder="Title"
                  />
                  {errors.title && touched.title && <Text style={styles.errorText}>{errors.title}</Text>}

                  <TextInput
                    style={[styles.input, { height: 100 }]}
                    onChangeText={handleChange('description')}
                    onBlur={handleBlur('description')}
                    value={values.description}
                    placeholder="Description"
                    multiline
                    textAlignVertical="top"
                  />
                  {errors.description && touched.description && <Text style={styles.errorText}>{errors.description}</Text>}

                  <Picker
                    selectedValue={values.category}
                    onValueChange={handleChange('category')}
                    style={styles.picker}
                  >
                    {categories.map((category) => (
                      <Picker.Item key={category._id} label={category.name} value={category._id} />
                    ))}
                  </Picker>
                  {errors.category && touched.category && <Text style={styles.errorText}>{errors.category}</Text>}

                  <Button title="Select Video" onPress={() => selectVideo(setFieldValue)} />
                  {videoUri && (
                    <Video
                      source={{ uri: videoUri }}
                      style={styles.video}
                      useNativeControls
                    />
                  )}

                  <Button onPress={handleSubmit} title="Submit" />
                </>
              )}
            </Formik>
            <Button onPress={() => setModalVisible(false)} title="Cancel" />
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  contentWrapper: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 20,
  },
  video: {
    width: '100%',
    height: 200,
  },
  category: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'serif'
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

const htmlStyles = {
  h2: {
    fontSize: 24,
    fontFamily: "serif",
    fontWeight: 'bold',
    marginVertical: 10,
  },
  p: {
    fontSize: 16,
    fontFamily: "serif",
    marginVertical: 10,
  },
  ul: {
    marginVertical: 10,
  },
  li: {
    fontSize: 16,
    fontFamily: "serif",
    marginVertical: 5,
    textAlign: 'justify',
  },
  img: {
    maxWidth: '100%',
    height: 'auto',
    display: 'block',
    marginVertical: 10,
  },
};

export default ContentDetails;



//-----------------SECOND----------------SECOND-----------

// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView, Modal, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
// import axios from 'axios';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// import { Video } from 'expo-av';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { useAuth } from '../context/auth';
// import { WebView } from 'react-native-webview';
// import RenderHtml from 'react-native-render-html';
// import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
// import { Roboto_400Regular } from '@expo-google-fonts/roboto';

// const ContentDetails = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { contentId } = route.params;
//   const [content, setContent] = useState(null);
//   const [videoUri, setVideoUri] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [auth, setAuth] = useAuth();

//   // Load Google Fonts
//   let [fontsLoaded] = useFonts({
//     Inter_400Regular,
//     Inter_600SemiBold,
//     Roboto_400Regular,
//   });

//   useEffect(() => {
//     fetchContent();
//     fetchCategories();
//   }, []);

//   const fetchContent = async () => {
//     try {
//       const response = await axios.get(`http://192.168.211.147:8082/api/v1/content/get-content/${contentId}`);
//       setContent(response.data.content);
//       if (response.data.content.video) {
//         const videoResponse = await axios.get(`http://192.168.211.147:8082/api/v1/content/video/${response.data.content.video}`, {
//           responseType: 'blob',
//         });
//         const videoBlob = new Blob([videoResponse.data], { type: 'video/mp4' });
//         const videoUrl = URL.createObjectURL(videoBlob);
//         setVideoUri(videoUrl);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch content details');
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('http://192.168.211.147:8082/api/v1/category/get-category');
//       setCategories(response.data.categories);
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch categories');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`http://192.168.211.147:8082/api/v1/content/delete-content/${contentId}`);
//       Alert.alert('Success', 'Content deleted successfully');
//       navigation.goBack();
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

//       await axios.put(`http://192.168.211.147:8082/api/v1/content/update-content/${contentId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       Alert.alert('Success', 'Content updated successfully');
//       setModalVisible(false);
//       fetchContent();
//     } catch (error) {
//       Alert.alert('Error', 'Could not update content');
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

//   if (!content) {
//     return <Text>Loading...</Text>;
//   }

//   const { width } = Dimensions.get('window');

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View>
//           {videoUri && (
//             <Video
//               source={{ uri: videoUri }}
//               style={styles.video}
//               useNativeControls
//             />
//           )}
//           <WebView
//             source={require('./../assets/example.pdf')}
//           />
//           <View style={styles.contentWrapper}>
//             <RenderHtml
//               contentWidth={width}
//               source={{ html: content.description }}
//               tagsStyles={htmlStyles}
//             />
//             <Text style={styles.category}>Category: {content.injuryType}</Text>
//             {auth?.user?.role === 2 && (
//               <>
//                 <Button title="Update Content" onPress={() => setModalVisible(true)} />
//                 <Button title="Delete Content" onPress={handleDelete} />
//               </>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <Formik
//             initialValues={{
//               title: content.title,
//               description: content.description,
//               category: content.category._id,
//               video: null,
//             }}
//             enableReinitialize
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
//               <View>
//                 <Text>Category</Text>
//                 <Picker
//                   selectedValue={values.category}
//                   onValueChange={(itemValue) => setFieldValue('category', itemValue)}
//                   style={styles.picker}
//                 >
//                   {categories.map((category) => (
//                     <Picker.Item key={category._id} label={category.injuryType} value={category._id} />
//                   ))}
//                 </Picker>
//                 {touched.category && errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

//                 <Text>Title</Text>
//                 <TextInput
//                   onChangeText={handleChange('title')}
//                   onBlur={handleBlur('title')}
//                   value={values.title}
//                   style={styles.input}
//                 />
//                 {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

//                 <Text>Description</Text>
//                 <TextInput
//                   onChangeText={handleChange('description')}
//                   onBlur={handleBlur('description')}
//                   value={values.description}
//                   style={styles.input}
//                 />
//                 {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

//                 <Button title="Select Video" onPress={() => selectVideo(setFieldValue)} />
//                 {videoUri && (
//                   <Video
//                     source={{ uri: videoUri }}
//                     style={styles.video}
//                     useNativeControls
//                   />
//                 )}

//                 <Button title="Update Content" onPress={handleSubmit} />
//                 <Button title="Cancel" onPress={() => setModalVisible(false)} />
//               </View>
//             )}
//           </Formik>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     fontFamily: 'Inter_400Regular',
//   },
//   modalContainer: {
//     padding: 20,
//     flex: 1,
//   },
//   input: {
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 8,
//     fontFamily: 'Inter_400Regular',
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
//     fontFamily: 'Inter_400Regular',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     fontFamily: 'Inter_600SemiBold',
//   },
//   category: {
//     fontSize: 18,
//     marginBottom: 10,
//     fontFamily: 'Inter_400Regular',
//   },
//   contentWrapper: {
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'contain',
//     marginVertical: 10,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   linkText: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
// });

// const htmlStyles = {
//   p: {
//     fontSize: 16,
//     marginVertical: 5,
//     fontFamily: 'Inter_400Regular',
//   },
//   h1: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     fontFamily: 'Inter_600SemiBold',
//   },
//   h2: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     fontFamily: 'Inter_600SemiBold',
//   },
//   h3: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     fontFamily: 'Inter_600SemiBold',
//   },
//   a: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
// };

// export default ContentDetails;

//-------------------FIRST--------------------FIRST

// import React, { useEffect, useState } from 'react';
// import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
// import axios from 'axios';
// import { useRoute, useNavigation } from '@react-navigation/native';
// import { Picker } from '@react-native-picker/picker';
// import * as ImagePicker from 'expo-image-picker';
// import { Video } from 'expo-av';
// import { Formik } from 'formik';
// import * as Yup from 'yup';
// import { useAuth } from '../context/auth'
// import { WebView } from 'react-native-webview';
// import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
// import { Roboto_400Regular } from '@expo-google-fonts/roboto';

// const ContentDetails = () => {
//   const route = useRoute();
//   const navigation = useNavigation();
//   const { contentId } = route.params;
//   const [content, setContent] = useState(null);
//   const [videoUri, setVideoUri] = useState(null);
//   const [categories, setCategories] = useState([]);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [auth, setAuth] = useAuth()

//   // Load Google Fonts
//   let [fontsLoaded] = useFonts({
//     Inter_400Regular,
//     Inter_600SemiBold,
//     Roboto_400Regular,
//   })

//   useEffect(() => {
//     fetchContent();
//     fetchCategories();
//   }, []);

//   const fetchContent = async () => {
//     try {
//       const response = await axios.get(`http://192.168.211.147:8082/api/v1/content/get-content/${contentId}`);
//       setContent(response.data.content);
//       if (response.data.content.video) {
//         const videoResponse = await axios.get(`http://192.168.211.147:8082/api/v1/content/video/${response.data.content.video}`, {
//           responseType: 'blob',
//         });
//         const videoBlob = new Blob([videoResponse.data], { type: 'video/mp4' });
//         const videoUrl = URL.createObjectURL(videoBlob);
//         setVideoUri(videoUrl);
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch content details');
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('http://192.168.211.147:8082/api/v1/category/get-category');
//       setCategories(response.data.categories);
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch categories');
//     }
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(`http://192.168.211.147:8082/api/v1/content/delete-content/${contentId}`);
//       Alert.alert('Success', 'Content deleted successfully');
//       navigation.goBack();
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

//       await axios.put(`http://192.168.211.147:8082/api/v1/content/update-content/${contentId}`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       Alert.alert('Success', 'Content updated successfully');
//       setModalVisible(false);
//       fetchContent();
//     } catch (error) {
//       Alert.alert('Error', 'Could not update content');
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

//   if (!content) {
//     return <Text>Loading...</Text>;
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <View>
//           {videoUri && (
//             <Video
//               source={{ uri: videoUri }}
//               style={styles.video}
//               useNativeControls
//             />
//           )}
//           <WebView
//             source={require('./../assets/example.pdf')}
//           />
//           <View style={styles.contentWrapper}>
//             <Text style={styles.description}>
//               A "contusion" refers to a bruise or injury to tissue, typically caused by blunt force trauma that damages blood vessels underneath the skin without breaking the skin itself. It is a common type of injury that can occur from accidents, falls, or physical impacts.
//             </Text>
//             <Image
//               source={{
//                 uri: "https://www.health.com/thmb/id_75qw991HIBqal3QftEyrdFcg=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/contusion-GettyImages-1495526764-33e660d9fe8d46ef940e0ba14fd830ac.jpg"
//               }}
//               style={styles.image}
//             />
//             <Text style={styles.description}>
//               {'\n'}
//               First Aid Steps for Contusions:
//               {'\n\n'}
//               <Text style={styles.boldText}>Assess the Injury:</Text>
//               {'\n'}
//               Determine the extent of the contusion by observing the affected area for swelling, discoloration (bruising), and tenderness.
//               {'\n\n'}
//               <Text style={styles.boldText}>Rest and Comfort:</Text>
//               {'\n'}
//               Encourage the injured person to rest and avoid putting weight or pressure on the affected area.
//               {'\n\n'}
//               <Text style={styles.boldText}>Cold Compression:</Text>
//               {'\n'}
//               Apply a cold compress (ice pack wrapped in a cloth or a bag of frozen peas) to the contusion for 15-20 minutes at a time, every 1-2 hours during the first 24-48 hours. This helps reduce swelling and pain.
//               {'\n\n'}
//               <Text style={styles.boldText}>Elevation:</Text>
//               {'\n'}
//               If possible, elevate the injured area above the level of the heart to help reduce swelling. For example, if the contusion is on the leg, have the person lie down with pillows under the leg.
//               {'\n\n'}
//               <Text style={styles.boldText}>Pain Relief:</Text>
//               {'\n'}
//               Over-the-counter pain relievers like ibuprofen or acetaminophen can help alleviate pain and discomfort. Follow dosage instructions carefully.
//               {'\n\n'}
//               <Text style={styles.boldText}>Monitor for Complications:</Text>
//               {'\n'}
//               Watch for signs of complications such as increasing pain, numbness, or inability to move the affected area. Seek medical attention if these symptoms occur.
//               {'\n\n'}
//               <Text style={styles.boldText}>Seek Medical Advice:</Text>
//               {'\n'}
//               If the contusion is severe, large, or accompanied by other injuries (such as fractures), or if there are concerns about internal bleeding, it's important to seek medical evaluation promptly.
//               {'\n\n'}
//               Images and Links for Reference:
//               {'\n'}
//               Here are some resources where you can find images and step-by-step guides for treating contusions:
//               {'\n\n'}
//               <Text style={styles.linkText}>American Academy of Orthopaedic Surgeons (AAOS):</Text>
//               AAOS provides detailed information on contusions, including first aid and management: AAOS Contusion Information
//               {'\n\n'}
//               <Text style={styles.linkText}>Mayo Clinic:</Text>
//               Mayo Clinic offers insights into contusions, symptoms, and initial treatment: Mayo Clinic Contusion Overview
//               {'\n\n'}
//               <Text style={styles.linkText}>Healthline:</Text>
//               Healthline provides a guide on how to recognize and treat bruises: Healthline Bruise Treatment Guide
//               {'\n\n'}
//               <Text style={styles.linkText}>Google Images:</Text>
//               You can search for "contusion first aid step by step images" on Google Images to find visual aids and diagrams that demonstrate the treatment process.
//             </Text>
//             <Text style={styles.category}>Category: {content.injuryType}</Text>
//             {auth?.user?.role === 2 && (
//               <>
//                 <Button title="Update Content" onPress={() => setModalVisible(true)} />
//                 <Button title="Delete Content" onPress={handleDelete} />
//               </>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <SafeAreaView style={styles.modalContainer}>
//           <Formik
//             initialValues={{
//               title: content.title,
//               description: content.description,
//               category: content.category._id,
//               video: null,
//             }}
//             enableReinitialize
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ handleChange, handleBlur, handleSubmit, setFieldValue, values, errors, touched }) => (
//               <View>
//                 <Text>Category</Text>
//                 <Picker
//                   selectedValue={values.category}
//                   onValueChange={(itemValue) => setFieldValue('category', itemValue)}
//                   style={styles.picker}
//                 >
//                   {categories.map((category) => (
//                     <Picker.Item key={category._id} label={category.injuryType} value={category._id} />
//                   ))}
//                 </Picker>
//                 {touched.category && errors.category && <Text style={styles.errorText}>{errors.category}</Text>}

//                 <Text>Title</Text>
//                 <TextInput
//                   onChangeText={handleChange('title')}
//                   onBlur={handleBlur('title')}
//                   value={values.title}
//                   style={styles.input}
//                 />
//                 {touched.title && errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

//                 <Text>Description</Text>
//                 <TextInput
//                   onChangeText={handleChange('description')}
//                   onBlur={handleBlur('description')}
//                   value={values.description}
//                   style={styles.input}
//                 />
//                 {touched.description && errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

//                 <Button title="Select Video" onPress={() => selectVideo(setFieldValue)} />
//                 {videoUri && (
//                   <Video
//                     source={{ uri: videoUri }}
//                     style={styles.video}
//                     useNativeControls
//                   />
//                 )}

//                 <Button title="Update Content" onPress={handleSubmit} />
//                 <Button title="Cancel" onPress={() => setModalVisible(false)} />
//               </View>
//             )}
//           </Formik>
//         </SafeAreaView>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     fontFamily: 'Inter_400Regular',
//   },
//   modalContainer: {
//     padding: 20,
//     flex: 1,
//   },
//   input: {
//     borderWidth: 1,
//     marginBottom: 10,
//     padding: 8,
//     fontFamily: 'Inter_400Regular',
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
//     fontFamily: 'Inter_400Regular',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     fontFamily: 'Inter_600SemiBold',
//   },
//   description: {
//     fontSize: 18,
//     marginVertical: 10,
//     textAlign: 'justify',
//     fontFamily: 'Inter_400Regular',
//   },
//   category: {
//     fontSize: 18,
//     marginBottom: 10,
//     fontFamily: 'Inter_400Regular',
//   },
//   contentWrapper: {
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   image: {
//     width: '100%',
//     height: 200,
//     resizeMode: 'contain',
//     marginVertical: 10,
//   },
//   boldText: {
//     fontWeight: 'bold',
//   },
//   linkText: {
//     color: 'blue',
//     textDecorationLine: 'underline',
//   },
// });

// export default ContentDetails;

