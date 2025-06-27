# Recipe Book API

A Node.js/Express API for managing recipes, users, and reviews, with JWT authentication and MongoDB.

## Authentication Routes

### POST /auth/login
- **Body:**
  ```json
  { "email": "user@example.com", "password": "password" }
  ```
- **Response:**
  ```json
  { "accessToken": "<jwt-token>" }
  ```
- **Description:** Log in a user and receive a JWT access token.

### POST /auth/register
- **Body:**
  ```json
  { "email": "user@example.com", "password": "password" }
  ```
- **Response:**
  ```json
  { "accessToken": "<jwt-token>" }
  ```
- **Description:** Register a new user and receive a JWT access token.

## Recipe Routes

> All POST, PUT, DELETE routes require a valid `Authorization: Bearer <token>` header.

### GET /recipes
- **Response:**
  ```json
  [
    {
      "_id": "000000000000000000000101",
      "name": "Spaghetti Carbonara",
      "cooking_duration": "30 min",
      "difficulty": "Easy",
      "cuisine": "Italian",
      "tags": ["Pasta", "Quick"],
      "ingredients": ["Spaghetti", "Eggs", "Bacon", "Parmesan"],
      "user_id": "000000000000000000010001"
    },
    ...
  ]
  ```
- **Description:** Get all recipes.

### GET /recipes/:id
- **Response:**
  ```json
  {
    "_id": "000000000000000000000101",
    "name": "Spaghetti Carbonara",
    "cooking_duration": "30 min",
    "difficulty": "Easy",
    "cuisine": "Italian",
    "tags": ["Pasta", "Quick"],
    "ingredients": ["Spaghetti", "Eggs", "Bacon", "Parmesan"],
    "user_id": "000000000000000000010001"
  }
  ```
- **Description:** Get a single recipe by its ID.

### POST /recipes
- **Body:**
  ```json
  {
    "name": "Chicken Tikka Masala",
    "cooking_duration": "45 min",
    "difficulty": "Medium",
    "cuisine": "Indian",
    "tags": ["Curry", "Spicy"],
    "ingredients": ["Chicken", "Yogurt", "Tomato", "Onion", "Garlic", "Ginger", "Spices"]
  }
  ```
- **Response:**
  ```json
  { "insertedId": "000000000000000000000104" }
  ```
- **Description:** Create a new recipe (requires authentication).

### PUT /recipes/:id
- **Body:**
  ```json
  {
    "name": "Updated Recipe",
    "cooking_duration": "99 min",
    "difficulty": "Expert",
    "cuisine": "French",
    "tags": ["Gourmet"],
    "ingredients": ["Duck", "Orange", "Wine"]
  }
  ```
- **Response:**
  ```json
  { "message": "Recipe updated successfully" }
  ```
- **Description:** Update a recipe by ID (requires authentication).

### DELETE /recipes/:id
- **Response:**
  ```json
  { "message": "Recipe deleted successfully" }
  ```
- **Description:** Delete a recipe by ID (requires authentication).

## Tag & Cuisine API Endpoints

### Tags

#### GET /api/tags
- **Response:**
  ```json
  [ { "_id": "...", "name": "Pasta" }, ... ]
  ```
- **Description:** Get all tags.

#### GET /api/tags/:id
- **Response:**
  ```json
  { "_id": "...", "name": "Pasta" }
  ```
- **Description:** Get a tag by ID.

#### POST /api/tags
- **Body:**
  ```json
  { "name": "Vegetarian" }
  ```
- **Response:**
  ```json
  { "_id": "...", "name": "Vegetarian" }
  ```
- **Description:** Create a new tag.

#### PUT /api/tags/:id
- **Body:**
  ```json
  { "name": "Updated Tag" }
  ```
- **Response:**
  ```json
  { "_id": "...", "name": "Updated Tag" }
  ```
- **Description:** Update a tag by ID.

#### DELETE /api/tags/:id
- **Response:**
  ```json
  { "success": true }
  ```
- **Description:** Delete a tag by ID.

---

### Cuisine

#### GET /api/cuisine
- **Response:**
  ```json
  [ { "_id": "...", "name": "Italian" }, ... ]
  ```
- **Description:** Get all cuisines.

#### GET /api/cuisine/:id
- **Response:**
  ```json
  { "_id": "...", "name": "Italian" }
  ```
- **Description:** Get a cuisine by ID.

#### POST /api/cuisine
- **Body:**
  ```json
  { "name": "Japanese" }
  ```
- **Response:**
  ```json
  { "_id": "...", "name": "Japanese" }
  ```
- **Description:** Create a new cuisine.

#### PUT /api/cuisine/:id
- **Body:**
  ```json
  { "name": "Updated Cuisine" }
  ```
- **Response:**
  ```json
  { "_id": "...", "name": "Updated Cuisine" }
  ```
- **Description:** Update a cuisine by ID.

#### DELETE /api/cuisine/:id
- **Response:**
  ```json
  { "success": true }
  ```
- **Description:** Delete a cuisine by ID.

## Other Collections

- **tags**: Used for recipe tag lookups.
- **cuisine**: Used for cuisine lookups.
- **users**: Registered users with hashed passwords.
- **reviews**: (If implemented) User reviews for recipes.

## Setup & Usage

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with:
   ```env
   MONGO_URI=<your-mongodb-uri>
   MONGO_DB=<your-db-name>
   JWT_SECRET=<your-jwt-secret>
   ```
3. Import data using the import script (if needed):
   ```bash
   node import-data.js
   ```
4. Start the server:
   ```bash
   node index.js
   ```
5. Run tests:
   ```bash
   npm test
   ```

## Notes
- All protected routes require a valid JWT token in the `Authorization` header.
- See `tests/` for usage examples.
