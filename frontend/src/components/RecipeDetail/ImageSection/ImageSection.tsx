import styles from './ImageSection.module.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Save, X } from 'lucide-react'; 

import { Recipe } from '../../../types';

const API_URL = import.meta.env.VITE_API_URL 

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface ImageSectionProps {
    recipe: Recipe;
    toggleEditMode: (value: boolean) => void; // Schaltet zwischen Ansicht und Bearbeitung um
    deleteRecipe: (value: number) => void;     // Funktion zum Löschen des Rezepts
    isEditing: boolean;                       // Aktueller Modus-Status
    handleSave: () => Promise<void>;          // Speichert Änderungen am Rezept
}

export default function ImageSection({ 
    recipe, 
    toggleEditMode, 
    deleteRecipe, 
    isEditing, 
    handleSave 
}: ImageSectionProps) {
    
    // ==========================================
    // 2. LOGIK (NAVIGATION)
    // ==========================================
    const navigate = useNavigate(); 

    // ==========================================
    // 3. RENDERING (BILD & STEUERELEMENTE)
    // ==========================================
    return (
        <div className={styles.detail__pictureWrapper}>
            {/* Rezeptbild */}
            <img
                className={styles.detail__picture}
                src={`${API_URL}${recipe.image}`}
                alt={recipe.title}
            />
            
            {/* Zurück-Button zum Dashboard */}
            <button className={styles.detail__btnBack} onClick={() => navigate("/dashboard")}>
                <ChevronLeft size={24} />
            </button>

            {/* Aktion-Buttons: Wechseln je nachdem, ob isEditing true oder false ist */}
            <div className={styles.detail__actions}>
                {!isEditing ? (
                    // MODUS: ANSICHT (Default)
                    <>
                        <button 
                            className={styles.detail__btnEdit} 
                            onClick={() => toggleEditMode(true)}
                            title="Rezept bearbeiten"
                        >
                            <Edit2 size={20} />
                        </button>
                        <button 
                            className={styles.detail__btnDelete} 
                            onClick={() => deleteRecipe(recipe.id)}
                            title="Rezept löschen"
                        >
                            <Trash2 size={20} />
                        </button>
                    </>
                ) : (
                    // MODUS: BEARBEITEN
                    <div className={styles.detail__editControls}>
                        <button 
                            className={styles.detail__btnSave} 
                            onClick={handleSave}
                            title="Änderungen speichern"
                        >
                            <Save size={20} />
                        </button>
                        <button 
                            className={styles.detail__btnCancel} 
                            onClick={() => toggleEditMode(false)}
                            title="Abbrechen"
                        >
                            <X size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}