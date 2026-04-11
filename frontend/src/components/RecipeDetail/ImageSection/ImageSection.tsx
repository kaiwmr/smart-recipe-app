import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Save, X } from 'lucide-react'; 
import styles from './ImageSection.module.css';
import { Recipe } from '../../../types';

const API_URL = import.meta.env.VITE_API_URL 

interface ImageSectionProps {
    recipe: Recipe;
    toggleEditMode: (value: boolean) => void;
    deleteRecipe: (value: number) => void;
    isEditing: boolean;
    handleSave: () => Promise<void>;
}

export default function ImageSection({ 
    recipe, 
    toggleEditMode, 
    deleteRecipe, 
    isEditing, 
    handleSave 
}: ImageSectionProps) {
    const navigate = useNavigate(); 

    return (
        <div className={styles.detail__pictureWrapper}>
            <img
                className={styles.detail__picture}
                src={`${API_URL}${recipe.image}`}
                alt={recipe.title}
            />
            
            <button 
                className={styles.detail__btnBack} 
                onClick={() => navigate("/dashboard")}
                aria-label="Back to dashboard"
            >
                <ChevronLeft size={24} />
            </button>

            <div className={styles.detail__actions}>
                {!isEditing ? (
                    /* View Mode Actions */
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
                    /* Edit Mode Actions */
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