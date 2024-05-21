const categoryModel = require('../models/categoryModel')
const slugify = require('slugify')

const createCategoryController = async (req,res) => {
    try {
        const { injuryType } = req.body;

        if (!injuryType) {
            return res.status(400).send({
                success: false,
                message: 'Injury type is required',
            });
        }

        const existingCategory = await categoryModel.findOne({ injuryType });
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Injury type already exists',
            });
        }

        const newCategory = await categoryModel.create({ injuryType });

        res.status(201).send({
            success: true,
            message: 'New injury type created',
            category: newCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error creating injury type',
            error: error.message,
        });
    }
}

const updateCategoryController =  async (req, res) => {
    try {
        const { id } = req.params;
        const { injuryType } = req.body;

        // Validate input
        if (!id || !injuryType) {
            return res.status(400).send({
                success: false,
                message: 'ID and injury type are required',
            });
        }

        // Check if the category exists
        const existingCategory = await categoryModel.findById(id);
        if (!existingCategory) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }

        // Update the category
        existingCategory.injuryType = injuryType;
        await existingCategory.save();

        res.status(200).send({
            success: true,
            message: 'Category updated successfully',
            category: existingCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error updating category',
            error: error.message,
        });
    }
}

const categoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find();

        if (categories.length === 0) {
            return res.status(200).send({
                success: true,
                message: 'No categories found',
                categories: [],
            });
        }

        res.status(200).send({
            success: true,
            message: 'Categories fetched successfully',
            categories,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching categories',
            error: error.message,
        });
    }
}

const singleCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate input
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Category ID is required',
            });
        }

        // Find category by ID
        const category = await categoryModel.findById(id);

        // Check if category exists
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Category fetched successfully',
            category,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error fetching category',
            error: error.message,
        });
    }
}

const deleteCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is provided
        if (!id) {
            return res.status(400).send({
                success: false,
                message: 'Category ID is required',
            });
        }

        // Find the category by ID and delete it
        const deletedCategory = await categoryModel.findByIdAndDelete(id);

        // Check if category exists
        if (!deletedCategory) {
            return res.status(404).send({
                success: false,
                message: 'Category not found',
            });
        }

        res.status(200).send({
            success: true,
            message: 'Category deleted successfully',
            category: deletedCategory,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error deleting category',
            error: error.message,
        });
    }
}
module.exports = {
    createCategoryController, 
    updateCategoryController, 
    categoryController, 
    singleCategoryController,
    deleteCategoryController
}