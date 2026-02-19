export default function validateRecipeUpdate(editedRecipe) {
    if (!editedRecipe.title.trim()) return "Das Rezept braucht einen Titel.";
    if (editedRecipe.content.ingredients.length === 0) return "Das Rezept muss Zutaten beinhalten.";
    if (editedRecipe.content.steps.length === 0) return "Das Rezept muss Zubereitungsschritte beinhalten.";

    const hasInvalidIngredient = editedRecipe.content.ingredients.some(ing => !ing.name.trim());
    if (hasInvalidIngredient) return "Alle Zutaten müssen einen Namen haben.";

    const cookingTime = parseInt(editedRecipe.content.cooking_time);
    if (isNaN(cookingTime) || cookingTime <= 0) return "Ungültige Zubereitungszeit.";

    for (const key in editedRecipe.content.nutrients) {
        const value = editedRecipe.content.nutrients[key];
        const parsedValue = parseInt(value);

        if (value === "" || isNaN(parsedValue)) return `Bitte gib einen Wert für ${key} ein.`;
        if (parsedValue < 0) return `${key} darf nicht negativ sein.`;
    }

    const servings = parseInt(editedRecipe.content.servings);
    if (isNaN(servings) || servings <= 0) return "Ungültige Portionsanzahl.";

    return null; 
}