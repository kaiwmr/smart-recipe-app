import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './RecipeDetail.module.css'
import { ChevronLeft, Trash2, Edit2, Save, X, Loader2 } from 'lucide-react'

export default function RecipeDetail() {
    const { id } = useParams(); // Holt die "5" aus der URL /recipe/5
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editedRecipe, setEditedRecipe] = useState(null);

    useEffect(() => {
        const fetchRecipe = async () => {
            // 1. Token aus dem Speicher holen
            const token = localStorage.getItem("BiteWiseToken");
            
            // 2. Request mit Authorization Header senden
            // axios.get(url, config)
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}` // WICHTIG: Das Leerzeichen nach Bearer!
                    }
                });
                // 3. Die geladenen Rezepte in den State packen
                setRecipe(response.data);
                setEditedRecipe(response.data)
            } catch (error) {
                console.error("Fehler:", error);
                alert("Rezept nicht gefunden?");
                navigate("/dashboard");
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipe();
    }, [id, navigate]);

    const handleSave = async () => {
        const token = localStorage.getItem("BiteWiseToken");

        try{
            const payload = {
                title: editedRecipe.title, 
                content: editedRecipe.content, 
                url: editedRecipe.url,
                image: editedRecipe.image
            }

            const response = await axios.put(
                `${import.meta.env.VITE_API_URL}/recipes/${id}`, 
                payload, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setRecipe(response.data); // Das echte Rezept mit den neuen Daten vom Server updaten
            setIsEditing(false);      
            toast.success("Gespeichert!");
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            toast.error("Fehler beim Speichern");
        }
    };

    // Funktion, um einen einzelnen Schritt zu ändern
    const handleStepChange = (index, newText) => {
        // 1. Kopie des Steps Arrays
        const newSteps = [...editedRecipe.content.steps];
        // 2. Wert an der stelle "index" ändern
        newSteps[index] = newText;
        
        // 3. State neu setzen.
        setEditedRecipe({
            ...editedRecipe, // Behalte Titel, URL etc.
            content: {
                ...editedRecipe.content, // Behalte Ingredients
                steps: newSteps // Überschreibe Steps mit der neuen Liste
            }
        });
    };

    const deleteStep = (indexToDelete) => {
        // alle Zutaten behalten, deren Index nicht der zu löschende ist
        const newSteps = editedRecipe.content.steps.filter((_, index) => index !== indexToDelete);

        setEditedRecipe({
            ...editedRecipe,
            content: {...editedRecipe.content, steps: newSteps }
        });
    };

    const addStep = () => {
        const newStep = "";
        
        // Alte Liste nehmen + neues Element
        const newSteps = [...editedRecipe.content.steps, newStep];

        setEditedRecipe({
            ...editedRecipe,
            content: { ...editedRecipe.content, steps: newSteps }
        });
    };

    const handleIngredientChange = (index, field, value) => {
        // 1. Kopie des Zutaten Arrays
        const newIngredients = [...editedRecipe.content.ingredients];
        
        // 2. Objekt kopieren und das eine Feld ändern
        newIngredients[index] = { 
            ...newIngredients[index], 
            [field]: value 
        };

        // 3. State updaten
        setEditedRecipe({
            ...editedRecipe,
            content: {...editedRecipe.content, ingredients: newIngredients}
        });
    };

    const deleteIngredient = (indexToDelete) => {
        // alle Zutaten behalten, deren Index nicht der zu löschende ist
        const newIngredients = editedRecipe.content.ingredients.filter((_, index) => index !== indexToDelete);

        setEditedRecipe({
            ...editedRecipe,
            content: {...editedRecipe.content, ingredients: newIngredients }
        });
    };

    const addIngredient = () => {
        const newIngredient = { name: "", amount: 1, unit: "" };
        
        // Alte Liste nehmen + neues Element
        const newIngredients = [...editedRecipe.content.ingredients, newIngredient];

        setEditedRecipe({
            ...editedRecipe,
            content: { ...editedRecipe.content, ingredients: newIngredients }
        });
    };

    const deleteRecipe = async (recipeId) => {
        if (!window.confirm("Wirklich löschen?")) return;
        const token = localStorage.getItem("BiteWiseToken");
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/recipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Rezept gelöscht");
            navigate("/dashboard");
        } catch (error) {
            console.error("Fehler beim Löschen: ", error);
            toast.error("Fehler aufgetreten");
        }
    };

    if (isLoading || !recipe) return <Loader2 className={styles.detail__loadingIcon}></Loader2>; 
    if (!recipe || !editedRecipe) return <Loader2 className={styles.detail__loadingIcon}></Loader2>; 
    

    return (
        <div>
            <div className={styles.detail__pictureWrapper}>
                <img
                    className={styles.detail__picture}
                    src={`data:image/png;base64,${recipe.image}`}
                    alt={recipe.title}
                />
                
                {/* Zurück Button */}
                <button className={styles.detail__btnBack} onClick={() => navigate("/dashboard")}>
                    <ChevronLeft size={24} />
                </button>

                {/* Steuerungselemente oben rechts */}
                <div className={styles.detail__actions}>
                    {!isEditing ? (
                        <>
                            <button className={styles.detail__btnEdit} onClick={() => setIsEditing(true)}>
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
                            <button className={styles.detail__btnCancel} onClick={() => setIsEditing(false)}>
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

                {/* Hauptinhalt Wrapper */}
                <div className={styles.detail__wrapper}>
                    <div className={styles.detail__leftWrapper}>
                        <div className={styles["detail__section--nutrients"]}>
                            <div className={styles.detail__nutrientsHeader}>
                                <h3 className={styles.detail__ingredientsTitle}>Nährwerte</h3>
                                <span className={styles.detail__nutrientsProPortion}>pro Portion</span>
                            </div>
                            
                            <div className={styles.detail__nutrientsGrid}>
                                
                                {/* Kalorien */}
                                <div className={`${styles.detail__nutrientsCard} ${styles["detail__nutrientsCard--cal"]}`}>
                                    <div className={styles.detail__nutrientsData}>
                                        <span className={styles.detail__nutrientsValue}>
                                            {Math.floor(recipe.content.nutrients.kcal / (recipe.content.servings || 1))}
                                        </span>
                                        <span className={styles.detail__nutrientsUnit}>kcal</span>
                                    </div>
                                    <span className={styles.detail__nutrientsLabel}>Kalorien</span>
                                </div>

                                {/* Protein */}
                                <div className={`${styles.detail__nutrientsCard} ${styles["detail__nutrientsCard--protein"]}`}>
                                    <div className={styles.detail__nutrientsData}>
                                        <span className={styles.detail__nutrientsValue}>
                                            {Math.floor(recipe.content.nutrients.protein / (recipe.content.servings || 1))}
                                        </span>
                                        <span className={styles.detail__nutrientsUnit}>g</span>
                                    </div>
                                    <span className={styles.detail__nutrientsLabel}>Protein</span>
                                </div>

                                {/* Kohlenhydrate (Carbs) */}
                                <div className={`${styles.detail__nutrientsCard} ${styles["detail__nutrientsCard--carbs"]}`}>
                                    <div className={styles.detail__nutrientsData}>
                                        <span className={styles.detail__nutrientsValue}>
                                            {Math.floor(recipe.content.nutrients.carbs / (recipe.content.servings || 1))}
                                        </span>
                                        <span className={styles.detail__nutrientsUnit}>g</span>
                                    </div>
                                    <span className={styles.detail__nutrientsLabel}>Carbs</span>
                                </div>

                                {/* Fett */}
                                <div className={`${styles.detail__nutrientsCard} ${styles["detail__nutrientsCard--fat"]}`}>
                                    <div className={styles.detail__nutrientsData}>
                                        <span className={styles.detail__nutrientsValue}>
                                            {Math.floor(recipe.content.nutrients.fat / (recipe.content.servings || 1))}
                                        </span>
                                        <span className={styles.detail__nutrientsUnit}>g</span>
                                    </div>
                                    <span className={styles.detail__nutrientsLabel}>Fett</span>
                                </div>

                            </div>
                        </div>
                        
                        {/* Zutaten */}
                        <div className={styles["detail__section--ingredients"]}>
                            <h3 className={styles.detail__ingredientsTitle}>Zutaten</h3>
                            {!isEditing ? (
                                <ul className={styles.detail__ingredientsList}>
                                    {recipe.content.ingredients.map((ing, index) => (
                                        <li className={styles.detail__ingredientsItem} key={index}>
                                            <p className={styles.detail__ingredientsBox}>
                                                {ing.amount || ing.unit ? ing.amount : "-"} {ing.unit ? ing.unit : ""}
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
                        <h3 className={styles.detail__ingredientsTitle}>Zubereitung</h3> 
                        
                        <div className={styles.detail__stepsContainer}>
                            {(isEditing ? editedRecipe.content.steps : recipe.content.steps).map((step, index) => (
                                <div key={index} className={styles.detail__stepRow}>
                                    {/* Der Kreis mit der Nummer für beide Modi */}
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
                            {isEditing ? (
                                <button className={styles.detail__btnAddStep} onClick={addStep}>
                                    + Schritt hinzufügen
                                </button>
                            ) : <></>}
                        </div>
                    </div>
                </div>

                {/* Original-Link */}
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