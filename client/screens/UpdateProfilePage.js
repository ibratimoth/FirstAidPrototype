import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { useAuth } from '../context/auth';

const UpdateProfilePage = () => {
    const [auth, setAuth] = useAuth();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [city, setCity] = useState('');
    const [sport, setSport] = useState('');
    const navigation = useNavigation();

    useEffect(() => {
        if (auth?.user) {
            setUsername(auth.user.username);
            setEmail(auth.user.email);
            setContact(auth.user.contact);
            setCity(auth.user.city);
            setSport(auth.user.sport);
        }
    }, [auth]);

    const handleUpdateProfile = async () => {
        try {
            const response = await axios.put(`http://192.168.211.231:8082/api/v1/auth/updateuser/${auth.user._id}`, {
                username,
                email,
                contact,
                city,
                sport,
            });
            if (response.status === 200) {
                setAuth({ ...auth, user: response.data });
                Alert.alert('Success', 'Profile updated successfully');
                navigation.goBack();
            } else {
                Alert.alert('Error', response.data.message || 'Failed to update profile');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Update Profile</Text>
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contact"
                value={contact}
                onChangeText={setContact}
            />
            <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
            />
            <TextInput
                style={styles.input}
                placeholder="Sport"
                value={sport}
                onChangeText={setSport}
            />
            <Button title="Update Profile" onPress={handleUpdateProfile} />
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
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 12,
        padding: 10,
    },
});

export default UpdateProfilePage;
