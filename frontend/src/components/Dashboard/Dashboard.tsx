import { useState, useEffect } from 'react';
import { Loader2 } from "lucide-react"
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';
import Searchbar from '../Searchbar/Searchbar';
import Popup from '../Popup/Popup';
import Header from '../Header/Header';
import api from '../../api/api';
import { logout } from '../../utils/auth';
import RecipeCard from './RecipeCard/RecipeCard';
import TagFilter from './TagFilter/TagFilter';
import { Recipe } from '../../types';

export default function Dashboard() {
    // --- State & Constants -------------------
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [search, setSearch] = useState<string>("");
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<string[]>([]);
    const navigate = useNavigate();

    const tags: string[] = ["high protein", "< 30min", "vegetarisch", "vegan", "Hauptspeise", "Dessert", "Frühstück", "Backen", "Beilage"];

    // --- API Interaction ---------------------
    const fetchRecipes = async () => {   
        try {
            const response = await api.get("/recipes/");
            setRecipes(response.data);
        } catch (error) {
            console.error("Fetch error:", error);
            navigate("/login")
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { 
        fetchRecipes(); 
    }, []); 

    // --- Filter Logic ------------------------
    const toggleFilter = (filter: string) => {
        selected.includes(filter)
            ? setSelected(selected.filter(f => f !== filter))
            : setSelected([...selected, filter]);
    };

    // --- Rendering ---------------------------
    return (
        <div>
            <Header handleLogout={logout} />
            
            <div className='app'>
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

                <Popup 
                    showPopup={showPopup} 
                    setShowPopup={setShowPopup} 
                    onRecipeAdded={fetchRecipes} 
                />
                
                {/* Status-Feedback: Loading or Empty State */}
                {isLoading 
                    ? <Loader2 className={styles.dashboard__loadingIcon} />
                    : (recipes.length === 0 && (
                        <p className={styles.dashboard__nothingFound}>Keine Rezepte gefunden.</p>
                      ))
                }

                {/* Recipe Grid: Client-side filtering by title and tags */}
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