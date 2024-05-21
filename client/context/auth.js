import {useState,useEffect, useContext, createContext, Children} from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'
import {ActivityIndicator, View} from 'react-native'
const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [auth, setAuth] = useState({
        user: null,
        token: ""
    })
    const [loading, setLoading] = useState(true);

    axios.defaults.headers.common['Authorization'] = auth?.token

    useEffect(() => {
        const loadAuthData = async () => {
          try {
            const data = await AsyncStorage.getItem('auth');
            console.log(data)
            if (data) {
              const parseData = JSON.parse(data);
              setAuth({
                user: parseData.user,
                token: parseData.token,
              });
            }
          } catch (error) {
            console.error('Error loading or parsing auth data:', error);
          } finally{
            setLoading(false)
          }
        };
        loadAuthData();
    }, []);
    if (loading) {
      // Optional: Show a loading indicator while checking authentication status
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return(
        <AuthContext.Provider value={[auth, setAuth]}>
            {children}
        </AuthContext.Provider>
    )
}

// custom hookt
const useAuth = () => useContext(AuthContext)

export {useAuth, AuthProvider}