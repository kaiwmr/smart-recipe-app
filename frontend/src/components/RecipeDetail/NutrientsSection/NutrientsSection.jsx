import styles from './NutrientsSection.module.css';

export default function NutrientsSection( {editedRecipe, isEditing, recipe, updateNutrients} ) {

    return(
        <div className={styles["detail__section--nutrients"]}>
            <div className={styles.detail__nutrientsHeader}>
                <h3 className={styles.detail__ingredientsTitle}>Nährwerte</h3>
                <span className={styles.detail__nutrientsProPortion}>pro Portion</span>
            </div>
            
            <div className={styles.detail__nutrientsGrid}>

                {/* ------------ Kalorien ------------ */}
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

                {/* ------------ Protein ------------ */}
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

                {/* ------------ Carbs ------------ */}
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

                {/* ------------ Fett ------------ */}
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
    );

}