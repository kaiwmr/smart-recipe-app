import styles from './NutrientsSection.module.css';
import { Recipe, Nutrients } from '../../../types';

interface NutrientsSectionProps {
    editedRecipe: Recipe;
    isEditing: boolean;
    recipe: Recipe;
    updateNutrients: (value: string, field: keyof Nutrients) => void;
}

export default function NutrientsSection({ 
    editedRecipe, 
    isEditing, 
    recipe, 
    updateNutrients 
}: NutrientsSectionProps) {

    return(
        <div className={styles["detail__section--nutrients"]}>
            
            {/* --- Header & Context Mode -------------- */}
            <div className={styles.detail__nutrientsHeader}>
                <h3 className={styles.detail__nutrientsTitle}>Nährwerte</h3>
                {isEditing ? (
                    <span className={styles.detail__nutrientsProPortion}>Gesamt</span>
                ) : (
                    <span className={styles.detail__nutrientsProPortion}>pro Portion</span>
                )}
            </div>
            
            <div className={styles.detail__nutrientsGrid}>

                {/* kcal */}
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
                                {Math.floor(recipe.content.nutrients.kcal / (Number(recipe.content.servings) || 1))}
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
                                {Math.floor(recipe.content.nutrients.protein / (Number(recipe.content.servings) || 1))}
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
                                {Math.floor(recipe.content.nutrients.carbs / (Number(recipe.content.servings) || 1))}
                            </span>
                        )}
                        <span className={styles.detail__nutrientsUnit}>g</span>
                    </div>
                    <span className={styles.detail__nutrientsLabel}>Carbs</span>
                </div>

                {/* Fat */}
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
                                {Math.floor(recipe.content.nutrients.fat / (Number(recipe.content.servings) || 1))}
                            </span>
                        )}
                        <span className={styles.detail__nutrientsUnit}>g</span>
                    </div>
                    <span className={styles.detail__nutrientsLabel}>Fett</span>
                </div>

            </div>
        </div>
    );
}