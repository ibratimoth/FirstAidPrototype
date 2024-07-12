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


