const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const { ObjectId } = require('mongodb');

// GET all tags
router.get('/', async (req, res) => {
    try {
        const db = getDb();
        const tags = await db.collection('tags').find().toArray();
        res.json(tags);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET tag by id
router.get('/:id', async (req, res) => {
    try {
        const db = getDb();
        const tag = await db.collection('tags').findOne({ _id: new ObjectId(req.params.id) });
        if (!tag) return res.status(404).json({ error: 'Tag not found' });
        res.json(tag);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE tag
router.post('/', async (req, res) => {
    try {
        const db = getDb();
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const result = await db.collection('tags').insertOne({ name });
        res.status(201).json(result.ops ? result.ops[0] : { _id: result.insertedId, name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE tag
router.put('/:id', async (req, res) => {
    try {
        const db = getDb();
        const { name } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const result = await db.collection('tags').findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { name } },
            { returnDocument: 'after' }
        );
        if (!result.value) return res.status(404).json({ error: 'Tag not found' });
        res.json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE tag
router.delete('/:id', async (req, res) => {
    try {
        const db = getDb();
        const result = await db.collection('tags').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Tag not found' });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;