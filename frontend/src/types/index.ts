/**
 * ==========================================
 * 1. NÄHRWERT-STRUKTUR
 * ==========================================
 */
export interface Nutrients {
    kcal: number;
    protein: number;
    fat: number;
    saturated_fat: number;
    carbs: number;
    sugar: number;
    fiber: number;
    salt: number;
}

/**
 * ==========================================
 * 2. ZUTATEN-STRUKTUR
 * ==========================================
 */
export interface Ingredient {
    name: string;
    amount: number | null; // null erlaubt, falls keine Mengenangabe vorhanden
    unit: string | null;   // null erlaubt, falls keine Einheit vorhanden
    
    // Optionale Felder (gekennzeichnet durch ?), die von der KI kommen 
    // und für die Nährwertberechnung im Backend genutzt werden
    id_slug?: string;
    search_term?: string;
    est_weight_g?: number;
    per_100g?: Nutrients;
}

/**
 * ==========================================
 * 3. REZEPT-INHALT
 * ==========================================
 */
export interface RecipeContent {
    // string erlaubt, damit das Input-Feld beim Editieren komplett geleert werden kann
    servings: number | string; 
    ingredients: Ingredient[];
    steps: string[];
    // cooking_time ebenfalls string | number für flexibles UI-Handling
    cooking_time: number | string;
    tags: string[];
    nutrients: Nutrients;
}

/**
 * ==========================================
 * 4. HAUPT OBJEKT
 * ==========================================
 */
export interface Recipe {
    id: number;
    title: string;
    content: RecipeContent;
    url: string;    // Link zur Quelle (Website oder TikTok)
    image: string;  // Base64-kodierter String des Bildes
    owner_id: number;
}

/**
 * ==========================================
 * 5. BENUTZER-STRUKTUR
 * ==========================================
 */
export interface User {
    id: number;
    email: string;
}