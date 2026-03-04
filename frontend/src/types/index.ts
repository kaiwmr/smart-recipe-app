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

export interface Ingredient {
    name: string;
    amount: number | null;
    unit: string | null;
    id_slug?: string;
    search_term?: string;
    est_weight_g?: number;
    per_100g?: Nutrients;
}

export interface RecipeContent {
    servings: number | string; // string wegen leerem Input beim Editieren
    ingredients: Ingredient[];
    steps: string[];
    cooking_time: number | string;
    tags: string[];
    nutrients: Nutrients;
}

export interface Recipe {
    id: number;
    title: string;
    content: RecipeContent;
    url: string;
    image: string;
    owner_id: number;
}

export interface User {
    id: number;
    email: string;
}