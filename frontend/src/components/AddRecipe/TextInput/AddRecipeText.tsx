import { useState } from "react";
import { FileText } from 'lucide-react';
import styles from './AddRecipeText.module.css';
import { toast } from "react-toastify";
import api from "../../../api/api";
import axios from "axios";

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface AddRecipeTextProps {
  onRecipeAdded: () => Promise<void>;
}

export default function AddRecipeText({ onRecipeAdded }: AddRecipeTextProps) {
  
  // ==========================================
  // 2. STATES
  // ==========================================
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("KI arbeitet...");

  // ==========================================
  // 3. FORMULAR LOGIK (API-INTERAKTION)
  // ==========================================
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userInput.trim()) {
      toast.warning("Bitte gib ein Rezept ein");
      return;
    }

    setIsLoading(true);
    setLoadingText("Text wird gelesen...");

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
      // POST-Request (als JSON-Body gesendet)
      await api.post("/recipes/from-user-input", { user_input: userInput });

      toast.success("Rezept erstellt");
      setUserInput(""); // Input nach Erfolg leeren
      
      await onRecipeAdded();
    } catch (error) {
      console.error("Fehler beim Erstellen des Rezepts:", error);
      if (axios.isAxiosError(error)){
        const status = error.response?.status;

        if (status == 429) {
          toast.error("Rate-limit erreicht");
        }
        else if (status === 404) {
          toast.error("Kein Rezept gefunden");
      }
      else {
        toast.error("Fehler aufgetreten");
      }
      }
    } finally {
      clearInterval(intervalId);
      setIsLoading(false);
      setLoadingText("KI arbeitet..."); 
    }
  };

  // ==========================================
  // 4. RENDERING
  // ==========================================
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Füge ein eigenes Rezept inklusive Titel, Zutaten und Zubereitungsschritte ein.</p>
        
        <div className={styles.addRecipe__inputWrapper}>
          <FileText className={styles.addRecipe__icon} size={20} />
          
          <textarea
            placeholder="z.B. Pizzateig... 200g Mehl, 2 Eier... Den Teig verrühren und für 20 Min backen."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className={styles.addRecipe__textarea}
            rows={6}
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