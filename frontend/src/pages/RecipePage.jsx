import { useEffect } from "react";
import axios from "axios";

export default function RecipePage() {
    useEffect(()=>{
        const fetchAllRecipes = async () => {
            const response = await axios.get("http://localhost:3000/recipe");
            console.log(response.data);
        }
        fetchAllRecipes();
    },[]);
    return (
        <div>
            <h1>Recipe Page</h1>
        </div>
    );
}