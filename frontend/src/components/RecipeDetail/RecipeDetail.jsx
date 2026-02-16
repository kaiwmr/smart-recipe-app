import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './RecipeDetail.module.css';
import { ChevronLeft, Trash2, Edit2, Save, X, Loader2, Minus, Plus, Clock } from 'lucide-react';
import api from '../../api/api';

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
        <div>
            <div className={styles.detail__pictureWrapper}>
                <img
                    className={styles.detail__picture}
                    src={`data:image/png;base64,${recipe.image}`}
                    alt={recipe.title}
                />
                
                <button className={styles.detail__btnBack} onClick={() => navigate("/dashboard")}>
                    <ChevronLeft size={24} />
                </button>

                <div className={styles.detail__actions}>
                    {!isEditing ? (
                        <>
                            <button className={styles.detail__btnEdit} onClick={() => toggleEditMode(true)}>
                                <Edit2 size={20} />
                            </button>
                            <button className={styles.detail__btnDelete} onClick={() => deleteRecipe(recipe.id)}>
                                <Trash2 size={20} />
                            </button>
                        </>
                    ) : (
                        <div className={styles.detail__editControls}>
                            <button className={styles.detail__btnSave} onClick={handleSave}>
                                <Save size={20} />
                            </button>
                            <button className={styles.detail__btnCancel} onClick={() => toggleEditMode(false)}>
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="app">
                {/* Titel-Sektion */}
                <div className={styles.detail__titleContainer}>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={editedRecipe.title} 
                            onChange={(e) => setEditedRecipe({...editedRecipe, title: e.target.value})}
                            className={styles.detail__editInputTitle}
                            autoFocus
                        />
                    ) : (
                        <>
                            <h2 className={styles.detail__title}>{recipe.title}</h2>
                            <div className={styles.detail__titleAccent}></div>
                        </>
                    )}
                </div>

                <div className={styles.detail__wrapper}>
                    <div className={styles.detail__leftWrapper}>
                        
                        {/* Nährwerte */}
                        <div className={styles["detail__section--nutrients"]}>
                            <div className={styles.detail__nutrientsHeader}>
                                <h3 className={styles.detail__ingredientsTitle}>Nährwerte</h3>
                                <span className={styles.detail__nutrientsProPortion}>pro Portion</span>
                            </div>
                            
                            <div className={styles.detail__nutrientsGrid}>
                                {/* Kalorien */}
                                <div className={`${styles.detail__nutrientsCard} ${styles["detail__nutrientsCard--cal"]}`}>
                                    <div className={styles.detail__nutrientsData}>
                                        {isEditing ? (
                                            <input 
                                                type="number"
                                                value={editedRecipe.content.nutrients.kcal}
                                                onChange={(e) => updateNutrients(e.target.value, "kcal")}
                                                className={styles.detail__nutrientsInput}
                                            />
                                        ) : (
                                            <span className={styles.detail__nutrientsValue}>
                                                {Math.floor(recipe.content.nutrients.kcal / (recipe.content.servings || 1))}
                                            </span>
                                        )}
                                        <span className={styles.detail__nutrientsUnit}>kcal</span>
                                    </div>
                                    <span className={styles.detail__nutrientsLabel}>Kalorien</span>
                                </div>
                                {/* Protein */}
                                <div className={`${styles.detail__nutrientsCard} ${styles["detail__nutrientsCard--protein"]}`}>
                                    <div className={styles.detail__nutrientsData}>
                                        {isEditing ? (
                                            <input 
                                                type="number"
                                                value={editedRecipe.content.nutrients.protein}
                                                onChange={(e) => updateNutrients(e.target.value, "protein")}
                                                className={styles.detail__nutrientsInput}
                                            />
                                        ) : (
                                            <span className={styles.detail__nutrientsValue}>
                                                {Math.floor(recipe.content.nutrients.protein / (recipe.content.servings || 1))}
                                            </span>
                                        )}
                                        <span className={styles.detail__nutrientsUnit}>g</span>
                                    </div>
                                    <span className={styles.detail__nutrientsLabel}>Protein</span>
                                </div>
                                {/* Carbs */}
                                <div className={`${styles.detail__nutrientsCard} ${styles["detail__nutrientsCard--carbs"]}`}>
                                    <div className={styles.detail__nutrientsData}>
                                        {isEditing ? (
                                            <input 
                                                type="number"
                                                value={editedRecipe.content.nutrients.carbs}
                                                onChange={(e) => updateNutrients(e.target.value, "carbs")}
                                                className={styles.detail__nutrientsInput}
                                            />
                                        ) : (
                                            <span className={styles.detail__nutrientsValue}>
                                                {Math.floor(recipe.content.nutrients.carbs / (recipe.content.servings || 1))}
                                            </span>
                                        )}
                                        <span className={styles.detail__nutrientsUnit}>g</span>
                                    </div>
                                    <span className={styles.detail__nutrientsLabel}>Carbs</span>
                                </div>
                                {/* Fett */}
                                <div className={`${styles.detail__nutrientsCard} ${styles["detail__nutrientsCard--fat"]}`}>
                                    <div className={styles.detail__nutrientsData}>
                                        {isEditing ? (
                                            <input 
                                                type="number"
                                                value={editedRecipe.content.nutrients.fat}
                                                onChange={(e) => updateNutrients(e.target.value, "fat")}
                                                className={styles.detail__nutrientsInput}
                                            />
                                        ) : (
                                            <span className={styles.detail__nutrientsValue}>
                                                {Math.floor(recipe.content.nutrients.fat / (recipe.content.servings || 1))}
                                            </span>
                                        )}
                                        <span className={styles.detail__nutrientsUnit}>g</span>
                                    </div>
                                    <span className={styles.detail__nutrientsLabel}>Fett</span>
                                </div>
                            </div>
                        </div>
                        
                        {/* Zutaten & Portionen */}
                        <div className={styles["detail__section--ingredients"]}>
                            
                            {/* Header Zeile: Titel Links, Portionen Rechts */}
                            <div className={styles.detail__ingredientsHeaderRow}>
                                <h3 className={styles.detail__ingredientsTitle}>Zutaten</h3>
                                
                                {/* Portionen Steuerung */}
                                <div className={styles.detail__servingsWrapper}>
                                    {!isEditing ? (
                                        <div className={styles.detail__servingsControl}>
                                            <button 
                                                className={styles.detail__btnServing} 
                                                onClick={() => updateServings(currentServings - 1)}
                                                disabled={currentServings <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className={styles.detail__servingsText}>
                                                <strong>{currentServings}</strong> Portionen
                                            </span>
                                            <button 
                                                className={styles.detail__btnServing} 
                                                onClick={() => updateServings(currentServings + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className={styles.detail__servingsEdit}>
                                            <input
                                                type='number'
                                                className={styles.detail__inputServings}
                                                value={editedRecipe.content.servings}
                                                onChange={(e) => updateServings(e.target.value)}
                                                min="1"
                                            />
                                            <span className={styles.detail__servingsLabel}>Portionen</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {!isEditing ? (
                                <ul className={styles.detail__ingredientsList}>
                                    {recipe.content.ingredients.map((ing, index) => (
                                        <li className={styles.detail__ingredientsItem} key={index}>
                                            <p className={styles.detail__ingredientsBox}>
                                                {ing.amount ? `${calculateAmount(ing.amount)} ${ing.unit}` : (ing.unit || "-")}
                                            </p>
                                            <span>{ing.name}</span>
                                        </li>
                                    ))}
                                </ul>
                                ) : (
                                    <div className={styles.detail__editIngredientsContainer}>
                                        {editedRecipe.content.ingredients.map((ing, index) => (
                                            <div key={index} className={styles.detail__editIngredientRow}>
                                                <input
                                                    type='number'
                                                    placeholder="Menge"
                                                    className={styles.detail__editIngInputAmount}
                                                    value={ing.amount || ""}
                                                    onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                                                />
                                                <input
                                                    type='text'
                                                    placeholder="Einh."
                                                    className={styles.detail__editIngInputUnit}
                                                    value={ing.unit}
                                                    onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                                />
                                                <input
                                                    type='text'
                                                    placeholder="Zutat"
                                                    className={styles.detail__editIngInputName}
                                                    value={ing.name}
                                                    onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                                />
                                                <button className={styles.detail__btnDeleteSmall} onClick={() => deleteIngredient(index)}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ))}
                                        <button className={styles.detail__btnAddIngredient} onClick={addIngredient}>
                                            + Zutat hinzufügen
                                        </button>
                                    </div>
                                )}
                        </div>
                    </div>

                    {/* Zubereitung */}
                    <div className={styles["detail__section--steps"]}>
                        <div className={styles.detail__ingredientsHeaderRow}>
                            <h3 className={styles.detail__ingredientsTitle}>Zubereitung</h3>
                             
                            {/* Zubereitungszeit */}
                            <div className={styles.detail__timeWrapper}>
                                <Clock size={16} className={styles.detail__timeIcon} />
                                {isEditing ? (
                                    <div className={styles.detail__timeEditMode}>
                                        <input 
                                            type="number" 
                                            value={editedRecipe.content.cooking_time}
                                            onChange={(e) => updateCookingTime(e.target.value)}
                                            className={styles.detail__timeInput}
                                            min="1"
                                        />
                                        <span className={styles.detail__timeText}>Minuten</span>
                                    </div>
                                ) : (
                                    <span className={styles.detail__timeText}>
                                        {recipe.content.cooking_time >= 60
                                                ? (<><strong> {Math.round(recipe.content.cooking_time / 30) / 2} </strong> Stunden</>)
                                                : <><strong>{recipe.content.cooking_time}</strong> Minuten </>}
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        <div className={styles.detail__stepsContainer}>
                            {(isEditing ? editedRecipe.content.steps : recipe.content.steps).map((step, index) => (
                                <div key={index} className={styles.detail__stepRow}>
                                    <span className={styles.detail__stepNumber}>{index + 1}</span>
                                    
                                    {isEditing ? (
                                        <div className={styles.detail__stepEditWrapper}>
                                            <textarea 
                                                value={step}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                                rows={3}
                                                className={styles.detail__editTextarea}
                                            />
                                            <button className={styles.detail__btnDeleteSmall} onClick={() => deleteStep(index)}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className={styles.detail__stepsItemText}>{step}</p>
                                    )}
                                </div>
                            ))}
                            {isEditing && (
                                <button className={styles.detail__btnAddStep} onClick={addStep}>
                                    + Schritt hinzufügen
                                </button>
                            )}
                        </div>
                    </div>
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