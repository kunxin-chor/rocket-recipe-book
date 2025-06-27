import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "wouter";

export default function RecipeDetailPage() {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}recipes/${id}`);
                setRecipe(response.data);
            } catch (error) {
                setRecipe(null);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, []);

    const loadingContent = (
        <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading recipe...</p>
        </div>
    );

    const errorContent = (
        <div className="container text-center mt-5">
            <h2>Recipe not found</h2>
            <p>Please check the recipe ID or try again later.</p>
        </div>
    );

    const recipeContent = recipe && (
        <div className="container mt-5" style={{ maxWidth: '700px' }}>
            <div className="card shadow p-4">
                <img src={recipe.image_url} alt={recipe.name} className="img-fluid mb-4" />
                <h1 className="mb-3 text-primary">{recipe.name}</h1>
                <p className="text-muted mb-2">Cuisine: <strong>{recipe.cuisine?.name}</strong></p>
                <p className="mb-2">Difficulty: <strong>{recipe.difficulty}</strong></p>
                <p className="mb-2">Cooking Duration: <strong>{recipe.cooking_duration} minutes</strong></p>
                <p>Tags: {Array.isArray(recipe.tags) ? recipe.tags.map(tag => (
                    <span key={tag._id} className="badge bg-primary me-2">{tag.name}</span>
                )) : ''}</p>
                <hr />
                <h4>Description</h4>
                <p>{recipe.description}</p>
                <h4>Ingredients</h4>
                <ul>
                    {Array.isArray(recipe.ingredients) && recipe.ingredients.map((ingredient, idx) => (
                        <li key={idx}>{ingredient}</li>
                    ))}
                </ul>
                <h4>Steps</h4>
                <ol>
                    {Array.isArray(recipe.steps) && recipe.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                    ))}
                </ol>
            </div>
        </div>
    );

    return (
        loading ? loadingContent : recipe ? recipeContent : errorContent
    );
}
