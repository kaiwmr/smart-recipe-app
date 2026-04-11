import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../api/api'; 
import validateRecipeUpdate from '../../utils/validateRecipeUpdate';
import { Recipe, Ingredient, Nutrients } from '../../types';

export default function useRecipeEditor(id: string | undefined){
    const navigate = useNavigate();

    // --- State Management --------------------
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [currentServings, setCurrentServings] = useState<number>(1); 

    // --- Data Fetching -----------------------
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`recipes/${id}`);
                const data = response.data;
                
                setRecipe(data);
                setEditedRecipe(data);
                setCurrentServings(data.content.servings || 1); 
            } catch (error) {
                console.error("Fetch error:", error);
                toast.error("Rezept konnte nicht geladen werden.");
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchRecipe();
    }, [id, navigate]);

    // --- Persistence -------------------------
    const handleSave = async () => {
        if (!editedRecipe) return;

        const errorMessage = validateRecipeUpdate(editedRecipe);
        if (errorMessage) {
            toast.error(errorMessage)
            return;
        }

        try {
            const payload = {
                title: editedRecipe.title,
                content: editedRecipe.content,
            };

            const response = await api.put(`recipes/${id}`, payload);

            setRecipe(response.data);
            setCurrentServings(response.data.content.servings || 1);
            setIsEditing(false);
            toast.success("Gespeichert!");
        } catch (error) {
            console.error("Save error:", error);
            toast.error("Fehler beim Speichern");
        }
    };

    const deleteRecipe = async (recipeId: number) => {
        if (!window.confirm("Wirklich löschen?")) return;
        try {
            await api.delete(`/recipes/${recipeId}`);
            toast.success("Rezept gelöscht");
            navigate("/dashboard");
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Fehler beim Löschen aufgetreten");
        }
    };

    // --- View Logic --------------------------
    const toggleEditMode = (status: boolean) => {
        if (!recipe) return;

        if (status === true) {
            setEditedRecipe({
                ...recipe,
                content: { ...recipe.content, servings: currentServings }
            });
        }
        setIsEditing(status);
    };

    // --- Calculation Helpers -----------------
    const calculateAmount = (baseAmount: number | null) => {
        if (!baseAmount || !recipe) return "";
        
        const baseServings = recipe.content.servings || 1; 
        const result = (baseAmount / Number(baseServings)) * currentServings;
        
        return parseFloat(result.toFixed(2));
    };

    // --- Field Updates -----------------------
    const updateServings = (value: string) => {
        if (!editedRecipe) return;

        if (value === "") {
            setEditedRecipe({
                ...editedRecipe, 
                content: { ...editedRecipe.content, servings: "" }
            });
            return;
        }

        const val = parseInt(value);
        if (isNaN(val) || val < 1) return; 
        
        setCurrentServings(val);
        
        if(isEditing) {
            setEditedRecipe({
                ...editedRecipe,
                content: { ...editedRecipe.content, servings: val }
            });
        }
    };

    const updateCookingTime = (value: string) => {
        if (!editedRecipe) return;

        if (value === "") {
            setEditedRecipe({
                ...editedRecipe, 
                content: { ...editedRecipe.content, cooking_time: "" }
            });
            return;
        }

        const val = parseInt(value);
        if (isNaN(val) || val < 0) return;

        setEditedRecipe({
            ...editedRecipe,
            content: { ...editedRecipe.content, cooking_time: val }
        });
    };

    const updateNutrients = (value: string, field: keyof Nutrients) => {
        if (!editedRecipe) return;

        if (value === "") {
            setEditedRecipe({
                ...editedRecipe,
                content: { 
                    ...editedRecipe.content,
                    nutrients: { ...editedRecipe.content.nutrients, [field]: "" } 
                }
            });
            return;
        }

        const val = parseInt(value);
        if (isNaN(val) || val < 0) return;

        setEditedRecipe({
            ...editedRecipe,
            content: { 
                ...editedRecipe.content,
                nutrients: { ...editedRecipe.content.nutrients, [field]: val } 
            }
        });
    };

    // --- List Operations ---------------------
    const handleIngredientChange = (index: number, field: keyof Ingredient, value: string) => {
        if (!editedRecipe) return;

        const newIngredients = [...editedRecipe.content.ingredients];
        let finalValue: number | string = value;
        
        if (field === "amount") {
            const parsed = parseFloat(value);
            if (value !== "" && (isNaN(parsed) || parsed < 0)) return;
            finalValue = value === "" ? "" : parsed;
        }

        newIngredients[index] = { ...newIngredients[index], [field]: finalValue };
        setEditedRecipe({
            ...editedRecipe,
            content: { ...editedRecipe.content, ingredients: newIngredients }
        });
    };

    const addIngredient = () => {
        if (!editedRecipe) return;

        setEditedRecipe({
            ...editedRecipe,
            content: { 
                ...editedRecipe.content, 
                ingredients: [...editedRecipe.content.ingredients, { name: "", amount: 1, unit: "" }] 
            }
        });
    };

    const deleteIngredient = (indexToDelete: number) => {
        if (!editedRecipe) return;

        const newIngredients = editedRecipe.content.ingredients.filter((_, index) => index !== indexToDelete);
        setEditedRecipe({
            ...editedRecipe,
            content: { ...editedRecipe.content, ingredients: newIngredients }
        });
    };

    const handleStepChange = (index: number, newText: string) => {
        if (!editedRecipe) return;
        if (newText.length > 2000) return; 

        const newSteps = [...editedRecipe.content.steps];
        newSteps[index] = newText;
        setEditedRecipe({ ...editedRecipe, content: { ...editedRecipe.content, steps: newSteps } });
    };

    const addStep = () => {
        if (!editedRecipe) return;

        setEditedRecipe({
            ...editedRecipe,
            content: { ...editedRecipe.content, steps: [...editedRecipe.content.steps, ""] }
        });
    };

    const deleteStep = (indexToDelete: number) => {
        if (!editedRecipe) return;

        const newSteps = editedRecipe.content.steps.filter((_, index) => index !== indexToDelete);
        setEditedRecipe({ ...editedRecipe, content: { ...editedRecipe.content, steps: newSteps } });
    };

    return {
        recipe,
        editedRecipe,
        setEditedRecipe,
        isLoading,
        isEditing,
        currentServings,
        calculateAmount,
        handleSave,
        updateServings,
        updateCookingTime,
        updateNutrients,
        handleIngredientChange,
        handleStepChange,
        deleteStep,
        addStep,
        deleteIngredient,
        addIngredient,
        deleteRecipe,
        toggleEditMode
    };
}