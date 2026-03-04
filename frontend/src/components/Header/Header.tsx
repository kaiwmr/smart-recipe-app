import { LogOut } from 'lucide-react';
import styles from './Header.module.css';
import logo from "../../assets/BiteWiseLogo.svg";

// ==========================================
// 1. PROPS & INTERFACES
// ==========================================
interface HeaderProps {
    // Funktion zum Abmelden und Zurücksetzen der Session
    handleLogout: () => void;
}

export default function Header({ handleLogout }: HeaderProps) {
    
    // ==========================================
    // 2. RENDERING
    // ==========================================
    return (
        <div className={styles.header}>
            {/* Logo der Anwendung */}
            <img className={styles.header__logo} src={logo} alt='BiteWise Logo' />

            {/* Interaktiver Logout-Bereich (Text + Icon) */}
            <div className={styles.header__logoutPart} onClick={handleLogout}>
                <span className={styles.header__logoutText}>Ausloggen</span>
                <LogOut className={styles.header__btnLogOut} size={20} />
            </div>
        </div>
    );
}