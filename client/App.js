import "react-native-gesture-handler";
import { View, Text, StyleSheet  } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  NavigationContainer,
  useNavigation,
  DrawerActions,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useState, useEffect } from "react";
import ProfileScreen from "./screens/ProfileScreen";
import DrawerStack from "./screens/DrawerStack";
import Icon from "react-native-vector-icons/Entypo";
import DrawerContent from "./screens/DrawerContent";
import UserScreen from "./screens/UserScreen";
import SplashScreenView from "./SplashScreenView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import LoginForm from "./screens/auth/LoginForm";
import RegistrationScreen from "./screens/auth/RegistrationScreen";
import HomeScreen from "./screens/HomeScreen";
import { AuthProvider,useAuth } from "./context/auth";
import AdminPage from "./screens/Admin/AdminPage";
import NursePage from "./screens/Admin/NursePage";
import ProfilePage from "./screens/ProfilePage";
import UpdateProfilePage from "./screens/UpdateProfilePage";
import CategoryPage from "./screens/CategoryPage";
import ContentManagement from "./screens/ContentManagement";
import ContentDetails from "./screens/ContentDetails";
import CreateFeedbackPage from "./screens/createFeedbackPage";
import TechnicalContentPage from "./screens/TechnicalContentPage";
import ContentFeedbackPage from "./screens/ContentFeedbackPage";
import CategoryContentsScreen from "./screens/CategoryContentsScreen";
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Roboto_400Regular } from '@expo-google-fonts/roboto';
import PreviewScreen from "./screens/PreviewScreen";
import HospitalMap from "./screens/HospitalMap";
import ContentScreen from "./screens/ContentScreen";

const StackNav = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation()
  return (
    <Stack.Navigator
      // initialRouteName="Profile"
      screenOptions={{
        statusBarColor: "#eb6434",
        headerStyle: {
          backgroundColor: "#eb6434",
        },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: 'serif'
        }
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: () => {
            return (
              <Icon
                name="menu"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                size={30}
                color="#fff"
              />
            );
          },
        }}
      />
        <Stack.Screen
        name="LoginForm"
        component={LoginForm}
        options={{
          headerShown: false,
          statusBarColor: "#fff",
        }}
      />
      <Stack.Screen name="Splash" component={SplashScreenView} />
      <Stack.Screen name="Admin" component={AdminPage} />
      <Stack.Screen name="Nurse" component={NursePage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="Updateprofile" component={UpdateProfilePage} />
      <Stack.Screen name="Categorypage" component={CategoryPage} />
      <Stack.Screen name="contents" component={ContentManagement} />
      <Stack.Screen name="ContentDetails" component={ContentDetails} />
      <Stack.Screen name="feedback" component={CreateFeedbackPage} />
      <Stack.Screen name="technical" component={TechnicalContentPage} />
      <Stack.Screen name="contentfeed" component={ContentFeedbackPage} />
      <Stack.Screen name="CategoryContents" component={CategoryContentsScreen} />
      <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
      <Stack.Screen name="HospitalMap" component={HospitalMap} />
      <Stack.Screen name="ContentScreen" component={ContentScreen} />
    
      {/* <Stack.Screen
        name="RegisterForm"
        component={RegistrationScreen}
        options={{
          headerShown: false,
        }}
      /> */}
    </Stack.Navigator>
  );
};

const DrawerNav = () => {
  const Drawer = createDrawerNavigator()
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Homes" component={StackNav} />
    </Drawer.Navigator>
  );
};

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  const navigation = useNavigation()
  return (
    <Stack.Navigator
    screenOptions={{
      statusBarColor: "#eb6434",
      headerStyle: {
        backgroundColor: "#eb6434",
      },
      headerTintColor: "#fff",
      headerTitleAlign: "center",
    }}
    >
      <Stack.Screen name="LoginForm" component={LoginForm} options={{ headerShown: false, 
          statusBarColor: "#eb6434"}} />
      <Stack.Screen name="RegisterForm" component={RegistrationScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerLeft: () => {
            return (
              <Icon
                name="menu"
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                size={30}
                color="#fff"
              />
            );
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AppNav = () => {
  const [auth, setAuth] = useAuth();

return (
  <NavigationContainer>
    {auth.token ? <DrawerNav /> : <AuthStack />}
  </NavigationContainer>
);
}


const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <AuthProvider>
    <AppNav/>
    </AuthProvider>
  );
};

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default App;


// import "react-native-gesture-handler";
// import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
// import { StatusBar } from "expo-status-bar";
// import {
//   NavigationContainer,
//   useNavigation,
//   DrawerActions,
// } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createDrawerNavigator } from "@react-navigation/drawer";
// import React, { useState, useEffect } from "react";
// import axios from 'axios';
// import ProfileScreen from "./screens/ProfileScreen";
// import DrawerStack from "./screens/DrawerStack";
// import Icon from "react-native-vector-icons/Entypo";
// import DrawerContent from "./screens/DrawerContent";
// import UserScreen from "./screens/UserScreen";
// import SplashScreenView from "./SplashScreenView";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import LoginForm from "./screens/auth/LoginForm";
// import RegistrationScreen from "./screens/auth/RegistrationScreen";
// import HomeScreen from "./screens/HomeScreen";
// import { AuthProvider, useAuth } from "./context/auth";
// import AdminPage from "./screens/Admin/AdminPage";
// import NursePage from "./screens/Admin/NursePage";
// import ProfilePage from "./screens/ProfilePage";
// import UpdateProfilePage from "./screens/UpdateProfilePage";
// import CategoryPage from "./screens/CategoryPage";
// import ContentManagement from "./screens/ContentManagement";
// import ContentDetails from "./screens/ContentDetails";
// import CreateFeedbackPage from "./screens/createFeedbackPage";
// import TechnicalContentPage from "./screens/TechnicalContentPage";
// import ContentFeedbackPage from "./screens/ContentFeedbackPage";
// import CategoryContentsScreen from "./screens/CategoryContentsScreen";
// import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
// import { Roboto_400Regular } from '@expo-google-fonts/roboto';

// const StackNav = ({ injuries, categories }) => {
//   const Stack = createNativeStackNavigator();
//   const navigation = useNavigation();
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         statusBarColor: "#eb6434",
//         headerStyle: {
//           backgroundColor: "#eb6434",
//         },
//         headerTintColor: "#fff",
//         headerTitleAlign: "center",
//         headerTitleStyle: {
//           fontFamily: 'serif'
//         }
//       }}
//     >
//       <Stack.Screen
//         name="Home"
//         options={{
//           headerLeft: () => {
//             return (
//               <Icon
//                 name="menu"
//                 onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//                 size={30}
//                 color="#fff"
//               />
//             );
//           },
//         }}
//       >
//         {props => <HomeScreen {...props} injuries={injuries} categories={categories} />}
//       </Stack.Screen>
//       <Stack.Screen
//         name="LoginForm"
//         component={LoginForm}
//         options={{
//           headerShown: false,
//           statusBarColor: "#fff",
//         }}
//       />
//       <Stack.Screen name="Splash" component={SplashScreenView} />
//       <Stack.Screen name="Admin" component={AdminPage} />
//       <Stack.Screen name="Nurse" component={NursePage} />
//       <Stack.Screen name="Profile" component={ProfilePage} />
//       <Stack.Screen name="Updateprofile" component={UpdateProfilePage} />
//       <Stack.Screen name="Categorypage" component={CategoryPage} />
//       <Stack.Screen name="contents" component={ContentManagement} />
//       <Stack.Screen name="ContentDetails" component={ContentDetails} />
//       <Stack.Screen name="feedback" component={CreateFeedbackPage} />
//       <Stack.Screen name="technical" component={TechnicalContentPage} />
//       <Stack.Screen name="contentfeed" component={ContentFeedbackPage} />
//       <Stack.Screen name="CategoryContents" component={CategoryContentsScreen} />
//     </Stack.Navigator>
//   );
// };

// const DrawerNav = ({ injuries, categories }) => {
//   const Drawer = createDrawerNavigator();
//   return (
//     <Drawer.Navigator
//       drawerContent={(props) => <DrawerContent {...props} />}
//       screenOptions={{
//         headerShown: false,
//       }}
//     >
//       <Drawer.Screen name="Homes">
//         {props => <StackNav {...props} injuries={injuries} categories={categories} />}
//       </Drawer.Screen>
//     </Drawer.Navigator>
//   );
// };

// const AuthStack = () => {
//   const Stack = createNativeStackNavigator();
//   const navigation = useNavigation();
//   return (
//     <Stack.Navigator
//       screenOptions={{
//         statusBarColor: "#eb6434",
//         headerStyle: {
//           backgroundColor: "#eb6434",
//         },
//         headerTintColor: "#fff",
//         headerTitleAlign: "center",
//       }}
//     >
//       <Stack.Screen name="LoginForm" component={LoginForm} options={{ headerShown: false, statusBarColor: "#eb6434" }} />
//       <Stack.Screen name="RegisterForm" component={RegistrationScreen} options={{ headerShown: false }} />
//       <Stack.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           headerLeft: () => {
//             return (
//               <Icon
//                 name="menu"
//                 onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
//                 size={30}
//                 color="#fff"
//               />
//             );
//           },
//         }}
//       />
//     </Stack.Navigator>
//   );
// };

// const AppNav = ({ injuries, categories }) => {
//   const [auth] = useAuth();

//   return (
//     <NavigationContainer>
//       {auth.token ? <DrawerNav injuries={injuries} categories={categories} /> : <AuthStack />}
//     </NavigationContainer>
//   );
// };

// const App = () => {
//   const [injuries, setInjuries] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchAllData = async () => {
//       try {
//         const token = await AsyncStorage.getItem('token'); // Ensure token is retrieved
//         if (!token) {
//           throw new Error('JWT token must be provided');
//         }

//         const injuriesResponse = await axios.get('http://192.168.211.231:8082/api/v1/content/get-all-content', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const categoriesResponse = await axios.get('http://192.168.211.231:8082/api/v1/category/get-category', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setInjuries(injuriesResponse.data.contents);
//         setCategories(categoriesResponse.data.categories);
//         setLoading(false);
//       } catch (error) {
//         Alert.alert('Error', 'Could not fetch data');
//         setLoading(false);
//       }
//     };

//     fetchAllData();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#0000ff" />
//       </View>
//     );
//   }

//   return (
//     <AuthProvider>
//       <AppNav injuries={injuries} categories={categories} />
//     </AuthProvider>
//   );
// };

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default App;
