import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, Alert } from "react-native";
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
      <Text>Name: {item.name}</Text>
      <Text>Email: {item.email}</Text>
      <Text>
        Role: {item.role === 1 ? "Admin" : item.role === 2 ? "Nurse" : "User"}
      </Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Set User"
          onPress={() => confirmUpdateRole(item._id, 0)}
        />
        <Button
          title="Set Nurse"
          onPress={() => confirmUpdateRole(item._id, 2)}
        />
        <Button
          title="Set Admin"
          onPress={() => confirmUpdateRole(item._id, 1)}
        />
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
  },
  userContainer: {
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
});
export default AdminPage;
