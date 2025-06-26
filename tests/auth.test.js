const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const dbModule = require('../db');

const request = require('supertest');

let mongod, client, db, app;

const mockUsers = [
    {
        _id: new ObjectId(),
        email: 'test@example.com',
        password: bcrypt.hashSync('password', 10)
    }
]

beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    client = new MongoClient(uri);
    await client.connect();
    db = client.db('testdb');
    // Patch the db.js getDb to return our in-memory db
    dbModule.getDb = () => db;
    // insert mockusers
    await db.collection('users').insertMany(mockUsers);

    // recipes rouer must be included after db has been intiialized
    const authRouter = require('../routes/auth');
    app = express();
    app.use(express.json());
    app.use('/auth', authRouter);
});

afterAll(async () => {
    await client.close();
    await mongod.stop();
});

describe('POST /auth/login', () => {
    it('should return an access token for valid credentials', async () => {
        const res = await request(app).post('/auth/login').send({
            email: 'test@example.com',
            password: 'password'
        });
        console.log(res.body)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
    });
});
