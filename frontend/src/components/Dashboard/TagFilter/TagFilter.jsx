import styles from './TagFilter.module.css';

export default function TagFilter({ tags, toggleFilter, selected }) {

    return (
        <div className={styles.dashboard__filterWrapper}>
            {tags.map(tag => {
                // Prüfen, ob der aktuelle Tag in der Liste der ausgewählten Filter ist
                const isActive = selected.includes(tag);
                
                return (
                    <button
                        key={tag}
                        value={tag}
                        onClick={() => toggleFilter(tag)}
                        /* Dynamische Klasse: Fügt den Active-Style hinzu, wenn isActive true ist */
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