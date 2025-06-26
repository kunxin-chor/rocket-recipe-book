const express = require('express');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { MongoClient, ObjectId } = require('mongodb');
const dbModule = require('../db');

const request = require('supertest');

let mongod, client, db, app;

const tagId1 = new ObjectId('64b1f6fa5f627b8a1a000001');
const tagId2 = new ObjectId('64b1f6fa5f627b8a1a000002');
const cuisineId1 = new ObjectId('64b1f6fa5f627b8a1a000011');
const cuisineId2 = new ObjectId('64b1f6fa5f627b8a1a000012');

const mockTags = [
  {
    _id: tagId1,
    name: 'Test Tag 1'
  },
  {
    _id: tagId2,
    name: 'Test Tag 2'
  }
];

const mockCuisine = [
  {
    _id: cuisineId1,
    name: 'Test Cuisine 1'
  },
  {
    _id: cuisineId2,
    name: 'Test Cuisine 2'
  }
];

const mockRecipes = [
  {
    name: 'Test Recipe 1',
    ingredients: ['a', 'b'],
    cooking_duration: '10 min',
    difficulty: 'Easy',
    tags: [tagId1, tagId2],
    cuisine: cuisineId1
  },
  {
    name: 'Test Recipe 2',
    ingredients: ['c', 'd'],
    cooking_duration: '20 min',
    difficulty: 'Medium',
    tags: [tagId1],
    cuisine: cuisineId2
  }
];



beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('testdb');
  // Patch the db.js getDb to return our in-memory db
  dbModule.getDb = () => db;
  // Seed mock data
  await db.collection('recipes').insertMany(mockRecipes);
  await db.collection('tags').insertMany(mockTags);
  await db.collection('cuisine').insertMany(mockCuisine);

  // recipes rouer must be included after db has been intiialized
  const recipesRouter = require('../routes/recipes');
  app = express();
  app.use(express.json());
  app.use('/recipes', recipesRouter);
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
});

describe('GET /recipes', () => {
  it('should return all recipes', async () => {
    const res = await request(app).get('/recipes');
    if (res.statusCode !== 200) {
      console.log(res.body);
    }
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
    expect(res.body[0].name).toBe('Test Recipe 1');
    expect(res.body[1].name).toBe('Test Recipe 2');
  });
});

describe('PUT /recipes/:id', () => {
  it('should update an existing recipe', async () => {
    // Insert a new recipe to update
    const insertRes = await db.collection('recipes').insertOne({
      name: 'PutTest Recipe',
      ingredients: ['z'],
      cooking_duration: '1 min',
      difficulty: 'Easy',
      tags: [tagId1],
      cuisine: cuisineId1
    });
    const recipeId = insertRes.insertedId;
    const updatedData = {
      name: 'Updated Recipe',
      ingredients: ['x', 'y'],
      cooking_duration: '99 min',
      difficulty: 'Expert',
      tags: [tagId2.toHexString()],
      cuisine: cuisineId2.toHexString()
    };
    const res = await request(app).put(`/recipes/${recipeId.toHexString()}`).send(updatedData);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Recipe updated successfully');

    // Confirm update in DB
    const updated = await db.collection('recipes').findOne({ _id: recipeId });
    expect(updated.name).toBe('Updated Recipe');
    expect(updated.ingredients).toEqual(['x', 'y']);
    expect(updated.cooking_duration).toBe('99 min');
    expect(updated.difficulty).toBe('Expert');
    expect(updated.tags[0].toString()).toEqual(tagId2.toHexString());
    expect(updated.cuisine.toString()).toEqual(cuisineId2.toHexString());
  });
});

describe('POST /recipes', () => {
  it('should add a new recipe and return it', async () => {
    const newRecipe = {
      name: 'Test Recipe 3',
      ingredients: ['e', 'f'],
      cooking_duration: '30 min',
      difficulty: 'Hard',
      tags: [tagId1.toHexString()],
      cuisine: cuisineId1.toHexString()
    };

    const res = await request(app).post('/recipes').send(newRecipe);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('insertedId');

    // Check if the recipe was actually inserted
    const inserted = await db.collection('recipes').findOne({ name: 'Test Recipe 3' });
    expect(inserted).toBeTruthy();
    expect(inserted).toHaveProperty('name', 'Test Recipe 3');
    expect(inserted).toHaveProperty('ingredients');
    expect(Array.isArray(inserted.ingredients)).toBe(true);
  });
});

describe('GET /recipes/:id', () => {
  it('should return the correct recipe for a valid id', async () => {
    // Find the inserted recipe's _id
    const recipe = await db.collection('recipes').findOne({ name: 'Test Recipe 1' });
    const res = await request(app).get(`/recipes/${recipe._id.toHexString()}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name', 'Test Recipe 1');
    expect(res.body).toHaveProperty('tags');
    expect(Array.isArray(res.body.tags)).toBe(true);
    expect(res.body.tags).toContain('Test Tag 1');
    expect(res.body.tags).toContain('Test Tag 2');
  });

  it('should return 404 for a non-existent id', async () => {
    const fakeId = new ObjectId('64b1f6fa5f627b8a1a000099');
    const res = await request(app).get(`/recipes/${fakeId.toHexString()}`);  
    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for an invalid id', async () => {
    const res = await request(app).get('/recipes/notavalidobjectid');
    expect(res.statusCode).toBe(400);
  });
});
