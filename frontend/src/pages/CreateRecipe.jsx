import RecipeForm from '../components/RecipeForm';
import { useLocation } from 'wouter';
import axios from 'axios';
import { useAuth } from '../atoms/authAtoms';
import { useState, useEffect } from 'react';

export default function CreateRecipe() {
    const [_, setLocation] = useLocation();
    const { user, token } = useAuth();

    // fetch cusines and tags
    const [cuisines, setCuisines] = useState([]);
    const [tags, setTags] = useState([]);
    useEffect(() => {
        const fetchCuisines = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}cuisines`);
            setCuisines(response.data);
        }
        fetchCuisines();
    }, []);
    useEffect(() => {
        const fetchTags = async () => {
            const response = await axios.get(`${import.meta.env.VITE_BASE_API_URL}tags`);
            setTags(response.data);
        }
        fetchTags();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Create Recipe</h2>
            <RecipeForm
                allTags={tags}
                allCuisines={cuisines}
                initialValues={{
                    cuisine: cuisines[0]?._id || "",
                    tags: tags.length > 0 ? [tags[0]._id] : [],
                    user_id: user.id
                }} onSubmit={async (recipe) => {
                    const response = await axios.post(`${import.meta.env.VITE_BASE_API_URL}recipes`, recipe, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    console.log(response.data);
                    setLocation('/recipes');
                }} />
        </div>
    );
}