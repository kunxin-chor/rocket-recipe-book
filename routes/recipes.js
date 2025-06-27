const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { ObjectId } = require("mongodb");
const { verifyToken } = require('../middlewares');

router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, cooking_duration, difficulty, cuisine, tags, ingredients, image_url } = req.body;

        // Validation
        if (!name || !cooking_duration || !difficulty || !cuisine || !tags || !ingredients) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const db = getDb();
        const newRecipe = { name, cooking_duration, difficulty, cuisine, tags, ingredients, user_id: req.user._id, image_url };
        const result = await db.collection('recipes').insertOne(newRecipe);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error adding new recipe', error: error.message });
    }
});

// Get all recipes
router.get('/', async (req, res) => {
    try {
        const db = getDb();

        const recipes = await db.collection('recipes').find({}).toArray();

        // convert tags to name
        const tags = await db.collection('tags').find({}).toArray();

        if (tags) {
            const tagMap = new Map(tags.map(tag => [tag._id, tag.name]));
            recipes.forEach(recipe => {
                recipe.tags = Array.isArray(recipe.tags) ? recipe.tags.map(tag => tagMap.get(tag)) : [];
            });
        }

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
});

// Get a single recipe by ID
router.get('/:id', async (req, res) => {
    try {
       
        // test if valid ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const id = new ObjectId(req.params.id);

        const db = getDb();
        const recipe = await db.collection('recipes').findOne({ _id: id });

        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }

        // convert tags to name
        const tags = await db.collection('tags').find({}).toArray();
        const tagMap = new Map(tags.map(tag => [tag._id.toString(), tag.name]));
        recipe.tags = Array.isArray(recipe.tags) ? recipe.tags.map(tag => tagMap.get(tag.toString())) : [];
     

        res.json(recipe);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recipe', error: error.message });
        console.log(error)
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        // test if valid ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const db = getDb();
        const id = new ObjectId(req.params.id);
        const { name, cooking_duration, difficulty, cuisine, tags, ingredients, image_url } = req.body;

        // Validation
        if (!name || !Array.isArray(ingredients) || ingredients.length === 0) {
            return res.status(400).json({ message: 'Name and ingredients are required, and ingredients should be a non-empty array.' });
        }

        // Additional validation can be added as necessary

        const updateData = { name, cooking_duration, difficulty, cuisine, tags, ingredients, image_url };
        const result = await db.collection('recipes').updateOne(
            { _id: id },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No recipe found with this ID, or no new data provided' });
        }

        res.json({ message: 'Recipe updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        // test if valid ObjectId
        if (!ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: 'Invalid ID' });
        }
        const db = getDb();
        const id = new ObjectId(req.params.id);
        const result = await db.collection('recipes').deleteOne({ _id: id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No recipe found with this ID' });
        }
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
});


module.exports = router;
