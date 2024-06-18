// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Button,
//   Alert,
// } from "react-native";
// import { useNavigation } from "@react-navigation/native";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
// import { Avatar } from "react-native-paper";
// import { useAuth } from "../context/auth";
// import * as ImagePicker from "expo-image-picker";

// const ProfilePage = () => {
//   const [auth, setAuth] = useAuth();
//   const navigation = useNavigation();
//   const [photo, setPhoto] = useState(auth?.user?.profilePic?.url);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const navigateToUpdateProfile = () => {
//     navigation.navigate("Updateprofile");
//   };

//   const handleChoosePhoto = async () => {
//     const permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (permissionResult.granted === false) {
//       alert("Permission to access camera roll is required!");
//       return;
//     }

//     const pickerResult = await ImagePicker.launchImageLibraryAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//       allowsMultipleSelection: false, // Add this option to prevent default preview screen
//     });

//     if (!pickerResult.canceled) {
//       setModalVisible(false);
//       navigation.navigate("PreviewScreen", { imageUri: pickerResult.uri });
//       console.log(pickerResult.uri);
//     }
//   };

//   const handleTakePhoto = async () => {
//     const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//     if (permissionResult.granted === false) {
//       alert("Permission to access camera is required!");
//       return;
//     }

//     const pickerResult = await ImagePicker.launchCameraAsync({
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!pickerResult.canceled) {
//       setModalVisible(false);
//       navigation.navigate("PreviewScreen", { imageUri: pickerResult.uri });
//       console.log(pickerResult.uri);
//     } else {
//       alert("You did not select any image.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.userInfoSection}>
//         <View
//           style={{
//             marginTop: 5,
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: 20,
//           }}
//         >
//           <TouchableOpacity onPress={() => setModalVisible(true)}>
//             <Avatar.Image
//               source={{
//                 uri:
//                   photo ||
//                   "https://cdn-icons-png.freepik.com/256/847/847969.png?ga=GA1.1.1665601381.1712936655&semt=ais_hybrid",
//               }}
//               size={150}
//               style={{ marginTop: 5 }}
//             />
//             <Icon
//               name="camera"
//               size={30}
//               color="#eb6434"
//               style={styles.cameraIcon}
//             />
//           </TouchableOpacity>
//         </View>
//         <View style={styles.row}>
//           <Icon name="lead-pencil" color="#eb6434" size={20} />
//           <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
//             {auth?.user?.username}
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Icon name="map-marker-radius" color="#eb6434" size={20} />
//           <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
//             {auth?.user?.city}
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Icon name="phone" color="#eb6434" size={20} />
//           <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
//             {auth?.user?.contact}
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Icon name="email" color="#eb6434" size={20} />
//           <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
//             {auth?.user?.email}
//           </Text>
//         </View>
//         <View style={styles.row}>
//           <Icon name="basketball" color="#eb6434" size={20} />
//           <Text style={{ fontFamily: "serif", marginLeft: 20, fontSize: 18 }}>
//             {auth?.user?.sport}
//           </Text>
//         </View>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={navigateToUpdateProfile}
//         >
//           <Text style={styles.buttonText}>UPDATE PROFILE</Text>
//         </TouchableOpacity>
//       </View>

//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={modalVisible}
//         onRequestClose={() => {
//           setModalVisible(!modalVisible);
//         }}
//       >
//         <View style={styles.modalView}>
//           <View style={styles.modalContent}>
//             <TouchableOpacity style={styles.button} onPress={handleChoosePhoto}>
//               <Text style={styles.buttonText}>Choose from Library</Text>
//             </TouchableOpacity>
//             <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
//               <Text style={styles.buttonText}>Take a Photo</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={styles.button}
//               onPress={() => setModalVisible(false)}
//             >
//               <Text style={styles.buttonText}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//   },
//   profileInfo: {
//     marginBottom: 20,
//   },
//   userInfoSection: {
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//     marginBottom: 25,
//   },
//   row: {
//     flexDirection: "row",
//     marginBottom: 10,
//     backgroundColor: "#f2e0cd",
//     padding: 10,
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: "#eb6434",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//     marginBottom: 10,
//     marginTop: 20,
//   },
//   buttonText: {
//     fontSize: 17,
//     color: "#fff",
//     paddingVertical: 1, // Padding inside the button text
//     paddingHorizontal: 10, // Padding inside the button text
//     textAlign: "center",
//     fontFamily: "serif",
//   },
//   cameraIcon: {
//     position: "absolute",
//     right: 0,
//     bottom: 0,
//     backgroundColor: "#fff",
//     borderRadius: 15,
//     padding: 5,
//   },
//   modalView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//   },
//   modalContent: {
//     backgroundColor: "white",
//     padding: 20,
//     borderRadius: 10,
//     width: "80%",
//     alignItems: "center",
//   },
// });

// export default ProfilePage;
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/auth";
import * as ImagePicker from "expo-image-picker";

const PlaceholderImage = require("./../assets/images/background.jpg");

const ProfilePage = () => {
  const [auth, setAuth] = useAuth();
  const navigation = useNavigation();
  const [photo, setPhoto] = useState(auth?.user?.profilePic?.url || null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigateToUpdateProfile = () => {
    navigation.navigate("Updateprofile");
  };

  const handleChoosePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setModalVisible(false);
      setPhoto(pickerResult.assets[0].uri); // Update the photo state with the selected image URI
    }
  };

  const handleTakePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setModalVisible(false);
      setPhoto(pickerResult.assets[0].uri); // Update the photo state with the captured image URI
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.userInfoSection}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Image
              source={photo ? { uri: photo } : PlaceholderImage}
              style={styles.image}
            />
            <Icon name="camera" size={30} color="#eb6434" style={styles.cameraIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.row}>
          <Icon name="lead-pencil" color="#eb6434" size={20} />
          <Text style={styles.text}>{auth?.user?.username}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="map-marker-radius" color="#eb6434" size={20} />
          <Text style={styles.text}>{auth?.user?.city}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#eb6434" size={20} />
          <Text style={styles.text}>{auth?.user?.contact}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#eb6434" size={20} />
          <Text style={styles.text}>{auth?.user?.email}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="basketball" color="#eb6434" size={20} />
          <Text style={styles.text}>{auth?.user?.sport}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={navigateToUpdateProfile}>
          <Text style={styles.buttonText}>UPDATE PROFILE</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={handleChoosePhoto}>
              <Text style={styles.modalButtonText}>Choose from Library</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleTakePhoto}>
              <Text style={styles.modalButtonText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  userInfoSection: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 25,
  },
  imageContainer: {
    marginTop: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75, // To make the image circular
  },
  cameraIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
    backgroundColor: "#f2e0cd",
    padding: 10,
    borderRadius: 5,
  },
  text: {
    fontFamily: "serif",
    marginLeft: 20,
    fontSize: 18,
  },
  button: {
    backgroundColor: "#eb6434",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
    fontFamily: "serif",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalButton: {
    backgroundColor: "#eb6434",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 17,
    color: "#fff",
    textAlign: "center",
    fontFamily: "serif",
  },
});

export default ProfilePage;
