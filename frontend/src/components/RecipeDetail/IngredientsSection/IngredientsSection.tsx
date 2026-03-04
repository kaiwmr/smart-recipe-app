import { Minus, Plus, X } from 'lucide-react';
import styles from './IngredientsSection.module.css';

import { Recipe, Ingredient } from '../../../types';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface IngredientsSectionProps {
    recipe: Recipe;
    isEditing: boolean;
    editedRecipe: Recipe;
    updateServings: (value: string) => void;
    calculateAmount: (baseAmount: number) => number | string;
    handleIngredientChange: (index: number, field: keyof Ingredient, value: string) => void;
    deleteIngredient: (indexToDelete: number) => void;
    currentServings: number;
    addIngredient: () => void;
}

export default function IngredientsSection({
  recipe,
  isEditing,
  editedRecipe,
  updateServings,
  calculateAmount,
  handleIngredientChange,
  deleteIngredient,
  currentServings,
  addIngredient
}: IngredientsSectionProps){
    
    // ==========================================
    // 2. RENDERING
    // ==========================================
    return(
        <div className={styles["detail__section--ingredients"]}>
                            
            {/* --- HEADER-ZEILE: Titel & Portions-Steuerung --- */}
            <div className={styles.detail__ingredientsHeaderRow}>
                <h3 className={styles.detail__ingredientsTitle}>Zutaten</h3>
                
                <div className={styles.detail__servingsWrapper}>
                    {!isEditing ? (
                        /* MODUS: ANSICHT (Portionen anpassen für Umrechnung) */
                        <div className={styles.detail__servingsControl}>
                            <button 
                                className={styles.detail__btnServing} 
                                onClick={() => updateServings(String(currentServings - 1))}
                                disabled={currentServings <= 1}
                            >
                                <Minus size={14} />
                            </button>
                            <span className={styles.detail__servingsText}>
                                <strong>{currentServings}</strong> Portionen
                            </span>
                            <button 
                                className={styles.detail__btnServing} 
                                onClick={() => updateServings(String(currentServings + 1))}
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                    ) : (
                        /* MODUS: BEARBEITEN (Basis-Portionszahl des Rezepts ändern) */
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

            {/* --- HAUPTBEREICH: Zutaten-Liste --- */}
            {!isEditing ? (
                /* MODUS: ANSICHT ( Mengen & Namen) */
                <ul className={styles.detail__ingredientsList}>
                    {recipe.content.ingredients.map((ing, index) => (
                        <li className={styles.detail__ingredientsItem} key={index}>
                            <p className={styles.detail__ingredientsBox}>
                                {ing.amount 
                                    ? `${calculateAmount(ing.amount)} ${ing.unit}` 
                                    : (ing.unit || "-")
                                }
                            </p>
                            <span>{ing.name}</span>
                        </li>
                    ))}
                </ul>
                ) : (
                    /* MODUS: BEARBEITEN (Input-Felder für jede Zutat) */
                    <div className={styles.detail__editIngredientsContainer}>
                        {editedRecipe.content.ingredients.map((ing, index) => (
                            <div key={index} className={styles.detail__editIngredientRow}>
                                {/* Menge */}
                                <input
                                    type='number'
                                    placeholder="Menge"
                                    className={styles.detail__editIngInputAmount}
                                    value={ing.amount ?? ""}
                                    onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                                />
                                {/* Einheit */}
                                <input
                                    type='text'
                                    placeholder="Einh."
                                    className={styles.detail__editIngInputUnit}
                                    value={ing.unit ?? ""}
                                    onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                                />
                                {/* Name der Zutat */}
                                <input
                                    type='text'
                                    placeholder="Zutat"
                                    className={styles.detail__editIngInputName}
                                    value={ing.name}
                                    onChange={(e) => handleIngredientChange(index, "name", e.target.value)}
                                />
                                {/* Zutat entfernen */}
                                <button className={styles.detail__btnDeleteSmall} onClick={() => deleteIngredient(index)}>
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                        
                        {/* Neue Zutat hinzufügen */}
                        <button className={styles.detail__btnAddIngredient} onClick={addIngredient}>
                            + Zutat hinzufügen
                        </button>
                    </div>
                )}
        </div>
    );
}