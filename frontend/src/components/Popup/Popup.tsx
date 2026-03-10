import styles from './Popup.module.css';
import { X } from 'lucide-react';
import AddRecipeLink from '../AddRecipe/LinkInput/AddRecipeLink';
import AddRecipeText from '../AddRecipe/TextInput/AddRecipeText';
import { useState } from 'react';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface PopupProps {
    showPopup: boolean;                // Sichtbarkeit des Popups
    setShowPopup: (value: boolean) => void; // Funktion zum Öffnen/Schließen
    onRecipeAdded: () => Promise<void>; // Callback, wenn ein Rezept erfolgreich erstellt wurde
}

export default function Popup({ showPopup, setShowPopup, onRecipeAdded }: PopupProps) {
    
    const [showTextInput, setShowTextInput] = useState<boolean>(false);

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

                        <div className={styles.popup__tabs}>
                            <button
                                className={!showTextInput ? styles.tab_active : styles.tab_inactive}
                                onClick={() => setShowTextInput(false)}
                            >
                                Link
                            </button>
                            <button
                                className={showTextInput ? styles.tab_active : styles.tab_inactive}
                                onClick={() => setShowTextInput(true)}
                            >
                                Text
                            </button>
                        </div>

                        {/* Inhaltsbereich: Formular zum Hinzufügen von Rezepten */}
                        <div className={styles.popup__form}>
                            {!showTextInput ? (
                                <AddRecipeLink onRecipeAdded={async () => {
                                    setShowPopup(false);
                                    await onRecipeAdded(); 
                                }} />
                            ) : (
                                <AddRecipeText onRecipeAdded={async () => {
                                    setShowPopup(false);
                                    await onRecipeAdded(); 
                                }} />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}