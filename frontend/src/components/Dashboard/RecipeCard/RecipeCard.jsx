import styles from './RecipeCard.module.css';
import { useNavigate } from "react-router-dom";
import { Clock, Leaf } from "lucide-react"

export default function RecipeCard({ recipe }) {
    const navigate = useNavigate(); 

    return (
        /* Klick auf die gesamte Karte navigiert zur Detailansicht */
        <div className={styles.dashboard__card} onClick={() => navigate(`/recipe/${recipe.id}`)}> 
            <img 
                className={styles.dashboard__picture} 
                src={`data:image/png;base64,${recipe.image}`} 
                alt={recipe.title} 
                loading="lazy" 
            />
            <div className={styles.dashboard__cardContent}>
                <h3>{recipe.title}</h3>
                
                <div className={styles.dashboard__cardContentDetailsWrapper}>
                    {/* Anzeige der Zubereitungszeit mit Umrechnung ab 60 Min */}
                    <div className={styles.dashboard__cookingTimeBox}>
                        <Clock size={14} />
                        <span>
                            {recipe.content.cooking_time >= 60
                                ? `${Math.round(recipe.content.cooking_time / 30) / 2} std`
                                : `${recipe.content.cooking_time} min`}
                        </span>
                    </div>

                    {/* Vegan/Veggie-Badge: Wird nur gerendert, wenn entsprechende Tags vorhanden sind */}
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