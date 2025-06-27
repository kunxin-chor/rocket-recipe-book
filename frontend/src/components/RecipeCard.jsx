export default function RecipeCard({ recipe }) {
    return (
        <div className="card">
            <img src={recipe.image_url} className="card-img-top" alt={recipe.name} />
            <div className="card-body">
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text">{recipe.description}</p>
                <a href={`/recipe/${recipe._id}`} className="btn btn-primary">View Recipe</a>
            </div>
        </div>
    );
}