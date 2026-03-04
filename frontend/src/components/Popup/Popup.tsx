import styles from './Popup.module.css';
import { X } from 'lucide-react';
import AddRecipe from '../AddRecipe/AddRecipe';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface PopupProps {
    showPopup: boolean;                // Sichtbarkeit des Popups
    setShowPopup: (value: boolean) => void; // Funktion zum Öffnen/Schließen
    onRecipeAdded: () => Promise<void>; // Callback, wenn ein Rezept erfolgreich erstellt wurde
}

export default function Popup({ showPopup, setShowPopup, onRecipeAdded }: PopupProps) {
    
    // ==========================================
    // 2. RENDERING & MODAL-LOGIK
    // ==========================================
    return (
        <div>
            {/* Das Popup wird nur gerendert, wenn showPopup true ist */}
            {showPopup && (
                <div
                    className={styles.popup}
                    /* Klick auf das dunkle Overlay schließt das Popup */
                    onClick={() => setShowPopup(false)}
                >
                    <div
                        className={styles.popup__modal}
                        /* e.stopPropagation() verhindert, dass ein Klick ins Modal 
                           das Popup versehentlich schließt (Bubbling zum Overlay) */
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header des Popups mit Titel und Schließen-Icon */}
                        <div className={styles.popup__header}>
                            <h2>Rezept hinzufügen</h2>
                            <X
                                className={styles.popup__btnClose}
                                size={20}
                                onClick={() => setShowPopup(false)}
                            />
                        </div>

                        {/* Inhaltsbereich: Formular zum Hinzufügen von Rezepten */}
                        <div className={styles.popup__form}>
                            <AddRecipe onRecipeAdded={async () => {
                                // Erst die Daten im Dashboard aktualisieren...
                                await onRecipeAdded(); 
                                // ...dann das Popup automatisch schließen
                                setShowPopup(false); 
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}