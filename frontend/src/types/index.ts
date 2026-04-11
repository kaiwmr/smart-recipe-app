/** --- Core Nutrient Data ----------------- */
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

/** --- Ingredient Structure --------------- */
export interface Ingredient {
    name: string;
    amount: number | null; 
    unit: string | null;   
    
    // AI-generated fields for backend nutrient calculation
    id_slug?: string;
    search_term?: string;
    est_weight_g?: number;
    per_100g?: Nutrients;
}

/** --- Recipe Content & Metadata ---------- */
export interface RecipeContent {
    // string allowed to handle empty input states during editing
    servings: number | string; 
    ingredients: Ingredient[];
    steps: string[];
    cooking_time: number | string;
    tags: string[];
    nutrients: Nutrients;
}

/** --- Main Recipe Entity ----------------- */
export interface Recipe {
    id: number;
    title: string;
    content: RecipeContent;
    url: string;    // Source link (Web/TikTok)
    image: string;  // Base64 encoded string
    owner_id: number;
}

/** --- User Entity ------------------------ */
export interface User {
    id: number;
    email: string;
}