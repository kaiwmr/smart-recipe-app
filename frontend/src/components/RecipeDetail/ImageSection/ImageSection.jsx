import styles from './ImageSection.module.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Save, X } from 'lucide-react'; 

export default function ImageSection({ recipe, toggleEditMode, deleteRecipe, isEditing, handleSave }) {
    const navigate = useNavigate(); 

    return (
        <div className={styles.detail__pictureWrapper}>
            <img
                className={styles.detail__picture}
                src={`data:image/png;base64,${recipe.image}`}
                alt={recipe.title}
            />
            
            <button className={styles.detail__btnBack} onClick={() => navigate("/dashboard")}>
                <ChevronLeft size={24} />
            </button>

            <div className={styles.detail__actions}>
                {!isEditing ? (
                    <>
                        <button className={styles.detail__btnEdit} onClick={() => toggleEditMode(true)}>
                            <Edit2 size={20} />
                        </button>
                        <button className={styles.detail__btnDelete} onClick={() => deleteRecipe(recipe.id)}>
                            <Trash2 size={20} />
                        </button>
                    </>
                ) : (
                    <div className={styles.detail__editControls}>
                        <button className={styles.detail__btnSave} onClick={handleSave}>
                            <Save size={20} />
                        </button>
                        <button className={styles.detail__btnCancel} onClick={() => toggleEditMode(false)}>
                            <X size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}