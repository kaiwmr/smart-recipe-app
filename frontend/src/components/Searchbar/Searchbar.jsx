import styles from './Searchbar.module.css';
import { Search, Plus } from 'lucide-react';

export default function Searchbar({ search, setSearch, setShowPopup }) {

    return (
        <div className={styles.search}>
            <div className={styles.search__inputWrapper}>
                <Search className={styles.search__icon} size={20}></Search>
                <input
                    type="text" 
                    placeholder="Nach Rezepten suchen..." 
                    className={styles.search__input}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}>
                </input>
            </div>

            {/* Rechter Bereich: Der Button */}
            <button className={styles.search__btnAdd} onClick={() => setShowPopup(true)}>
                <Plus size={20}></Plus>
            </button>
        </div>
    );
}
