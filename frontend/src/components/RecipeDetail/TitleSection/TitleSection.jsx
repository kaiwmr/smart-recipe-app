import styles from './TitleSection.module.css';

export default function TitleSection( {recipe, isEditing, editedRecipe, setEditedRecipe,}) {

    return(
        <div className={styles.detail__titleContainer}>
            {isEditing ? (
                <input 
                    type="text" 
                    value={editedRecipe.title} 
                    onChange={(e) => setEditedRecipe({...editedRecipe, title: e.target.value})}
                    className={styles.detail__editInputTitle}
                    autoFocus
                />
            ) : (
                <>
                    <h2 className={styles.detail__title}>{recipe.title}</h2>
                    <div className={styles.detail__titleAccent}></div>
                </>
            )}
        </div>
    );
}