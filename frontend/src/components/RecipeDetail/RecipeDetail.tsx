import { useParams } from 'react-router-dom';
import styles from './RecipeDetail.module.css';
import { Loader2 } from 'lucide-react';

// ==========================================
// CHILD COMPONENTS
// ==========================================
import ImageSection from './ImageSection/ImageSection';
import TitleSection from './TitleSection/TitleSection';
import NutrientsSection from './NutrientsSection/NutrientsSection';
import IngredientsSection from './IngredientsSection/IngredientsSection';
import StepsSection from './StepsSection/StepsSection';

// ==========================================
// CUSTOM HOOK
// ==========================================
import useRecipeEditor from './useRecipeEditor';

export default function RecipeDetail() {
    // 1. URL-Parameter auslesen
    const { id } = useParams();
    
    // 2. Custom Hook aufrufen, der alle Daten und Funktionen bereitstellt
    const { 
        recipe, editedRecipe, setEditedRecipe, isLoading, isEditing, currentServings,
        calculateAmount, handleSave, updateServings, updateCookingTime, 
        updateNutrients, handleIngredientChange, handleStepChange, deleteStep, 
        addStep, deleteIngredient, addIngredient, deleteRecipe, toggleEditMode 
    } = useRecipeEditor(id);

    // 3. Ladezustand & Fehlerbehandlung ("Guard Clause" für das UI)
    // Wenn Daten noch geladen werden oder fehlen, wird nur der Loading Spinner gezeigt.
    if (isLoading || !recipe || !editedRecipe) {
        return <Loader2 className={styles.detail__loadingIcon}></Loader2>;
    }

    // ==========================================
    // 4. RENDER: DIE BENUTZEROBERFLÄCHE
    // ==========================================
    return (
        <div >
            {/* --- OBERER BEREICH: Bild & Aktions Buttons --- */}
            <ImageSection
                recipe={recipe}
                toggleEditMode={toggleEditMode}
                deleteRecipe={deleteRecipe}
                isEditing={isEditing}
                handleSave={handleSave}
            ></ImageSection>

            <div className="app">
                {/* --- HEADER: Rezepttitel --- */}
                <TitleSection
                    recipe={recipe}
                    isEditing={isEditing}
                    editedRecipe={editedRecipe}
                    setEditedRecipe={setEditedRecipe}
                ></TitleSection>

                <div className={styles.detail__wrapper}>
                    <div className={styles.detail__leftWrapper}>
                        
                        {/* --- LINKE SPALTE: Nährwerte --- */}
                        <NutrientsSection
                            editedRecipe={editedRecipe}
                            isEditing={isEditing}
                            recipe={recipe}
                            updateNutrients={updateNutrients}>
                        </NutrientsSection>
                        
                        {/* --- LINKE SPALTE: Zutaten & Portionen --- */}
                        <IngredientsSection
                            recipe={recipe}
                            isEditing={isEditing}
                            editedRecipe={editedRecipe}
                            updateServings={updateServings}
                            calculateAmount={calculateAmount}
                            handleIngredientChange={handleIngredientChange}
                            deleteIngredient={deleteIngredient}
                            currentServings={currentServings}
                            addIngredient={addIngredient}>
                        </IngredientsSection>

                    </div>

                    {/* --- RECHTE SPALTE: Zubereitungsschritte --- */}
                    <StepsSection
                        isEditing={isEditing}
                        recipe={recipe}
                        editedRecipe={editedRecipe}
                        updateCookingTime={updateCookingTime}
                        handleStepChange={handleStepChange}
                        deleteStep={deleteStep}
                        addStep={addStep}>
                    </StepsSection>
                </div>

                {/* --- FOOTER: Link zur Original Quelle --- */}
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