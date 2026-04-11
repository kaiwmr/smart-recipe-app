import styles from './TagFilter.module.css';

interface TagFilterProps {
    tags: string[];
    toggleFilter: (tag: string) => void;
    selected: string[];
}

export default function TagFilter({ tags, toggleFilter, selected }: TagFilterProps) {

    return (
        <div className={styles.dashboard__filterWrapper}>
            {tags.map(tag => {
                const isActive = selected.includes(tag);
                
                return (
                    <button
                        key={tag}
                        value={tag}
                        onClick={() => toggleFilter(tag)}
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