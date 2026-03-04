import styles from './TitleSection.module.css';
import { Recipe } from '../../../types';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface TitleSectionProps {
    recipe: Recipe;         // Die Originaldaten aus der Datenbank
    isEditing: boolean;     // Status: Bearbeiten oder Anschauen
    editedRecipe: Recipe;   // Der aktuelle Entwurf während der Bearbeitung
    setEditedRecipe: (value: Recipe) => void; // Funktion zum Aktualisieren des Entwurfs
}

export default function TitleSection({ 
    recipe, 
    isEditing, 
    editedRecipe, 
    setEditedRecipe 
}: TitleSectionProps) {

    // ==========================================
    // 2. RENDERING
    // ==========================================
    return (
        <div className={styles.detail__titleContainer}>
            {isEditing ? (
                /* MODUS: BEARBEITEN (Input-Feld für den Titel) */
                <input 
                    type="text" 
                    value={editedRecipe.title} 
                    /* Direktes State-Update: nehmen des bestehenden Objekts (...editedRecipe) 
                       und überschreiben nur das Feld 'title'. 
                    */
                    onChange={(e) => setEditedRecipe({...editedRecipe, title: e.target.value})}
                    className={styles.detail__editInputTitle}
                    /* autoFocus sorgt dafür, dass der Cursor sofort im Feld blinkt */
                    autoFocus
                />
            ) : (
                /* MODUS: ANSICHT (Überschrift & Design-Akzent) */
                <>
                    <h2 className={styles.detail__title}>{recipe.title}</h2>
                    <div className={styles.detail__titleAccent}></div>
                </>
            )}
        </div>
    );
}