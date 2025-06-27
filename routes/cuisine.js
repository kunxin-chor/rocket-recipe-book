const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { ObjectId } = require('mongodb');

// GET all cuisines
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const cuisines = await db.collection('cuisine').find().toArray();
        res.json(cuisines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET cuisine by id
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        const cuisine = await db.collection('cuisine').findOne({ _id: new ObjectId(req.params.id) });
        if (!cuisine) return res.status(404).json({ error: 'Cuisine not found' });
        res.json(cuisine);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE cuisine
router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const result = await db.collection('cuisine').insertOne({ name });
        res.status(201).json(result.ops ? result.ops[0] : { _id: result.insertedId, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE cuisine
router.put('/:id', async (req, res) => {
    try {
        const db = getDb();
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const result = await db.collection('cuisine').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { name } },
            { returnDocument: 'after' }
        );
        if (!result.value) return res.status(404).json({ error: 'Cuisine not found' });
        res.json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE cuisine
router.delete('/:id', async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('cuisine').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Cuisine not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;