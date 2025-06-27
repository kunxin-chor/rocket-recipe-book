import {  useState } from "react";

export default function RecipeForm({ initialValues = {}, onSubmit, submitLabel = "Submit", allTags = [], allCuisines = [] }) {
    const [form, setForm] = useState(() => {
        if (initialValues && Object.keys(initialValues).length > 0) {
            return {
                name: initialValues.name || "",
                cooking_duration: initialValues.cooking_duration || "",
                difficulty: initialValues.difficulty || "",
                // cuisine and tags must be IDs (string)
                cuisine: typeof initialValues.cuisine === 'object' ? initialValues.cuisine._id : initialValues.cuisine || "",
                tags: Array.isArray(initialValues.tags) && typeof initialValues.tags[0] === 'object' ? initialValues.tags.map(t => t._id) : (initialValues.tags || []),
                ingredients: Array.isArray(initialValues.ingredients) ? initialValues.ingredients.join("\n") : (initialValues.ingredients || ""),
                image_url: initialValues.image_url || "",
                steps: Array.isArray(initialValues.steps) ? initialValues.steps.join("\n") : (initialValues.steps || ""),
                description: initialValues.description || ""
            };
        }
        return {
            name: "",
            cooking_duration: "",
            difficulty: "",
            cuisine: "",
            tags: [],
            ingredients: "",
            image_url: "",
            steps: "",
            description: ""
        };
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);


    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess(false);
        setError(null);
        try {
            await onSubmit({
                name: form.name,
                cooking_duration: form.cooking_duration,
                difficulty: form.difficulty,
                cuisine: form.cuisine, // cuisine ID (string)
                tags: form.tags, // array of tag IDs (strings)
                ingredients: form.ingredients.split("\n").map(i => i.trim()).filter(Boolean),
                image_url: form.image_url,
                description: form.description,
                steps: form.steps.split("\n").map(s => s.trim()).filter(Boolean)
            });
            setSuccess(true);
        } catch (err) {
            setError(err.message || "Error submitting recipe");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-4 card shadow" style={{ maxWidth: 600, margin: 'auto' }}>
            <h2 className="mb-3">{submitLabel} Recipe</h2>
            {success && <div className="alert alert-success">Recipe {submitLabel.toLowerCase()}d successfully!</div>}
            {error && <div className="alert alert-danger">Error: {error}</div>}
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
                <label htmlFor="cooking_duration" className="form-label">Cooking Duration</label>
                <input type="text" className="form-control" id="cooking_duration" name="cooking_duration" value={form.cooking_duration} onChange={handleChange} placeholder="e.g. 45 minutes" required />
            </div>
            <div className="mb-3">
                <label htmlFor="difficulty" className="form-label">Difficulty</label>
                <input type="text" className="form-control" id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange} placeholder="Beginner, Intermediate, Advanced" required />
            </div>
            <div className="mb-3">
                <label htmlFor="cuisine" className="form-label">Cuisine</label>
                <select className="form-select" id="cuisine" name="cuisine" value={form.cuisine} onChange={handleChange} required>
                    <option value="">Select a cuisine</option>
                    {allCuisines.map((cuisine) => (
                        <option key={cuisine._id} value={cuisine._id}>
                            {cuisine.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="tags" className="form-label">Tags (select multiple)</label>
                <select
                    className="form-select"
                    id="tags"
                    name="tags"
                    multiple
                    value={form.tags}
                    onChange={e => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value);
                        setForm({ ...form, tags: selected });
                    }}
                    required
                >
                    {allTags.map((tag) => (
                        <option key={tag._id} value={tag._id}>
                            {tag.name}
                        </option>
                    ))}
                </select>
                <div className="form-text">Hold Ctrl (Windows) or Cmd (Mac) to select multiple.</div>
            </div>
            <div className="mb-3">
                <label htmlFor="ingredients" className="form-label">Ingredients (one per line)</label>
                <textarea className="form-control" id="ingredients" name="ingredients" value={form.ingredients} onChange={handleChange} rows={4} required />
            </div>
            <div className="mb-3">
                <label htmlFor="image_url" className="form-label">Image URL</label>
                <input type="text" className="form-control" id="image_url" name="image_url" value={form.image_url} onChange={handleChange} />
            </div>
            <div className="mb-3">
                <label htmlFor="steps" className="form-label">Steps (one per line)</label>
                <textarea className="form-control" id="steps" name="steps" value={form.steps} onChange={handleChange} rows={5} required />
            </div>
            <div className="mb-3">
                <label htmlFor="description" className="form-label">Description</label>
                <textarea className="form-control" id="description" name="description" value={form.description} onChange={handleChange} rows={2} />
            </div>
            <button type="submit" className="btn btn-primary">{submitLabel}</button>
        </form>
    );
}