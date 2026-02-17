import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import Searchbar from '../Searchbar/Searchbar';
import Popup from '../Popup/Popup';
import Header from '../Header/Header';
import { Loader2 } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { logout } from '../../utils/auth';
import RecipeCard from './RecipeCard/RecipeCard';
import TagFilter from './TagFilter/TagFilter';

export default function Dashboard() {
    // State-Initialisierung
    const [recipes, setRecipes] = useState([]);
    const [search, setSearch] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState([])
    const navigate = useNavigate();

    // Festgelegte Filter-Optionen
    const tags = ["high protein", "< 30min", "vegetarisch", "vegan", "Hauptspeise", "Dessert", "Frühstück", "Backen"];

    // API-Interaktion
    const fetchRecipes = async () => {   
        try {
            const response = await api.get("/recipes/");
            setRecipes(response.data);
        } catch (error) {
            console.error("Fehler beim Laden:", error);
            alert("Session abgelaufen?");
            navigate("/login")
        } finally {
            setIsLoading(false)
        }
    };

    // Lädt die Rezepte einmalig beim ersten Rendern
    useEffect(() => { fetchRecipes() }, []); 

    // Logik für die Filter Auswahl
    const toggleFilter = (filter) => {
    selected.includes(filter)
        ? setSelected(selected.filter(f => f !== filter)) // Tag entfernen
        : setSelected([...selected, filter]);            // Tag hinzufügen
    };

    return (
        <div>
            <Header handleLogout={logout}></Header>
            <div className='app'>
                {/* Obere Sektion: Suche und Filter Tags */}
                <Searchbar search={search} setSearch={setSearch} showPopup={showPopup} setShowPopup={setShowPopup}></Searchbar>
                <TagFilter tags={tags} toggleFilter={toggleFilter} selected={selected}></TagFilter>

                <Popup showPopup={showPopup} setShowPopup={setShowPopup} onRecipeAdded={fetchRecipes}></Popup>
                
                {/* Ladeanzeige oder Leermeldung */}
                {isLoading 
                    ? (<Loader2 className={styles.dashboard__loadingIcon}></Loader2>) 
                    : (recipes.length === 0 
                        ? <p className={styles.dashboard__nothingFound}>Keine Rezepte gefunden.</p> 
                        : null)
                }

                {/* Hauptbereich: Gefilterte Rezept Karten */}
                <div className={styles.dashboard__grid}>
                    {recipes
                        .filter(item => 
                            item.title.toLowerCase().includes(search.toLowerCase()) && 
                            selected.every(tag => item.content.tags.includes(tag))
                        )
                        .map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))
                    }
                </div>
            </div>
        </div>
    );
}