// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, ScrollView, Button, Text } from 'react-native';
// import { TextInput, Card, FAB } from 'react-native-paper';
// import * as DocumentPicker from 'expo-document-picker';
// import axios from 'axios';

// const ContentScreen = () => {
//   const [title, setTitle] = useState('');
//   const [category, setCategory] = useState('');
//   const [pdf, setPdf] = useState(null);
//   const [contents, setContents] = useState([]);
//   const [editingContentId, setEditingContentId] = useState(null);

//   useEffect(() => {
//     fetchContents();
//   }, []);

//   const fetchContents = async () => {
//     try {
//       const response = await axios.get('http://192.168.211.231:8082/api/v1/content/get-all-content');
//       setContents(response.data.contents);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDocumentPicker = async () => {
//     const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
//     if (result.type === 'success') {
//       setPdf(result);
//     }
//   };

//   const handleSubmit = async () => {
//     if (!title || !category || !pdf) {
//       alert('All fields are required');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('title', title);
//     formData.append('category', category);
//     formData.append('pdf', {
//       uri: pdf.uri,
//       type: 'application/pdf',
//       name: pdf.name,
//     });

//     try {
//       if (editingContentId) {
//         await axios.put(`http://192.168.211.231:8082/api/v1/content/update-content/${editingContentId}`, formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       } else {
//         await axios.post('http://192.168.211.231:8082/api/v1/content/create-content', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         });
//       }
//       fetchContents();
//       setTitle('');
//       setCategory('');
//       setPdf(null);
//       setEditingContentId(null);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleEdit = (content) => {
//     setTitle(content.title);
//     setCategory(content.category);
//     setEditingContentId(content._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`http://192.168.211.231:8082/api/v1/content/delete-content/${id}`);
//       fetchContents();
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <TextInput
//         label="Title"
//         value={title}
//         onChangeText={setTitle}
//         style={styles.input}
//       />
//       <TextInput
//         label="Category"
//         value={category}
//         onChangeText={setCategory}
//         style={styles.input}
//       />
//       <Button title="Pick PDF" onPress={handleDocumentPicker} />
//       {pdf && <Text>{pdf.name}</Text>}
//       <Button title={editingContentId ? 'Update Content' : 'Create Content'} onPress={handleSubmit} />

//       {contents.map((content) => (
//         <Card key={content._id} style={styles.card}>
//           <Card.Title title={content.title} />
//           <Card.Content>
//             <Text>Category: {content.category.injuryType}</Text>
//           </Card.Content>
//           <Card.Actions>
//             <Button title="Edit" onPress={() => handleEdit(content)} />
//             <Button title="Delete" onPress={() => handleDelete(content._id)} />
//           </Card.Actions>
//         </Card>
//       ))}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   input: {
//     marginBottom: 20,
//   },
//   card: {
//     marginVertical: 10,
//   },
// });

// export default ContentScreen;
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Button, Text } from 'react-native';
import { TextInput, Card } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';

const ContentScreen = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [pdf, setPdf] = useState(null);
  const [contents, setContents] = useState([]);
  const [editingContentId, setEditingContentId] = useState(null);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await axios.get('http://192.168.211.147:8082/api/v1/content/get-all-content');
      setContents(response.data.contents);
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const handleDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.type === 'success' && result.assets && result.assets.length > 0) {
      console.log('PDF picked:', result.assets[0]);
      setPdf(result.assets[0].uri);
    } else {
      console.log('Document picking cancelled or failed:', result);
    }
  };

  const handleSubmit = async () => {
    if (!title || !category || !pdf) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('pdf', {
      uri: pdf,
      type: pdf.mimeType,
      name: pdf.name,
    });

    try {
      if (editingContentId) {
        await axios.put(`http://192.168.211.147:8082/api/v1/content/update-content/${editingContentId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://192.168.211.147:8082/api/v1/content/create-content', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      fetchContents();
      setTitle('');
      setCategory('');
      setPdf(null);
      setEditingContentId(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleEdit = (content) => {
    setTitle(content.title);
    setCategory(content.category);
    setEditingContentId(content._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.211.147:8082/api/v1/content/delete-content/${id}`);
      fetchContents();
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        label="Title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TextInput
        label="Category"
        value={category}
        onChangeText={setCategory}
        style={styles.input}
      />
      <Button title="Pick PDF" onPress={handleDocumentPicker} />
      {pdf && <Text>{uri}</Text>}
      <Button title={editingContentId ? 'Update Content' : 'Create Content'} onPress={handleSubmit} />

      {contents.map((content) => (
        <Card key={content._id} style={styles.card}>
          <Card.Title title={content.title} />
          <Card.Content>
            <Text>Category: {content.category.injuryType}</Text>
          </Card.Content>
          <Card.Actions>
            <Button title="Edit" onPress={() => handleEdit(content)} />
            <Button title="Delete" onPress={() => handleDelete(content._id)} />
          </Card.Actions>
        </Card>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    marginBottom: 20,
  },
  card: {
    marginVertical: 10,
  },
});

export default ContentScreen;
