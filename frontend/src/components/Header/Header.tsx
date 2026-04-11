import { LogOut } from 'lucide-react';
import styles from './Header.module.css';
import logo from "../../assets/BiteWiseLogo.svg";

interface HeaderProps {
    handleLogout: () => void;
}

export default function Header({ handleLogout }: HeaderProps) {
    
    return (
        <div className={styles.header}>
            <img className={styles.header__logo} src={logo} alt='BiteWise Logo' />

            {/* --- Logout Actions --------------------- */}
            <div className={styles.header__logoutPart} onClick={handleLogout}>
                <span className={styles.header__logoutText}>Ausloggen</span>
                <LogOut className={styles.header__btnLogOut} size={20} />
            </div>
        </div>
    );
}