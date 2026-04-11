import { useState } from 'react';
import { X } from 'lucide-react';
import AddRecipeLink from '../AddRecipe/LinkInput/AddRecipeLink';
import AddRecipeText from '../AddRecipe/TextInput/AddRecipeText';
import styles from './Popup.module.css';

interface PopupProps {
    showPopup: boolean;
    setShowPopup: (value: boolean) => void;
    onRecipeAdded: () => Promise<void>;
}

export default function Popup({ showPopup, setShowPopup, onRecipeAdded }: PopupProps) {
    const [showTextInput, setShowTextInput] = useState<boolean>(false);

    if (!showPopup) return null;

    return (
        <div 
            className={styles.popup} 
            onClick={() => setShowPopup(false)}
        >
            <div 
                className={styles.popup__modal} 
                onClick={(e) => e.stopPropagation()}
            >
                {/* --- Header ------------------------------ */}
                <div className={styles.popup__header}>
                    <h2>Rezept hinzufügen</h2>
                    <X
                        className={styles.popup__btnClose}
                        size={20}
                        onClick={() => setShowPopup(false)}
                    />
                </div>

                {/* --- Navigation Tabs -------------------- */}
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

                {/* --- Form Content ----------------------- */}
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
    );
}