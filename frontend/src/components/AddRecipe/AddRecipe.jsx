import { useState } from "react";
import { Link } from 'lucide-react';
import styles from './AddRecipe.module.css';
import { toast } from "react-toastify";
import api from "../../api/api";

export default function AddRecipe({ onRecipeAdded }) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      await api.post("/recipes/from-url", null, { params: { url: url }});

      toast.success("Rezept erstellt");
      setUrl("");
      onRecipeAdded();
    } catch (error) {
      console.error(error);
      toast.error("Fehler aufgetreten")
    } finally {
      setIsLoading(false);
    }
  };

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
