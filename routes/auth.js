const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getDb } = require('../db');
const bcrypt = require('bcrypt');

const generateAccessToken = (id, email) => {
    return jwt.sign({
        'user_id': id,
        'email': email
    }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });
}

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
    const user = await getDb().collection('users').findOne({ email: email });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    const accessToken = generateAccessToken(user._id, user.email);

    // remove password from user object
    delete user.password;

    res.json({ accessToken: accessToken, user: user });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }
    const user = await getDb().collection('users').findOne({ email: email });
    if (user) {
        return res.status(409).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { email: email, password: hashedPassword };
    await getDb().collection('users').insertOne(newUser);
    const accessToken = generateAccessToken(newUser._id, newUser.email);
    res.json({ accessToken: accessToken });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

module.exports = router;
