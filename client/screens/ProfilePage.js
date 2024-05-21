import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {useAuth} from '../context/auth'

const ProfilePage = () => {
    const [auth, setAuth] = useAuth()
    const navigation = useNavigation();

    const navigateToUpdateProfile = () => {
        navigation.navigate('Updateprofile');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Profile Page</Text>
            <View style={styles.profileInfo}>
                <Text>Name: {auth?.user?.username}</Text>
                <Text>Email: {auth?.user?.email}</Text>
                <Text>Contact: {auth?.user?.contact}</Text>
                <Text>City: {auth?.user?.city}</Text>
                <Text>Sport: {auth?.user?.sport}</Text>
                {/* Display other profile information */}
            </View>
            <Button title="Update Profile" onPress={navigateToUpdateProfile} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    profileInfo: {
        marginBottom: 20,
    },
});

export default ProfilePage;