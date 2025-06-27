
const express = require('express');
const cors = require('cors');
const { connectToMongoDB } = require('./db');
const { ObjectId } = require("mongodb");

const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

app.use(express.json())

const tagsRouter = require('./routes/tags');
const cuisineRouter = require('./routes/cuisine');

async function main() {
    try {
        await connectToMongoDB();


        app.use('/recipes', require('./routes/recipes'));
        app.use('/auth', require('./routes/auth'));
        app.use('/tags', tagsRouter);
        app.use('/cuisines', cuisineRouter);
      
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });

    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

main();