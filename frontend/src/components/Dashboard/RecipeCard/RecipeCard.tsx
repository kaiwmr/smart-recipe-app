import { useNavigate } from "react-router-dom";
import { Clock, Leaf } from "lucide-react"
import styles from './RecipeCard.module.css';
import { Recipe } from '../../../types';

const API_URL = import.meta.env.VITE_API_URL 

interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    const navigate = useNavigate(); 

    return (
        <div 
            className={styles.dashboard__card} 
            onClick={() => navigate(`/recipe/${recipe.id}`)}
        > 
            <img 
                className={styles.dashboard__picture} 
                src={`${API_URL}${recipe.image}`}
                alt={recipe.title} 
                loading="lazy" 
            />

            <div className={styles.dashboard__cardContent}>
                <h3>{recipe.title}</h3>
                
                <div className={styles.dashboard__cardContentDetailsWrapper}>
                    
                    {/* --- Time Badge: Formats minutes to hours if >= 60 --- */}
                    <div className={styles.dashboard__cookingTimeBox}>
                        <Clock size={14} />
                        <span>
                            {Number(recipe.content.cooking_time) >= 60
                                ? `${Math.round(Number(recipe.content.cooking_time) / 30) / 2} std`
                                : `${recipe.content.cooking_time} min`}
                        </span>
                    </div>

                    {/* --- Diet Badge: Rendered for vegan/vegetarian recipes --- */}
                    {recipe.content.tags.some(tag => ["vegan", "vegetarisch"].includes(tag)) && (
                        <div className={styles.dashboard__veganBox}>
                            <Leaf size={13} strokeWidth={2.5} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}