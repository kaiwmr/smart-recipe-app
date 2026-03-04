import { Clock, X } from "lucide-react";
import styles from "./StepsSection.module.css";

import { Recipe } from "../../../types";

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface StepsSectionProps {
    isEditing: boolean;
    recipe: Recipe;
    editedRecipe: Recipe;
    updateCookingTime: (value: string) => void;
    handleStepChange: (index: number, newText: string) => void;
    deleteStep: (indexToDelete: number) => void;
    addStep: () => void;
}

export default function StepsSection({
    isEditing, 
    recipe, 
    editedRecipe, 
    updateCookingTime, 
    handleStepChange, 
    deleteStep, 
    addStep
}: StepsSectionProps) {

    // ==========================================
    // 2. RENDERING
    // ==========================================
    return(
        <div className={styles["detail__section--steps"]}>
            
            {/* --- HEADER-ZEILE: Titel & Zubereitungszeit --- */}
            <div className={styles.detail__ingredientsHeaderRow}>
                <h3 className={styles.detail__ingredientsTitle}>Zubereitung</h3>
                    
                <div className={styles.detail__timeWrapper}>
                    <Clock size={16} className={styles.detail__timeIcon} />
                    
                    {isEditing ? (
                        /* MODUS: BEARBEITEN (Eingabe in Minuten) */
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
                        /* MODUS: ANSICHT (Automatisierte Umrechnung in Stunden ab 60 Min) */
                        <span className={styles.detail__timeText}>
                            {Number(recipe.content.cooking_time) >= 60
                                    ? (<><strong> {Math.round(Number(recipe.content.cooking_time) / 30) / 2} </strong> Stunden</>)
                                    : <><strong>{recipe.content.cooking_time}</strong> Minuten </>}
                        </span>
                    )}
                </div>
            </div>
            
            {/* --- HAUPTBEREICH: Liste der Schritte --- */}
            <div className={styles.detail__stepsContainer}>
                {(isEditing ? editedRecipe.content.steps : recipe.content.steps).map((step, index) => (
                    <div key={index} className={styles.detail__stepRow}>
                        {/* Nummerierung der Schritte */}
                        <span className={styles.detail__stepNumber}>{index + 1}</span>
                        
                        {isEditing ? (
                            /* MODUS: BEARBEITEN (Textarea für längere Beschreibungen) */
                            <div className={styles.detail__stepEditWrapper}>
                                <textarea 
                                    value={step}
                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                    rows={3}
                                    className={styles.detail__editTextarea}
                                />
                                <button 
                                    className={styles.detail__btnDeleteSmall} 
                                    onClick={() => deleteStep(index)}
                                    title="Schritt löschen"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            /* MODUS: ANSICHT (Reiner Text) */
                            <p className={styles.detail__stepsItemText}>{step}</p>
                        )}
                    </div>
                ))}

                {/* Button zum Hinzufügen (nur im Editmodus sichtbar) */}
                {isEditing && (
                    <button className={styles.detail__btnAddStep} onClick={addStep}>
                        + Schritt hinzufügen
                    </button>
                )}
            </div>
        </div>
    );
}