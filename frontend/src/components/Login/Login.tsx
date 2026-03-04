import { useState } from 'react';
import styles from './Login.module.css'
import logo from "../../assets/BiteWiseLogo.svg";
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';

export default function Login() {
    // ==========================================
    // 1. STATES
    // ==========================================
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [inviteCode, setInviteCode] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showRegistration, setShowRegistration] = useState<boolean>(false);
    const navigate = useNavigate();

    // ==========================================
    // 2. AUTH-LOGIK (LOGIN & REGISTRIERUNG)
    // ==========================================

    // Login (Authentifizierung): Sendet Login Data als FormData (OAuth2 Standard)
    const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);

        try {
            const response = await api.post("/token", formData);
            const token = response.data.access_token;
            
            // Token sicher im LocalStorage ablegen
            localStorage.setItem("BiteWiseToken", token);
            navigate("/dashboard");
        } catch (error) {
            console.error("Login Fehler:", error);
            toast.error("Login ist schiefgelaufen");
        }
    };

    // Registrierung: Sendet neue Benutzerdaten als JSON-Objekt
    const handleRegistration = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password,
            invite_code: inviteCode
        };

        try {
            await api.post("/users/", userData);
            toast.success("User erstellt - Du kannst dich nun anmelden");
            setShowRegistration(false); // Nach Erfolg zum Login wechseln
        } catch (error) {
            console.error("Registrierungs Fehler:", error);
            toast.error("Registrierung ist schiefgelaufen");
        }
    };

    // ==========================================
    // 3. HILFSFUNKTION / ICONS
    // ==========================================
    const PasswordIcon = showPassword ? Eye : EyeOff;

    // ==========================================
    // 4. RENDERING
    // ==========================================
    return (
        <div className={styles.login}>
            <form className={styles.login__box} onSubmit={showRegistration ? handleRegistration : handleLogin}>
                <img className={styles.login__logo} src={logo} alt="BiteWise Logo" />

                <h3>{showRegistration ? "Konto erstellen" : "Willkommen zurück!"}</h3>

                {/* Umschalter zwischen Login und Registrierung */}
                <div className={styles.login__authSelection}>
                    <button
                        type="button"
                        className={`${styles.login__authSelectionButton} ${!showRegistration ? styles.login__authSelectionButtonActive : ""}`}
                        onClick={() => setShowRegistration(false)}
                    >
                        Anmelden
                    </button>
                    <button
                        type="button"
                        className={`${styles.login__authSelectionButton} ${showRegistration ? styles.login__authSelectionButtonActive : ""}`} 
                        onClick={() => setShowRegistration(true)}
                    >
                        Registrieren
                    </button>
                </div>

                {/* Email Input */}
                <input
                    className={styles.login__input}
                    type="email"
                    placeholder="E-Mail-Adresse"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                {/* Passwort Input mit Sichtbarkeitstoggle */}
                <div className={styles.login__inputPassword}>
                    <input
                        className={styles.login__field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Passwort"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <PasswordIcon
                        className={styles.login__icon}
                        size={18}
                        onClick={() => setShowPassword(prev => !prev)}
                    />
                </div>

                {/* Erweiterbarer Bereich für den Invite-Code (nur bei Registrierung sichtbar) */}
                <div className={`${styles.expandable} ${showRegistration ? styles.expandableActive : ""}`}>
                    <input
                        className={styles.login__input}
                        type="text"
                        placeholder="Invite-Code"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                    />
                </div>

                <button className={styles.login__button} type="submit">
                    {showRegistration ? "Registrieren" : "Anmelden"}
                </button>
            </form>
        </div>
    );
}