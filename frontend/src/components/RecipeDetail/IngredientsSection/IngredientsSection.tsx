import { Minus, Plus, X } from 'lucide-react';
import styles from './IngredientsSection.module.css';
import { Recipe, Ingredient } from '../../../types';

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
    
    return(
        <div className={styles["detail__section--ingredients"]}>
                            
            {/* --- Header: Title & Servings Control ---- */}
            <div className={styles.detail__ingredientsHeaderRow}>
                <h3 className={styles.detail__ingredientsTitle}>Zutaten</h3>
                
                <div className={styles.detail__servingsWrapper}>
                    {!isEditing ? (
                        /* View Mode: Dynamic serving adjustment */
                        <div className={styles.detail__servingsControl}>
                            <button 
                                className={styles.detail__btnServing} 
                                onClick={() => updateServings(String(currentServings - 1))}
                                disabled={currentServings <= 1}
                            >
                                <     Minus size={14} />
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
                        /* Edit Mode: Base servings configuration */
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

            {/* --- Content: Ingredients List ----------- */}
            {!isEditing ? (
                /* View Mode: Dynamic amounts & names */
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
                    /* Edit Mode: Full list editor */
                    <div className={styles.detail__editIngredientsContainer}>
                        {editedRecipe.content.ingredients.map((ing, index) => (
                            <div key={index} className={styles.detail__editIngredientRow}>
                                <input
                                    type='number'
                                    placeholder="Menge"
                                    className={styles.detail__editIngInputAmount}
                                    value={ing.amount ?? ""}
                                    onChange={(e) => handleIngredientChange(index, "amount", e.target.value)}
                                />
                                <input
                                    type='text'
                                    placeholder="Einh."
                                    className={styles.detail__editIngInputUnit}
                                    value={ing.unit ?? ""}
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
    );
}