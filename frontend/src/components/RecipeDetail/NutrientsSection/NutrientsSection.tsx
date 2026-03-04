import styles from './NutrientsSection.module.css';
import { Recipe, Nutrients } from '../../../types';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface NutrientsSectionProps {
    editedRecipe: Recipe;   // Der aktuelle Bearbeitungszustand
    isEditing: boolean;     // Status, ob wir uns im Editiermodus befinden
    recipe: Recipe;         // Die ursprünglichen Rezeptdaten aus der DB
    updateNutrients: (value: string, field: keyof Nutrients) => void; // Handler für Änderungen
}

export default function NutrientsSection({ 
    editedRecipe, 
    isEditing, 
    recipe, 
    updateNutrients 
}: NutrientsSectionProps) {

    // ==========================================
    // 2. RENDERING
    // ==========================================
    return(
        <div className={styles["detail__section--nutrients"]}>
            
            {/* --- HEADER: Titel & Anzeige-Modus --- */}
            <div className={styles.detail__nutrientsHeader}>
                <h3 className={styles.detail__nutrientsTitle}>Nährwerte</h3>
                {isEditing ? (
                    /* Im Edit-Modus bearbeiten die Werte für das gesamte Rezept */
                    <span className={styles.detail__nutrientsProPortion}>Gesamt</span>
                ) : (
                    /* In der Ansicht rechnen wir die Werte auf eine Portion herunter */
                    <span className={styles.detail__nutrientsProPortion}>pro Portion</span>
                )}
            </div>
            
            <div className={styles.detail__nutrientsGrid}>

                {/* ------------ KALORIEN (kcal) ------------ */}
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
                                {/* Berechnung: Gesamtkalorien / Portionsanzahl */}
                                {Math.floor(recipe.content.nutrients.kcal / (Number(recipe.content.servings) || 1))}
                            </span>
                        )}
                        <span className={styles.detail__nutrientsUnit}>kcal</span>
                    </div>
                    <span className={styles.detail__nutrientsLabel}>Kalorien</span>
                </div>

                {/* ------------ PROTEIN (g) ------------ */}
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

                {/* ------------ KOHLENHYDRATE (Carbs, g) ------------ */}
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

                {/* ------------ FETT (g) ------------ */}
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