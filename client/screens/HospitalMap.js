// import React, { useEffect, useState } from 'react';
// import { StyleSheet, View, TextInput, Button, Alert, ScrollView } from 'react-native';
// import MapView, { Marker } from 'react-native-maps';
// import axios from 'axios';

// const HospitalMap = () => {
//   const [hospitals, setHospitals] = useState([]);
//   const [name, setName] = useState('');
//   const [address, setAddress] = useState('');
//   const [latitude, setLatitude] = useState('');
//   const [longitude, setLongitude] = useState('');

//   useEffect(() => {
//     const fetchHospitals = async () => {
//       try {
//         const response = await axios.get('http://192.168.211.231:8082/api/hospitals');
//         setHospitals(response.data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchHospitals();
//   }, []);

//   const handleAddHospital = async () => {
//     if (!name || !address || !latitude || !longitude) {
//       Alert.alert('Error', 'Please fill out all fields');
//       return;
//     }

//     const newHospital = {
//       name,
//       address,
//       latitude: parseFloat(latitude),
//       longitude: parseFloat(longitude),
//     };

//     try {
//       const response = await axios.post('http://192.168.211.231:8082/api/createhospitals', newHospital);
//       setHospitals([...hospitals, response.data]);
//       setName('');
//       setAddress('');
//       setLatitude('');
//       setLongitude('');
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Could not add hospital');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <MapView
//         style={styles.map}
//         initialRegion={{
//           latitude: -6.7754,
//           longitude: 39.2131,
//           latitudeDelta: 0.0922,
//           longitudeDelta: 0.0421,
//         }}
//       >
//         {hospitals.map((hospital, index) => (
//           <Marker
//             key={index}
//             coordinate={{
//               latitude: hospital.latitude,
//               longitude: hospital.longitude,
//             }}
//             title={hospital.name}
//             description={hospital.address}
//           />
//         ))}
//       </MapView>
//       <ScrollView style={styles.form}>
//         <TextInput
//           style={styles.input}
//           placeholder="Name"
//           value={name}
//           onChangeText={setName}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Address"
//           value={address}
//           onChangeText={setAddress}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Latitude"
//           value={latitude}
//           onChangeText={setLatitude}
//           keyboardType="numeric"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Longitude"
//           value={longitude}
//           onChangeText={setLongitude}
//           keyboardType="numeric"
//         />
//         <Button title="Add Hospital" onPress={handleAddHospital} />
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   map: {
//     flex: 2,
//   },
//   form: {
//     flex: 1,
//     padding: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
// });

// export default HospitalMap;
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, ScrollView } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';
import { useAuth } from '../context/auth';
import axios from 'axios';

const HospitalMap = () => {
  const [hospitals, setHospitals] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [auth] = useAuth()

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const response = await axios.get('http://192.168.211.185:8082/api/hospitals');
        setHospitals(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    };

    fetchLocation();
    fetchHospitals();
  }, []);

  const handleAddHospital = async () => {
    if (!name || !address || !latitude || !longitude) {
      Alert.alert('Error', 'Please fill out all fields');
      return;
    }

    const newHospital = {
      name,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    try {
      const response = await axios.post('http://192.168.211.185:8082/api/createhospitals', newHospital);
      setHospitals([...hospitals, response.data]);
      setName('');
      setAddress('');
      setLatitude('');
      setLongitude('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Could not add hospital');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -6.7754,
          longitude: 39.2131,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
      >
        {hospitals.map((hospital, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: hospital.latitude,
              longitude: hospital.longitude,
            }}
            title={hospital.name}
            description={hospital.address}
          />
        ))}
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="My Location"
            pinColor="blue"
          />
        )}
      </MapView>
      {auth?.user?.role === 1 && (
      <ScrollView style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <Button title="Add Hospital" onPress={handleAddHospital} />
      </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 2,
  },
  form: {
    flex: 1,
    padding: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default HospitalMap;
