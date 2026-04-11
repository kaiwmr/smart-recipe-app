import styles from './TitleSection.module.css';
import { Recipe } from '../../../types';

interface TitleSectionProps {
    recipe: Recipe;
    isEditing: boolean;
    editedRecipe: Recipe;
    setEditedRecipe: (value: Recipe) => void;
}

export default function TitleSection({ 
    recipe, 
    isEditing, 
    editedRecipe, 
    setEditedRecipe 
}: TitleSectionProps) {

    return (
        <div className={styles.detail__titleContainer}>
            {isEditing ? (
                /* Edit Mode: Title Input */
                <input 
                    type="text" 
                    value={editedRecipe.title} 
                    onChange={(e) => setEditedRecipe({...editedRecipe, title: e.target.value})}
                    className={styles.detail__editInputTitle}
                    autoFocus
                />
            ) : (
                /* View Mode: Static Header */
                <>
                    <h2 className={styles.detail__title}>{recipe.title}</h2>
                    <div className={styles.detail__titleAccent} />
                </>
            )}
        </div>
    );
}