import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './RecipeDetail.module.css';
import { X, Loader2, Minus, Plus, Clock } from 'lucide-react';
import api from '../../api/api';
import ImageSection from './ImageSection/ImageSection';
import TitleSection from './TitleSection/TitleSection';
import NutrientsSection from './NutrientsSection/NutrientsSection';
import IngredientsSection from './IngredientsSection/IngredientsSection';
import StepsSection from './StepsSection/StepsSection';

export default function RecipeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedRecipe, setEditedRecipe] = useState(null);
    const [currentServings, setCurrentServings] = useState(1); 

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await api.get(`recipes/${id}`);
                
                const data = response.data;
                setRecipe(data);
                setEditedRecipe(data);
                setCurrentServings(data.content.servings || 1); 

            } catch (error) {
                console.error("Fehler:", error);
                toast.error("Rezept konnte nicht geladen werden.");
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipe();
    }, [id, navigate]);

    const calculateAmount = (baseAmount) => {
        if (!baseAmount) return "";
        const baseServings = recipe.content.servings || 1; // Schutz vor Division durch 0
        const result = (baseAmount / baseServings) * currentServings;
        
        // Runden auf max 2 Stellen
        return parseFloat(result.toFixed(2));
    };

    const handleSave = async () => {
        // 1. Validierungsprozess
        if (!editedRecipe.title.trim()) {
            toast.error("Das Rezept braucht einen Titel.");
            return;
        }

        if (editedRecipe.content.ingredients.length === 0) {
            toast.error("Das Rezept muss Zutaten beinhalten.");
            return;
        }

        if (editedRecipe.content.steps.length === 0) {
            toast.error("Das Rezept muss Zubereitungsschritte beinhalten.");
            return;
        }

        const hasInvalidIngredient = editedRecipe.content.ingredients.some(ing => !ing.name.trim());
        if (hasInvalidIngredient) {
            toast.error("Alle Zutaten müssen einen Namen haben.");
            return;
        }

        const cookingTime = parseInt(editedRecipe.content.cooking_time);
        if (isNaN(cookingTime) || cookingTime <= 0) {
            toast.error("Ungültige Zubereitungszeit.");
            return;
        }

        for (const key in editedRecipe.content.nutrients) {
            const value = editedRecipe.content.nutrients[key];
            const parsedValue = parseInt(value);

            if (value === "" || isNaN(parsedValue)) {
                toast.error(`Bitte gib einen Wert für ${key} ein.`);
                return;
            }
            if (parsedValue < 0) {
                toast.error(`${key} darf nicht negativ sein.`);
                return;
            }
        }

        const servings = parseInt(editedRecipe.content.servings);
        if (isNaN(servings) || servings <= 0) {
            toast.error("Ungültige Portionsanzahl.");
            return;
        }
        try {
            const payload = {
                title: editedRecipe.title,
                content: editedRecipe.content,
                url: editedRecipe.url,
                image: editedRecipe.image
            };

            const response = await api.put(`/recipes/${id}`,payload);

            setRecipe(response.data);
            setCurrentServings(response.data.content.servings || 1);
            setIsEditing(false);
            toast.success("Gespeichert!");
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            toast.error("Fehler beim Speichern");
        }
    };

    // --- Servings Logic ---
    const updateServings = (value) => {
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

    const updateCookingTime = (value) => {
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

    const updateNutrients = (value, field) => {
        if (value === "") {
            setEditedRecipe({
                ...editedRecipe,
                content: { 
                    ...editedRecipe.content,
                    nutrients: {
                        ...editedRecipe.content.nutrients, 
                        [field]: "" 
                    } 
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
                nutrients: {
                    ...editedRecipe.content.nutrients, 
                    [field]: val 
                } 
            }
        });
    };

    const handleIngredientChange = (index, field, value) => {
        const newIngredients = [...editedRecipe.content.ingredients];
        
        let finalValue = value;
        
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
    
    const handleStepChange = (index, newText) => {
        if (newText.length > 2000) return; 

        const newSteps = [...editedRecipe.content.steps];
        newSteps[index] = newText;
        setEditedRecipe({ ...editedRecipe, content: { ...editedRecipe.content, steps: newSteps } });
    };

    const deleteStep = (indexToDelete) => {
        const newSteps = editedRecipe.content.steps.filter((_, index) => index !== indexToDelete);
        setEditedRecipe({ ...editedRecipe, content: { ...editedRecipe.content, steps: newSteps } });
    };

    const addStep = () => {
        setEditedRecipe({
            ...editedRecipe,
            content: { ...editedRecipe.content, steps: [...editedRecipe.content.steps, ""] }
        });
    };

    const deleteIngredient = (indexToDelete) => {
        const newIngredients = editedRecipe.content.ingredients.filter((_, index) => index !== indexToDelete);
        setEditedRecipe({
            ...editedRecipe,
            content: { ...editedRecipe.content, ingredients: newIngredients }
        });
    };

    const addIngredient = () => {
        setEditedRecipe({
            ...editedRecipe,
            content: { 
                ...editedRecipe.content, 
                ingredients: [...editedRecipe.content.ingredients, { name: "", amount: 1, unit: "" }] 
            }
        });
    };

    const deleteRecipe = async (recipeId) => {
        if (!window.confirm("Wirklich löschen?")) return;
        try {
            await api.delete(`/recipes/${recipeId}`);
            toast.success("Rezept gelöscht");
            navigate("/dashboard");
        } catch (error) {
            toast.error("Fehler aufgetreten");
        }
    };

    const toggleEditMode = (status) => {
        if (status === true) {
            setEditedRecipe({
                ...recipe,
                content: { ...recipe.content, servings: currentServings }
            });
        }
        setIsEditing(status);
    };


    if (isLoading || !recipe) return <Loader2 className={styles.detail__loadingIcon}></Loader2>;

    return (
        <div >
            <ImageSection
            recipe={recipe}
            toggleEditMode={toggleEditMode}
            deleteRecipe={deleteRecipe}
            isEditing={isEditing}
            handleSave={handleSave}
            ></ImageSection>

            <div className="app">
                <TitleSection
                recipe={recipe}
                isEditing={isEditing}
                editedRecipe={editedRecipe}
                setEditedRecipe={setEditedRecipe}
                ></TitleSection>

                <div className={styles.detail__wrapper}>
                    <div className={styles.detail__leftWrapper}>
                        
                        {/* Nährwerte */}
                        <NutrientsSection
                        editedRecipe={editedRecipe}
                        isEditing={isEditing}
                        recipe={recipe}
                        updateNutrients={updateNutrients}>
                        </NutrientsSection>
                        
                        {/* Zutaten & Portionen */}
                        <IngredientsSection
                        recipe={recipe}
                        isEditing={isEditing}
                        editedRecipe={editedRecipe}
                        updateServings={updateServings}
                        calculateAmount={calculateAmount}
                        handleIngredientChange={handleIngredientChange}
                        deleteIngredient={deleteIngredient}
                        currentServings={currentServings}
                        addIngredient={addIngredient}>
                        </IngredientsSection>

                    </div>

                    {/* Zubereitung */}
                    <StepsSection
                    isEditing={isEditing}
                    recipe={recipe}
                    editedRecipe={editedRecipe}
                    updateCookingTime={updateCookingTime}
                    handleStepChange={handleStepChange}
                    deleteStep={deleteStep}
                    addStep={addStep}>
                    </StepsSection>
    
                </div>

                {recipe.url && (
                    <div className={styles.detail__sourceContainer}>
                        <a href={recipe.url} target="_blank" rel="noreferrer" className={styles.detail__btnSource}>
                            Zum Originalrezept <span className={styles.detail__sourceArrow}>↗</span>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}