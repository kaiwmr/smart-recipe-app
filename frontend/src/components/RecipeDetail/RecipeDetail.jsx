import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import styles from './RecipeDetail.module.css'
import { ChevronLeft, Trash2, Edit2, Save, X } from 'lucide-react'

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
                const response = await axios.get(`http://127.0.0.1:8000/recipes/${id}`, {
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
                `http://127.0.0.1:8000/recipes/${id}`, 
                payload, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            setRecipe(response.data); // Das echte Rezept mit den neuen Daten vom Server updaten
            setIsEditing(false);      // Edit-Modus beenden
            toast.success("Gespeichert!");
        } catch (error) {
            console.error("Fehler beim Speichern:", error);
            toast.error("Fehler beim Speichern");
        }
    };

    // Funktion, um einen einzelnen Schritt zu ändern
    const handleStepChange = (index, newText) => {
        // 1. Wir machen eine tiefe Kopie des Steps-Arrays
        const newSteps = [...editedRecipe.content.steps];
        // 2. Wir ändern den Text an der Stelle 'index'
        newSteps[index] = newText;
        
        // 3. Wir setzen den State neu.
        // Achtung: Wir müssen die verschachtelte Struktur beibehalten!
        setEditedRecipe({
            ...editedRecipe, // Behalte Titel, URL etc.
            content: {
                ...editedRecipe.content, // Behalte Ingredients
                steps: newSteps // Überschreibe Steps mit der neuen Liste
            }
        });
    };

    const deleteStep = (indexToDelete) => {
        // Wir behalten alle Zutaten, deren Index NICHT der zu löschende ist
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
        // 1. Tiefe Kopie der Zutaten-Liste
        const newIngredients = [...editedRecipe.content.ingredients];
        
        // 2. Das spezifische Objekt kopieren und das eine Feld ändern
        // Syntax: { ...altesObjekt, [feldName]: neuerWert }
        newIngredients[index] = { 
            ...newIngredients[index], 
            [field]: value 
        };

        // 3. Den ganzen State updaten (wie bei den Steps)
        setEditedRecipe({
            ...editedRecipe,
            content: {...editedRecipe.content, ingredients: newIngredients}
        });
    };

    const deleteIngredient = (indexToDelete) => {
        // Wir behalten alle Zutaten, deren Index NICHT der zu löschende ist
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
            await axios.delete(`http://127.0.0.1:8000/recipes/${recipeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success("Rezept gelöscht");
            navigate("/dashboard");
        } catch (error) {
            console.error("Fehler beim Löschen: ", error);
            toast.error("Fehler aufgetreten");
        }
    };

    if (isLoading || !recipe) return <p>Lade Rezept...</p>; // abändern mit Ladesymbol
    if (!recipe || !editedRecipe) return <p>Lade Rezept...</p>; // abändern mit Ladesymbol

    return (
        <div>
            <div className={styles.detail__pictureWrapper}>
                <img
                    className={styles.detail__picture}
                    src={`data:image/png;base64,${recipe.image}`}
                    alt={recipe.title}
                />
                
                {/* Zurück Button */}
                <div className={styles.detail__btnBack} onClick={() => navigate("/dashboard")}>
                    <ChevronLeft size={24} />
                </div>

                {/* Steuerungselemente oben rechts */}
                <div className={styles.detail__actions}>
                    {!isEditing ? (
                        <button className={styles.btn__edit} onClick={() => setIsEditing(true)}>
                            <Edit2 size={24} />
                        </button>
                    ) : (
                        <div className={styles.edit__controls}>
                            <button className={styles.btn__save} onClick={handleSave}>
                                <Save size={24} />
                            </button>
                            <button className={styles.btn__cancel} onClick={() => setIsEditing(false)}>
                                <X size={24} />
                            </button>
                        </div>
                    )}
                    {!isEditing ? (
                        <button className={styles.detail__btnDelete} onClick={() => deleteRecipe(recipe.id)}>
                            <Trash2 size={24} />
                        </button>
                    ) : (
                        <></>
                    )}
                </div>
            </div>

            <div className="app">
                {/* Titel-Sektion */}
                <div className={styles.titleContainer}>
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={editedRecipe.title} 
                            onChange={(e) => setEditedRecipe({...editedRecipe, title: e.target.value})}
                            className={styles.edit__inputTitle}
                            autoFocus
                        />
                    ) : (
                        <h2 className={styles.detail__title}>{recipe.title}</h2>
                    )}
                </div>

                {/* Hauptinhalt Wrapper */}
                <div className={styles.wrapper}>
                    
                    {/* Zutaten */}
                    <div className={`${styles.section} ${styles["section--ingredients"]}`}>
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
                                <div className={styles.edit__ingredientsContainer}>
                                    {editedRecipe.content.ingredients.map((ing, index) => (
                                        <div key={index} className={styles.edit__ingredientRow}>
                                            <input
                                                type='number'
                                                placeholder="Menge"
                                                className={styles.edit__ingInputAmount}
                                                value={ing.amount || ""}
                                                onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                                            />
                                            <input
                                                type='text'
                                                placeholder="Einh."
                                                className={styles.edit__ingInputUnit}
                                                value={ing.unit}
                                                onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                            />
                                            <input
                                                type='text'
                                                placeholder="Zutat"
                                                className={styles.edit__ingInputName}
                                                value={ing.name}
                                                onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                            />
                                            <button className={styles.btn__deleteSmall} onClick={() => deleteIngredient(index)}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                    <button className={styles.btn__addIngredient} onClick={addIngredient}>
                                        + Zutat hinzufügen
                                    </button>
                                </div>
                            )}
                    </div>

                    {/* Zubereitung */}
                    <div className={`${styles.section} ${styles["section--steps"]}`}>
                        <h3 className={styles.detail__ingredientsTitle}>Zubereitung</h3> 
                        
                        <div className={styles.stepsContainer}>
                            {(isEditing ? editedRecipe.content.steps : recipe.content.steps).map((step, index) => (
                                <div key={index} className={styles.stepRow}>
                                    {/* Der Kreis mit der Nummer für beide Modi */}
                                    <span className={styles.stepNumber}>{index + 1}</span>
                                    
                                    {isEditing ? (
                                        <div className={styles.stepEditWrapper}>
                                            <textarea 
                                                value={step}
                                                onChange={(e) => handleStepChange(index, e.target.value)}
                                                rows={3}
                                                className={styles.edit__textarea}
                                            />
                                            {/* Style angepasst und Icon verwendet */}
                                            <button className={styles.btn__deleteSmall} onClick={() => deleteStep(index)}>
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <p className={styles.detail__stepsItemText}>{step}</p>
                                    )}
                                </div>
                            ))}
                            {/* Neuer Style angewendet */}
                            {isEditing ? (
                                <button className={styles.btn__addStep} onClick={addStep}>
                                    + Schritt hinzufügen
                                </button>
                            ) : <></>}
                        </div>
                    </div>
                </div>

                <a href={recipe.url} target="_blank" rel="noreferrer" className={styles.detail__link}>
                    Original Link
                </a>
            </div>
        </div>
    );
}