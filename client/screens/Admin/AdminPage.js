import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert, TouchableOpacity } from "react-native";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(
        "http://192.168.211.231:8082/api/v1/auth/getUsers"
      );
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.put(
        `http://192.168.211.231:8082/api/v1/auth/userrole/${userId}/role`,
        { role: newRole }
      );
      fetchUsers(); // Refresh the user list after update
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const confirmUpdateRole = (userId, newRole) => {
    Alert.alert("Update Role", "Are you sure you want to update the role?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: () => updateUserRole(userId, newRole) },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.txt}>Name: {item.username}</Text>
      <Text style={styles.txt}>Email: {item.email}</Text>
      <Text style={styles.txt}>
        Role: {item.role === 1 ? "Admin" : item.role === 2 ? "Nurse" : "User"}
      </Text>
      <View style={styles.buttonContainer}>
      <TouchableOpacity
          style={styles.button}
          onPress={() => confirmUpdateRole(item._id, 0)}
        >
          <Text style={styles.buttonText}>Set User</Text>
        </TouchableOpacity>
      <TouchableOpacity
          style={styles.button}
          onPress={() => confirmUpdateRole(item._id, 2)}
        >
          <Text style={styles.buttonText}>Set Nurse</Text>
        </TouchableOpacity>
      <TouchableOpacity
          style={styles.button}
          onPress={() => confirmUpdateRole(item._id, 1)}
        >
          <Text style={styles.buttonText}>Set Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Page</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id.toString()}
        renderItem={renderItem}
      />
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
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: 'serif',
    textAlign: 'center'
  },
  userContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f2e0cd'
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  txt:{
    fontFamily: 'serif',
    fontSize: 16
  },
  button: {
    backgroundColor: "#eb6434",
    borderRadius: 5,
    marginBottom: 10,
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  buttonText: {
    fontSize: 15,
    color: "#fff",
    paddingVertical: 1, // Padding inside the button text
    paddingHorizontal: 5, // Padding inside the button text
    textAlign: "center",
    fontFamily: "serif",
  },
});
export default AdminPage;
