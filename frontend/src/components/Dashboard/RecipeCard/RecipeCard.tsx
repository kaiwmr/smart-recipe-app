import styles from './RecipeCard.module.css';
import { useNavigate } from "react-router-dom";
import { Clock, Leaf } from "lucide-react"
import { Recipe } from '../../../types';

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface RecipeCardProps {
    recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
    // ==========================================
    // 2. LOGIK (NAVIGATION)
    // ==========================================
    const navigate = useNavigate(); 

    // ==========================================
    // 3. RENDERING
    // ==========================================
    return (
        /* Klick auf die gesamte Karte navigiert zur Detailansicht des Rezepts */
        <div className={styles.dashboard__card} onClick={() => navigate(`/recipe/${recipe.id}`)}> 
            
            {/* Rezeptbild (Base64-Format aus der Datenbank) */}
            <img 
                className={styles.dashboard__picture} 
                src={`data:image/png;base64,${recipe.image}`} 
                alt={recipe.title} 
                loading="lazy" 
            />

            <div className={styles.dashboard__cardContent}>
                <h3>{recipe.title}</h3>
                
                <div className={styles.dashboard__cardContentDetailsWrapper}>
                    
                    {/* Anzeige der Zubereitungszeit: Automatische Umrechnung in Stunden ab 60 Min */}
                    <div className={styles.dashboard__cookingTimeBox}>
                        <Clock size={14} />
                        <span>
                            {Number(recipe.content.cooking_time) >= 60
                                ? `${Math.round(Number(recipe.content.cooking_time) / 30) / 2} std`
                                : `${recipe.content.cooking_time} min`}
                        </span>
                    </div>

                    {/* Diet-Badge (Vegan/Vegetarisch): 
                        Wird nur gerendert, wenn einer der Begriffe in den Rezept Tags vorkommt 
                    */}
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