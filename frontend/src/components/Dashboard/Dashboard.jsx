import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Dashboard.module.css';
import Searchbar from '../Searchbar/Searchbar';
import Popup from '../Popup/Popup';
import Header from '../Header/Header';
import { Clock, Loader2, Leaf } from "lucide-react"
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState([])
    const navigate = useNavigate();
    const tags = ["high protein", "< 30min", "vegetarisch", "vegan", "Hauptspeise", "Dessert", "Frühstück", "Backen"];

    const fetchRecipes = async () => {
        // 1. Token aus dem Speicher holen
        const token = localStorage.getItem("BiteWiseToken");
            
        // 2. Request mit Authorization Header senden
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/recipes/`, {
                headers: { Authorization: `Bearer ${token}` } // WICHTIG: Das Leerzeichen nach Bearer!
            });
            // 3. Die geladenen Rezepte in den State packen
            setRecipes(response.data);
        } catch (error) {
            console.error("Fehler beim Laden:", error);
            alert("Session abgelaufen?");
            navigate("/login")
        } finally {
            setIsLoading(false)
        }
    };

    // Dieser Effekt läuft genau 1x beim Start (wegen dem leeren Array [] am Ende)
    useEffect(() => { fetchRecipes() }, []); // <--- Das leere Array ist wichtig!

    const handleLogout = () => {
        localStorage.removeItem("BiteWiseToken");
        navigate("/login");
    };

    const toggleFilter = (filter) => {
    selected.includes(filter)
        ? setSelected(selected.filter(f => f !== filter))
        : setSelected([...selected, filter]);
    };


    return (
        <div>
            <Header handleLogout={handleLogout}></Header>
            <div className='app'>
                <Searchbar search={search} setSearch={setSearch} showPopup={showPopup} setShowPopup={setShowPopup}></Searchbar>
                <div className={styles.dashboard__filterWrapper}>
                {tags.map(tag => {
                    // Prüfen, ob der Tag aktiv ist
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

                <Popup showPopup={showPopup} setShowPopup={setShowPopup} onRecipeAdded={fetchRecipes}></Popup>
                
                {isLoading 
                    ? (<Loader2 className={styles.dashboard__loadingIcon}></Loader2>) 
                    : (recipes.length === 0 
                        ? <p className={styles.dashboard__nothingFound}>Keine Rezepte gefunden.</p> 
                        : null)
                }

                {/* Das Gitter für die Karten */}
                <div className={styles.dashboard__grid}>
                    {recipes
                        .filter(item => item.title.toLowerCase().includes(search.toLowerCase()) && selected.every(tag => item.content.tags.includes(tag)))
                        .map(recipe => (
                        <div key={recipe.id} className={styles.dashboard__card} onClick={() => navigate(`/recipe/${recipe.id}`)}> 
                            <img className={styles.dashboard__picture} src={`data:image/png;base64,${recipe.image}`} alt={recipe.title} loading="lazy"
></img>
                            <div className={styles.dashboard__cardContent}>
                                <h3>{recipe.title}</h3>
                                <div className={styles.dashboard__cardContentDetailsWrapper}>
                                    <div className={styles.dashboard__cookingTimeBox}>
                                        <Clock size={14}></Clock>
                                        <span>
                                            {recipe.content.cooking_time >= 60
                                                ? `${Math.round(recipe.content.cooking_time / 30) / 2} std`
                                                : `${recipe.content.cooking_time} min`}
                                        </span>
                                    </div>
                                    {recipe.content.tags.some(tag => ["vegan", "vegetarisch"].includes(tag)) && (
                                    <div className={styles.dashboard__veganBox}>
                                        <Leaf size={13} strokeWidth={2.5} />
                                    </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
