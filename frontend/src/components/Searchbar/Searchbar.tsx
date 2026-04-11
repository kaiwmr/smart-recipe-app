import styles from './Searchbar.module.css';
import { Search, Plus } from 'lucide-react';

interface SearchbarProps {
    search: string;
    setSearch: (value: string) => void;
    setShowPopup: (value: boolean) => void;
}

export default function Searchbar({ search, setSearch, setShowPopup }: SearchbarProps) {

    return (
        <div className={styles.search}>
            
            {/* --- Search Input ----------------------- */}
            <div className={styles.search__inputWrapper}>
                <Search className={styles.search__icon} size={20} />
                <input
                    type="text" 
                    placeholder="Nach Rezepten suchen..." 
                    className={styles.search__input}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* --- Action Buttons --------------------- */}
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