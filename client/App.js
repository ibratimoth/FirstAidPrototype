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


// const toastConfig = {
//   /*
//     Overwrite 'success' type,
//     by modifying the existing `BaseToast` component
//   */
//   success: (props) => (
//     <BaseToast
//       {...props}
//       style={{
//         borderLeftColor: "#eb6434",
//         borderLeftWidth: 7,
//         width: "70%",
//         height: 50,
//         borderRightColor: "#eb6434",
//         borderRightWidth: 7,
//       }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{
//         fontSize: 17,
//         fontWeight: "700",
//         color: "#345ea3",
//       }}
//       text2Style={{
//         fontSize: 14,
//         color: "#345ea3",
//       }}
//     />
//   ),
//   /*
//     Overwrite 'error' type,
//     by modifying the existing `ErrorToast` component
//   */
//   error: (props) => (
//     <ErrorToast
//       {...props}
//       text1NumberOfLines={3}
//       style={{
//         borderLeftColor: "red",
//         borderLeftWidth: 7,
//         width: "70%",
//         height: 70,
//         borderRightColor: "red",
//         borderRightWidth: 7,
//       }}
//       contentContainerStyle={{ paddingHorizontal: 15 }}
//       text1Style={{
//         fontSize: 17,
//         fontWeight: "700",
//       }}
//       text2Style={{
//         fontSize: 14,
//       }}
//     />
//   ),
// };
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
        }}
      />
      <Stack.Screen name="Splash" component={SplashScreenView} />
      <Stack.Screen name="Admin" component={AdminPage} />
      <Stack.Screen name="Nurse" component={NursePage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="Updateprofile" component={UpdateProfilePage} />
    
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
      <Stack.Screen name="LoginForm" component={LoginForm} options={{ headerShown: false}} />
      <Stack.Screen name="RegisterForm" component={RegistrationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const AppNav = () => {
  const [auth, setAuth] = useAuth();

  // if (auth.user === null && auth.token === "") {
  //   // Optional: Show a loading indicator while checking authentication status
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="large" color="#0000ff" />
  //     </View>
  //   );
  // }

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
    {/* <NavigationContainer>
    <DrawerNav />
    </NavigationContainer> */}
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

// "splash": {
//   "image": "./assets/mysplash.png",
//   "resizeMode": "contain",
//   "backgroundColor": "#eb6434"
// },
