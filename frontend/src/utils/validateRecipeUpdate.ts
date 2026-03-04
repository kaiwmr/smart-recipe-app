import { Recipe, Nutrients } from "../types";

/**
 * Validiert ein Rezept-Objekt vor dem Speichern.
 * @param editedRecipe Das zu prüfende Rezept-Objekt
 * @returns Einen String mit der Fehlermeldung oder null, wenn alles korrekt ist.
 */
export default function validateRecipeUpdate(editedRecipe: Recipe) {
    
    // ==========================================
    // 1. BASIS-VALIDIERUNG (Titel & Vollständigkeit)
    // ==========================================
    if (!editedRecipe.title.trim()) return "Das Rezept braucht einen Titel.";
    
    if (editedRecipe.content.ingredients.length === 0) {
        return "Das Rezept muss Zutaten beinhalten.";
    }
    
    if (editedRecipe.content.steps.length === 0) {
        return "Das Rezept muss Zubereitungsschritte beinhalten.";
    }

    // ==========================================
    // 2. ZUTATEN-VALIDIERUNG
    // ==========================================
    // Prüft, ob jede vorhandene Zutat auch einen Namen hat
    const hasInvalidIngredient = editedRecipe.content.ingredients.some(ing => !ing.name.trim());
    if (hasInvalidIngredient) return "Alle Zutaten müssen einen Namen haben.";

    // ==========================================
    // 3. ZEIT- & PORTIONS-VALIDIERUNG
    // ==========================================
    const cookingTime = parseInt(String(editedRecipe.content.cooking_time));
    if (isNaN(cookingTime) || cookingTime <= 0) return "Ungültige Zubereitungszeit.";

    const servings = parseInt(String(editedRecipe.content.servings));
    if (isNaN(servings) || servings <= 0) return "Ungültige Portionsanzahl.";

    // ==========================================
    // 4. NÄHRWERT-VALIDIERUNG
    // ==========================================
    // Wir iterieren über alle Felder des Nutrients-Objekts (kcal, protein, etc.)
    for (const key in editedRecipe.content.nutrients) {
        const nutrientKey = key as keyof Nutrients;
        const value = editedRecipe.content.nutrients[nutrientKey];

        // Umwandlung in Zahl, falls es als String aus einem Input kommt
        const parsedValue = parseInt(String(value));

        if (isNaN(parsedValue)) return `Bitte gib einen Wert für ${key} ein.`;
        if (parsedValue < 0) return `${key} darf nicht negativ sein.`;
    }

    // Alles okay
    return null; 
}