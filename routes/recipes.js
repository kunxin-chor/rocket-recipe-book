const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { ObjectId } = require("mongodb");
const { verifyToken } = require('../middlewares');

/**
 * POST /recipes
 *
 * Expects request body in the following format:
 * {
 *   name: string,                     // Recipe name
 *   cooking_duration: string,         // e.g. '45 minutes'
 *   difficulty: string,               // e.g. 'Beginner', 'Intermediate', 'Advanced'
 *   cuisine: string,                  // Cuisine ID (as string, ObjectId hex)
 *   tags: string[],                   // Array of tag IDs (as strings, ObjectId hex)
 *   ingredients: string[],            // Array of ingredient strings
 *   image_url: string,                // (optional) Image URL
 *   description: string,              // (optional) Description
 *   steps: string[]                   // (optional) Array of step strings
 * }
 *
 * Example:
 * {
 *   "name": "Spaghetti Bolognese",
 *   "cooking_duration": "45 minutes",
 *   "difficulty": "Beginner",
 *   "cuisine": "60f6a7e7c5d2f2a9a0c1e1a7",
 *   "tags": ["60f6a7e7c5d2f2a9a0c1e1b2", "60f6a7e7c5d2f2a9a0c1e1b3"],
 *   "ingredients": ["spaghetti", "beef", "tomato sauce"],
 *   "image_url": "https://example.com/spaghetti.jpg",
 *   "description": "A simple and delicious recipe for spaghetti bolognese.",
 *   "steps": ["Boil water", "Cook pasta", "Mix sauce"]
 * }
 */
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, cooking_duration, difficulty, cuisine, tags, ingredients, image_url, description, steps } = req.body;

        // Validation
        if (!name || !cooking_duration || !difficulty || !cuisine || !tags || !ingredients) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const db = getDb();
        // Look up cuisine object
        const cuisineObj = cuisine ? await db.collection('cuisine').findOne({ _id: new ObjectId(cuisine) }) : null;
        if (!cuisineObj) {
            return res.status(400).json({ message: 'Invalid cuisine ID' });
        }
        // Look up tag objects
        let tagObjs = [];
        if (Array.isArray(tags)) {
            tagObjs = await db.collection('tags').find({ _id: { $in: tags.map(id => new ObjectId(id)) } }).toArray();
            if (tagObjs.length !== tags.length) {
                return res.status(400).json({ message: 'One or more tag IDs are invalid' });
            }
        }
        const newRecipe = {
            name,
            cooking_duration,
            difficulty,
            cuisine: { _id: cuisineObj._id, name: cuisineObj.name },
            tags: tagObjs.map(tag => ({ _id: tag._id, name: tag.name })),
            ingredients,
            user_id: req.user._id,
            image_url,
            description,
            steps
        };
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

        // Get all tags and cuisines
        const tags = await db.collection('tags').find({}).toArray();
        const cuisines = await db.collection('cuisine').find({}).toArray();

        const tagMap = new Map(tags.map(tag => [tag._id.toString(), tag]));
        const cuisineMap = new Map(cuisines.map(cuisine => [cuisine._id.toString(), cuisine]));

        recipes.forEach(recipe => {
            // Populate tags as array of {_id, name}
            recipe.tags = Array.isArray(recipe.tags) ? recipe.tags.map(tagId => tagMap.get(tagId.toString()) || tagId) : [];
            // Populate cuisine as {_id, name}
            recipe.cuisine = recipe.cuisine && cuisineMap.get(recipe.cuisine.toString()) ? cuisineMap.get(recipe.cuisine.toString()) : recipe.cuisine;
        });

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

        // Ensure tags are returned as full objects
        const tags = await db.collection('tags').find({}).toArray();
        const tagMap = new Map(tags.map(tag => [tag._id.toString(), tag]));
        if (Array.isArray(recipe.tags)) {
            recipe.tags = recipe.tags.map(tag => {
                // If tag is already an object with name, keep it; else, look up
                if (typeof tag === 'object' && tag.name) return tag;
                const found = tagMap.get((tag._id || tag).toString());
                return found ? { _id: found._id, name: found.name } : tag;
            });
        }

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
        const { name, cooking_duration, difficulty, cuisine, tags, ingredients, image_url, description, steps } = req.body;

        // Validation
        if (!name || !Array.isArray(ingredients) || ingredients.length === 0 || !cuisine || !tags) {
            return res.status(400).json({ message: 'Name, cuisine, tags, and ingredients are required, and ingredients should be a non-empty array.' });
        }
        // Look up cuisine object
        const cuisineObj = cuisine ? await db.collection('cuisine').findOne({ _id: new ObjectId(cuisine) }) : null;
        if (!cuisineObj) {
            return res.status(400).json({ message: 'Invalid cuisine ID' });
        }
        // Look up tag objects
        let tagObjs = [];
        if (Array.isArray(tags)) {
            tagObjs = await db.collection('tags').find({ _id: { $in: tags.map(id => new ObjectId(id)) } }).toArray();
            if (tagObjs.length !== tags.length) {
                return res.status(400).json({ message: 'One or more tag IDs are invalid' });
            }
        }
        const updateData = {
            name,
            cooking_duration,
            difficulty,
            cuisine: { _id: cuisineObj._id, name: cuisineObj.name },
            tags: tagObjs.map(tag => ({ _id: tag._id, name: tag.name })),
            ingredients,
            image_url,
            description,
            steps
        };
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
