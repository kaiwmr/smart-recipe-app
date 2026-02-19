import { Clock, X } from "lucide-react";
import styles from "./StepsSection.module.css";

export default function StepsSection( {isEditing, recipe, editedRecipe, updateCookingTime, handleStepChange, deleteStep, addStep} ) {
    return(
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
    );
}


