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

import { Recipe } from '../../types';

export default function Dashboard() {
    // ==========================================
    // 1. STATES UND KONSTANTEN
    // ==========================================
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState<string>("");
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<string[]>([]);
    const navigate = useNavigate();

    // Festgelegte Filter Optionen für die Tag-Leiste
    const tags: string[] = ["high protein", "< 30min", "vegetarisch", "vegan", "Hauptspeise", "Dessert", "Frühstück", "Backen"];

    // ==========================================
    // 2. API-INTERAKTION & EFFECTS
    // ==========================================
    
    // Holt alle Rezepte des Benutzers vom Server
    const fetchRecipes = async () => {   
        try {
            const response = await api.get("/recipes/");
            setRecipes(response.data);
        } catch (error) {
            console.error("Fehler beim Laden der Rezepte:", error);
            navigate("/login")
        } finally {
            setIsLoading(false);
        }
    };

    // Initialer Daten-Abruf beim Mounten der Komponente
    useEffect(() => { 
        fetchRecipes(); 
    }, []); 

    // ==========================================
    // 3. FILTER-LOGIK
    // ==========================================

    // Fügt einen Tag zur Auswahl hinzu oder entfernt ihn (Toggle Prinzip)
    const toggleFilter = (filter: string) => {
        selected.includes(filter)
            ? setSelected(selected.filter(f => f !== filter)) // Tag entfernen
            : setSelected([...selected, filter]);             // Tag hinzufügen
    };

    // ==========================================
    // 4. RENDERING
    // ==========================================
    return (
        <div>
            <Header handleLogout={logout}></Header>
            
            <div className='app'>
                {/* Suche und Filter-Tags */}
                <Searchbar 
                    search={search} 
                    setSearch={setSearch} 
                    setShowPopup={setShowPopup} 
                />
                
                <TagFilter 
                    tags={tags} 
                    toggleFilter={toggleFilter} 
                    selected={selected} 
                />

                {/* Modal zum Hinzufügen neuer Rezepte */}
                <Popup 
                    showPopup={showPopup} 
                    setShowPopup={setShowPopup} 
                    onRecipeAdded={fetchRecipes} 
                />
                
                {/* Status-Anzeige: Laden oder "Nichts gefunden" */}
                {isLoading 
                    ? (<Loader2 className={styles.dashboard__loadingIcon}></Loader2>) 
                    : (recipes.length === 0 
                        ? <p className={styles.dashboard__nothingFound}>Keine Rezepte gefunden.</p> 
                        : null)
                }

                {/* Rezept-Grid: Hier wird die clientseitige Filterung durchgeführt */}
                <div className={styles.dashboard__grid}>
                    {recipes
                        .filter(item => 
                            // Filterung nach Suchbegriff (Titel)
                            item.title.toLowerCase().includes(search.toLowerCase()) && 
                            // Filterung nach Tags: Das Rezept muss ALLE gewählten Tags enthalten
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