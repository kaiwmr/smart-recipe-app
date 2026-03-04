import styles from './TagFilter.module.css';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface TagFilterProps {
    tags: string[];                  // Liste aller verfügbaren Filter
    toggleFilter: (tag: string) => void; // Funktion zum Umschalten eines Filters
    selected: string[];              // Liste der aktuell aktiven Filter
}

export default function TagFilter({ tags, toggleFilter, selected }: TagFilterProps) {

    // ==========================================
    // 2. RENDERING
    // ==========================================
    return (
        <div className={styles.dashboard__filterWrapper}>
            {tags.map(tag => {
                // Lokale Prüfung: Ist dieser spezifische Tag gerade ausgewählt?
                const isActive = selected.includes(tag);
                
                return (
                    <button
                        key={tag}
                        value={tag}
                        onClick={() => toggleFilter(tag)}
                        /*
                           Wir hängen die 'Active'-Klasse nur an, wenn isActive true ist.
                           => sorgt für das visuelle Feedback
                        */
                        className={`
                            ${styles.dashboard__btnFilter} 
                            ${isActive ? styles.dashboard__btnFilterActive : ''}
                        `}
                    >
                        {tag}
                    </button>
                );
            })}
        </div>
    );
}