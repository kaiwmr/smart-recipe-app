import { useState } from "react";
import { Link } from 'lucide-react';
import { toast } from "react-toastify";
import axios from "axios";
import styles from './AddRecipeLink.module.css';
import api from "../../../api/api";

interface AddRecipeLinkProps {
  onRecipeAdded: () => Promise<void>;
}

export default function AddRecipeLink({ onRecipeAdded }: AddRecipeLinkProps) {
  const [url, setUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("KI arbeitet...");

  // --- Form Logic: Scraper & AI Processing --
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!url) {
      toast.warning("Bitte gib eine URL ein");
      return;
    }

    setIsLoading(true);
    setLoadingText("Website wird aufgerufen...");

    const steps = [
      "Inhalte werden analysiert...",
      "Daten werden verarbeitet...",
      "Rezepturen werden identifiziert...",
      "Details werden aufbereitet..."
    ];

    let stepIndex = 0;
    const intervalId = setInterval(() => {
      if (stepIndex < steps.length) {
        setLoadingText(steps[stepIndex]);
        stepIndex++;
      }
    }, 3000);

    try {
      await api.post("/recipes/from-url", null, { params: { url: url }});

      toast.success("Rezept erstellt");
      setUrl("");
      await onRecipeAdded();
    } catch (error) {
      console.error("AI Scraper Error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 429) toast.error("Rate-limit erreicht");
        else if (status === 404) toast.error("Kein Rezept gefunden");
        else toast.error("Fehler aufgetreten");
      }
    } finally {
      clearInterval(intervalId);
      setIsLoading(false);
      setLoadingText("KI arbeitet..."); 
    }
  };

  // --- Rendering ---------------------------
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Füge einen Link zu einer Rezept-Webseite oder einem TikTok-Video ein.</p>
        
        <div className={styles.addRecipe__inputWrapper}>
          <Link className={styles.addRecipe__icon} size={20} />
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
          {isLoading ? loadingText : "Zum Katalog hinzufügen"}
        </button>

        <p className={styles.addRecipe__subtitle}>
          Die App extrahiert mit Hilfe von KI automatisch Zutaten und Zubereitung.
        </p>
      </form>
    </div>
  );
}