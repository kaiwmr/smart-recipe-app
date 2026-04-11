import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import styles from './RecipeDetail.module.css';

import ImageSection from './ImageSection/ImageSection';
import TitleSection from './TitleSection/TitleSection';
import NutrientsSection from './NutrientsSection/NutrientsSection';
import IngredientsSection from './IngredientsSection/IngredientsSection';
import StepsSection from './StepsSection/StepsSection';

import useRecipeEditor from './useRecipeEditor';

export default function RecipeDetail() {
    const { id } = useParams();
    
    const { 
        recipe, editedRecipe, setEditedRecipe, isLoading, isEditing, currentServings,
        calculateAmount, handleSave, updateServings, updateCookingTime, 
        updateNutrients, handleIngredientChange, handleStepChange, deleteStep, 
        addStep, deleteIngredient, addIngredient, deleteRecipe, toggleEditMode 
    } = useRecipeEditor(id);

    // Guard Clause: Loading state or missing data
    if (isLoading || !recipe || !editedRecipe) {
        return <Loader2 className={styles.detail__loadingIcon} />;
    }

    return (
        <div>
            {/* Hero Section: Media & Primary Actions */}
            <ImageSection
                recipe={recipe}
                toggleEditMode={toggleEditMode}
                deleteRecipe={deleteRecipe}
                isEditing={isEditing}
                handleSave={handleSave}
            />

            <div className="app">
                <TitleSection
                    recipe={recipe}
                    isEditing={isEditing}
                    editedRecipe={editedRecipe}
                    setEditedRecipe={setEditedRecipe}
                />

                <div className={styles.detail__wrapper}>
                    {/* Left Column: Nutritional Info & Ingredients */}
                    <div className={styles.detail__leftWrapper}>
                        <NutrientsSection
                            editedRecipe={editedRecipe}
                            isEditing={isEditing}
                            recipe={recipe}
                            updateNutrients={updateNutrients}
                        />
                        
                        <IngredientsSection
                            recipe={recipe}
                            isEditing={isEditing}
                            editedRecipe={editedRecipe}
                            updateServings={updateServings}
                            calculateAmount={calculateAmount}
                            handleIngredientChange={handleIngredientChange}
                            deleteIngredient={deleteIngredient}
                            currentServings={currentServings}
                            addIngredient={addIngredient}
                        />
                    </div>

                    {/* Right Column: Preparation Steps */}
                    <StepsSection
                        isEditing={isEditing}
                        recipe={recipe}
                        editedRecipe={editedRecipe}
                        updateCookingTime={updateCookingTime}
                        handleStepChange={handleStepChange}
                        deleteStep={deleteStep}
                        addStep={addStep}
                    />
                </div>

                {/* Footer: External Source Link */}
                {recipe.url && (
                    <div className={styles.detail__sourceContainer}>
                        <a 
                            href={recipe.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            className={styles.detail__btnSource}
                        >
                            Zum Originalrezept <span className={styles.detail__sourceArrow}>↗</span>
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
}