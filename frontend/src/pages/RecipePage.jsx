import { useEffect, useState } from "react";
import axios from "axios";
import RecipeCard from "../components/RecipeCard";

export default function RecipePage() {

    const [recipes, setRecipes] = useState([]);
    
    useEffect(()=>{
        const fetchAllRecipes = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}recipes`);
            setRecipes(response.data);
        }
        fetchAllRecipes();
    },[]);
    return (
        <div className="container">
            <h1>Recipe Page</h1>
            <div className="row g-4">
                {recipes.map(recipe => (
                    <div className="col-md-4 d-flex justify-content-center" key={recipe._id}>
                        <RecipeCard recipe={recipe} />
                    </div>
                ))}
            </div>
        </div>
    );
}