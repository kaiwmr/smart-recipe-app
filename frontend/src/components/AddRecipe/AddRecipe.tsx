import { useState } from "react";
import { Link } from 'lucide-react';
import styles from './AddRecipe.module.css';
import { toast } from "react-toastify";
import api from "../../api/api";

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface AddRecipeProps {
  // Funktion, die nach erfolgreichem Hinzufügen im Dashboard aufgerufen wird
  onRecipeAdded: () => Promise<void>;
}

export default function AddRecipe({ onRecipeAdded }: AddRecipeProps) {
  
  // ==========================================
  // 2. STATES
  // ==========================================
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // ==========================================
  // 3. FORMULAR LOGIK (API-INTERAKTION)
  // ==========================================
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lade-Status aktivieren
    setIsLoading(true);

    try {
      // POST-Request an den KI-Extractor Endpunkt
      await api.post("/recipes/from-url", null, { params: { url: url }});

      toast.success("Rezept erstellt");
      setUrl(""); // Input nach Erfolg leeren
      
      // Dashboard-Liste aktualisieren
      await onRecipeAdded();
    } catch (error) {
      console.error("Fehler beim Erstellen des Rezepts:", error);
      toast.error("Fehler aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 4. RENDERING
  // ==========================================
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Füge einen Link zu einer Rezept-Webseite oder einem TikTok-Video ein.</p>
        
        <div className={styles.addRecipe__inputWrapper}>
          <Link className={styles.addRecipe__icon} size={20}></Link>
          <input
            type="text"
            placeholder="Link einfügen..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className={styles.addRecipe__input}
          />
        </div>

        <button
          className={`${styles.addRecipe__btnAdd} ${isLoading ? styles.loading : ""}`}
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? "KI arbeitet..." : "Zum Katalog hinzufügen"}
        </button>

        <p className={styles.addRecipe__subtitle}>
          Die App extrahiert mit Hilfe von KI automatisch Zutaten und Zubereitung.
        </p>
      </form>
    </div>
  );
}