import styles from './Popup.module.css';
import { X } from 'lucide-react';
import AddRecipe from '../AddRecipe/AddRecipe';

export default function Popup({ showPopup, setShowPopup, onRecipeAdded }) {
    return (
        <div>
            {showPopup && (
                <div
                    className={styles.popup}
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        className={styles.popup__modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.popup__header}>
                            <h2>Rezept hinzufügen</h2>
                            <X
                                className={styles.popup__btnClose}
                                size={20}
                                onClick={() => setShowPopup(false)}
                            ></X>
                        </div>
                        <div className={styles.popup__form}>
                            <AddRecipe onRecipeAdded={() => {
                                onRecipeAdded(); // Falls Dashboard eine Refresh-Funktion übergibt
                                setShowPopup(false); // Popup schließen bei Erfolg
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
