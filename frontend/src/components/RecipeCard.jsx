export default function RecipeCard({ recipe }) {
    return (
        <div className="card h-100 mx-auto" style={{ minHeight: '420px', maxHeight: '420px', width: '340px' }}>
            <img
                src={recipe.image_url}
                className="card-img-top"
                alt={recipe.name}
                style={{ height: '200px', objectFit: 'cover', width: '100%' }}
            />
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text flex-grow-1">{recipe.description}</p>
                <a href={`/recipe/${recipe._id}`} className="btn btn-primary mt-auto">View Recipe</a>
            </div>
        </div>
    );
}