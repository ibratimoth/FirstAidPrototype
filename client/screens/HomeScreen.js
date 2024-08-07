// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, BackHandler, Alert, TouchableOpacity, ScrollView, Linking, Image, Dimensions, Pressable} from 'react-native';
// import { useAuth } from '../context/auth';
// import { useFocusEffect, useNavigation } from '@react-navigation/native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
// import { Roboto_400Regular } from '@expo-google-fonts/roboto';
// import Carousel, { PaginationLight } from "react-native-x-carousel";
// import { PictureData } from './PictureData';

// const { width } = Dimensions.get("window");

// const HomeScreen = () => {
//   const [auth, setAuth] = useAuth();
//   const [injuries, setInjuries] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const navigation = useNavigation();

//    // Load Google Fonts
//    let [fontsLoaded] = useFonts({
//     Inter_400Regular,
//     Inter_600SemiBold,
//     Roboto_400Regular,
//   })

 
//   useEffect(() => {
//     fetchContents();
//     fetchCategories();
//   }, []);

//   const fetchContents = async () => {
//     try {
//       const response = await axios.get('http://192.168.211.231:8082/api/v1/content/get-all-content');
//       setInjuries(response.data.contents);
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch contents');
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get('http://192.168.211.231:8082/api/v1/category/get-category');
//       setCategories(response.data.categories);
//     } catch (error) {
//       Alert.alert('Error', 'Could not fetch categories');
//     }
//   };

//   const handleLogout = () => {
//     setAuth({
//       ...auth,
//       user: null,
//       token: "",
//     });
//     AsyncStorage.removeItem("auth");
//     Alert.alert("Logged out successfully");
//     navigation.navigate('LoginForm');
//   };

//   const handleBackPress = () => {
//     Alert.alert(
//       'Exit App',
//       'Are you sure you want to exit?',
//       [{
//         text: 'Cancel',
//         onPress: () => null,
//         style: 'cancel'
//       }, {
//         text: 'Exit',
//         onPress: () => BackHandler.exitApp(),
//       }]
//     );
//     return true;
//   };

//   useFocusEffect(
//     React.useCallback(() => {
//       BackHandler.addEventListener('hardwareBackPress', handleBackPress);

//       return () => {
//         BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
//       };
//     }, [])
//   );

//   const handleEmergencyCall = (number) => {
//     const url = `tel:${number}`;
//     Linking.openURL(url).catch((err) => console.error('Error opening dialer', err));
//   };

//   const renderItem = (data) => (
//     <View key={data.image} style={styles.cardContainer}>
//       <Pressable onPress={() => alert(data._id)}>
//         <View style={styles.cardWrapper}>
//           <Image style={styles.card} source={data.image} />
//         </View>
//       </Pressable>
//     </View>
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Welcome to the SLF Aid</Text>
//       <View style = {styles.slide}>
//       <Carousel
//         pagination={PaginationLight}
//         renderItem={renderItem}
//         data={PictureData}
//         loop
//         autoplay
//       />
//       </View>
//       <View style={styles.row}>
//         <Text style={styles.sectionTitle}>Injuries</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
//           {injuries.map(injury => (
//             <TouchableOpacity
//               key={injury._id}
//               style={styles.item}
//               onPress={() => navigation.navigate('ContentDetails', { contentId: injury._id })}
//             >
//               <Text style={styles.itemText}>{injury.title}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <View style={styles.row}>
//         <Text style={styles.sectionTitle}>Categories</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
//           {categories.map(category => (
//             <TouchableOpacity
//               key={category._id}
//               style={styles.categoryItem}
//               onPress={() => navigation.navigate('CategoryContents', { categoryId: category._id, categoryName: category.injuryType })}
//             >
//               <View style={styles.categoryContainer}>
//                 <MaterialCommunityIcons name="hospital-box" size={30} color="black" />
//                 <Text style={styles.categoryText}>{category.injuryType}</Text>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>

//       <View style={styles.row}>
//         <Text style={styles.sectionTitle}>Emergency Numbers</Text>
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
//           {['911', '112', '999'].map(number => (
//             <TouchableOpacity
//               key={number}
//               style={styles.item}
//               onPress={() => handleEmergencyCall(number)}
//             >
//               <Text style={styles.itemText}>{number}</Text>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//     fontFamily: 'serif',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 24,
//     textAlign: 'center',
//     fontFamily: 'serif',
//   },
//   text: {
//     fontSize: 18,
//     marginBottom: 24,
//     textAlign: 'center',
//     fontFamily: 'serif',
//   },
//   row: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     marginBottom: 10,
//     fontFamily: 'serif',
//   },
//   horizontalScroll: {
//     flexDirection: 'row',
//   },
//   item: {
//     backgroundColor: '#f2e0cd',
//     padding: 10,
//     marginRight: 10,
//     borderRadius: 5,
//   },
//   categoryItem: {
//     marginRight: 10,
//   },
//   categoryContainer: {
//     flexDirection: 'column',
//     alignItems: 'center',
//     backgroundColor: '#f2e0cd',
//     padding: 10,
//     borderRadius: 5,
//   },
//   itemText: {
//     fontSize: 16,
//     fontFamily: 'serif',
//     padding: 20,
//   },
//   categoryText: {
//     fontSize: 16,
//     marginLeft: 5,
//     fontFamily: 'serif',
//   },
//   slide: {
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: 5
//   },
//   cardContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     width,
//   },
//   cardWrapper: {
//     // borderRadius: 8,
//     overflow: "hidden",
//   },
//   card: {
//     width: width * 0.92,
//     height: width * 0.6,
//     borderTopLeftRadius: 8,
//     borderTopRightRadius: 8,
//     borderBottomLeftRadius: 8,
//     borderBottomRightRadius: 8
//   },
// });

// export default HomeScreen;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, BackHandler, Alert, TouchableOpacity, ScrollView, Linking, Image, Dimensions, Pressable, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/auth';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import Carousel, { PaginationLight } from "react-native-x-carousel";
import { PictureData } from './PictureData';

const { width } = Dimensions.get("window");

const HomeScreen = () => {
  const [auth, setAuth] = useAuth();
  const [injuries, setInjuries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [injuriesLoaded, setInjuriesLoaded] = useState(false);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const navigation = useNavigation();

  // Load Google Fonts
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Roboto_400Regular,
  });

  useEffect(() => {
    fetchContents();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (injuriesLoaded && categoriesLoaded) {
      setLoading(false);
    }
  }, [injuriesLoaded, categoriesLoaded]);

  const fetchContents = async () => {
    try {
      const response = await axios.get('http://192.168.211.185:8082/api/v1/content/get-all-content');
      setInjuries(response.data.contents);
      setInjuriesLoaded(true);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch contents');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.211.185:8082/api/v1/category/get-category');
      setCategories(response.data.categories);
      setCategoriesLoaded(true);
    } catch (error) {
      Alert.alert('Error', 'Could not fetch categories');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setAuth({
      ...auth,
      user: null,
      token: "",
    });
    AsyncStorage.removeItem("auth");
    Alert.alert("Logged out successfully");
    navigation.navigate('LoginForm');
  };

  const handleBackPress = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [{
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel'
      }, {
        text: 'Exit',
        onPress: () => BackHandler.exitApp(),
      }]
    );
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', handleBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      };
    }, [])
  );

  const handleEmergencyCall = (number) => {
    const url = `tel:${number}`;
    Linking.openURL(url).catch((err) => console.error('Error opening dialer', err));
  };

  const renderItem = (data) => (
    <View key={data.image} style={styles.cardContainer}>
      <Pressable onPress={() => alert(data._id)}>
        <View style={styles.cardWrapper}>
          <Image style={styles.card} source={data.image} />
        </View>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const emergencyNumbers = [
    { number: '112', label: 'Police' },
    { number: '114', label: 'Ambulance' }
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to the SLF Aid</Text>
      <View style={styles.slide}>
        <Carousel
          pagination={PaginationLight}
          renderItem={renderItem}
          data={PictureData}
          loop
          autoplay
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.sectionTitle}>Injuries</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {injuries.map(injury => (
            <TouchableOpacity
              key={injury._id}
              style={styles.item}
              onPress={() => navigation.navigate('ContentDetails', { contentId: injury._id })}
            >
              <Text style={styles.itemText}>{injury.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.row}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {categories.map(category => (
            <TouchableOpacity
              key={category._id}
              style={styles.categoryItem}
              onPress={() => navigation.navigate('CategoryContents', { categoryId: category._id, categoryName: category.injuryType })}
            >
              <View style={styles.categoryContainer}>
                <MaterialCommunityIcons name="hospital-box" size={30} color="black" />
                <Text style={styles.categoryText}>{category.injuryType}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.row}>
        <Text style={styles.sectionTitle}>Emergency Numbers</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {emergencyNumbers.map(emergency => (
            <TouchableOpacity
              key={emergency.number}
              style={styles.item}
              onPress={() => handleEmergencyCall(emergency.number)}
            >
              <Text style={styles.itemText}>{emergency.number} ({emergency.label})</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.row}>
        <TouchableOpacity
          style={styles.ite}
          onPress={() => navigation.navigate('HospitalMap')}>
          <Text style={styles.itemTex}>Check for nearby hospital</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    fontFamily: 'serif',
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  text: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
    fontFamily: 'serif',
  },
  row: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'serif',
  },
  horizontalScroll: {
    flexDirection: 'row',
  },
  item: {
    backgroundColor: '#f2e0cd',
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  ite: {
    backgroundColor: '#f2e0cd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  },
  categoryItem: {
    marginRight: 10,
  },
  categoryContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#f2e0cd',
    padding: 10,
    borderRadius: 5,
  },
  itemText: {
    fontSize: 16,
    fontFamily: 'serif',
    padding: 20,
  },
  itemTex: {
    fontSize: 16,
    fontFamily: 'serif',
    textAlign: 'center'
  },
  categoryText: {
    fontSize: 16,
    marginLeft: 5,
    fontFamily: 'serif',
  },
  slide: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    width,
  },
  cardWrapper: {
    overflow: "hidden",
  },
  card: {
    width: width * 0.92,
    height: width * 0.6,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default HomeScreen;
