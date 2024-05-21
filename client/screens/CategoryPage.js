import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  ScrollView
} from "react-native";
import axios from "axios";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);
  const [updatedCategory, setUpdatedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://192.168.211.231:8082/api/v1/category/get-category"
      );
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Alert.alert("Error", "Failed to fetch categories");
    }
  };

  const handleCreateCategory = async () => {
    try {
      const response = await axios.post(
        "http://192.168.211.231:8082/api/v1/category/create-category",
        { injuryType: newCategory }
      );
      setCategories([...categories, response.data.category]);
      setNewCategory("");
      Alert.alert("Success", "Category created successfully");
    } catch (error) {
      console.error("Error creating category:", error);
      Alert.alert("Error", "Failed to create category");
    }
  };

  const handleUpdateCategory = async (id) => {
    try {
      const response = await axios.put(
        `http://192.168.211.231:8082/api/v1/category/update-category/${id}`,
        { injuryType: updatedCategory }
      );
      const updatedCategories = categories.map((category) =>
        category._id === id ? response.data.category : category
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
      setUpdatedCategory("");
      Alert.alert("Success", "Category updated successfully");
    } catch (error) {
      console.error("Error updating category:", error);
      Alert.alert("Error", "Failed to update category");
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(
        `http://192.168.211.231:8082/api/v1/category/delete-category/${deleteId}`
      );
      setCategories(categories.filter((category) => category._id !== deleteId));
      setDeleteId(null);
      setShowModal(false);
      Alert.alert("Success", "Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category:", error);
      Alert.alert("Error", "Failed to delete category");
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Create Category</Text>
      <TextInput
        style={styles.input}
        value={newCategory}
        onChangeText={setNewCategory}
        placeholder="Enter injury type"
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateCategory}>
        <Text>Create</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Categories</Text>
      <View style={styles.table}>
        {categories.map((category) => (
          <View key={category._id} style={styles.row}>
            {editingCategory === category._id ? (
              <>
                <TextInput
                  style={styles.updateinput}
                  value={updatedCategory}
                  onChangeText={setUpdatedCategory}
                  placeholder="Update injury type"
                />
                <TouchableOpacity
                  onPress={() => handleUpdateCategory(category._id)}
                >
                  <Text style={styles.actionText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setEditingCategory(null)}>
                  <Text style={styles.actionText}>Cancel</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.categoryContainer}>
                  <Text>{category.injuryType}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setEditingCategory(category._id);
                    setUpdatedCategory(category.injuryType);
                  }}
                >
                  <Text style={[styles.actionText, styles.editButton]}>
                    Edit
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => confirmDelete(category._id)}>
                  <Text style={[styles.actionText, styles.deleteButton]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}
      </View>

      <Modal
        visible={showModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to delete this category?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowModal(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleDeleteCategory}
              >
                <Text>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {

    flexGrow: 1,
    padding: 16
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 40, // Set a fixed height for the TextInput
    width: "100%",
  },
  updateinput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    height: 40, // Set a fixed height for the TextInput
    width: "40%",
  },
  button: {
    backgroundColor: "lightblue",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  categoryContainer: {
    flex: 1, // Allow text to wrap within the container
  },
  actionText: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    textDecorationLine: "none", // Add underline for "Edit" button
    
  },
  editButton: {
    backgroundColor: "lightblue", // Background color for "Edit" button
    marginRight: 20, // Add margin to separa te the buttons
  },
  deleteButton: {
    backgroundColor: "#eb6434",
    color: "white" // Background color for "Delete" button
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
});

export default CategoryPage;
