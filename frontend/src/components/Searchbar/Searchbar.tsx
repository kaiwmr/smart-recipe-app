import styles from './Searchbar.module.css';
import { Search, Plus } from 'lucide-react';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface SearchbarProps {
    search: string;                     // Aktueller Suchbegriff aus dem Parent-State
    setSearch: (value: string) => void; // Funktion zum Aktualisieren der Suche
    setShowPopup: (value: boolean) => void; // Funktion zum Öffnen des "Hinzufügen"-Modals
}

export default function Searchbar({ search, setSearch, setShowPopup }: SearchbarProps) {

    // ==========================================
    // 2. RENDERING
    // ==========================================
    return (
        <div className={styles.search}>
            
            {/* --- LINKER BEREICH: Such-Eingabefeld --- */}
            <div className={styles.search__inputWrapper}>
                <Search className={styles.search__icon} size={20} />
                <input
                    type="text" 
                    placeholder="Nach Rezepten suchen..." 
                    className={styles.search__input}
                    /* "Controlled Input": Value und onChange kommen von außen */
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* --- RECHTER BEREICH: Button zum Hinzufügen --- */}
            <button 
                className={styles.search__btnAdd} 
                onClick={() => setShowPopup(true)}
                title="Neues Rezept hinzufügen"
            >
                <Plus size={20} />
            </button>
        </div>
    );
}