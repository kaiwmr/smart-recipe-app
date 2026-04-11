import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css'
import logo from "../../assets/BiteWiseLogo.svg";
import api from '../../api/api';
import { loginUser } from '../../utils/auth';

export default function Login() {
    // --- State Management --------------------
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [inviteCode, setInviteCode] = useState<string>("");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showRegistration, setShowRegistration] = useState<boolean>(false);
    const navigate = useNavigate();

    // --- Authentication Logic ----------------

    /** * Login: Sends data as FormData to comply with OAuth2 standards 
     */
    const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("username", email);
        formData.append("password", password);

        try {
            await api.post("/token", formData);
            loginUser();
            navigate("/dashboard");
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Login ist schiefgelaufen");
        }
    };

    /** * Registration: Sends user data as JSON object 
     */
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
            setShowRegistration(false);
        } catch (error) {
            console.error("Registration error:", error);
            toast.error("Registrierung ist schiefgelaufen");
        }
    };

    const PasswordIcon = showPassword ? Eye : EyeOff;

    // --- Rendering ---------------------------
    return (
        <div className={styles.login}>
            <form className={styles.login__box} onSubmit={showRegistration ? handleRegistration : handleLogin}>
                <img className={styles.login__logo} src={logo} alt="BiteWise Logo" />

                <h3>{showRegistration ? "Konto erstellen" : "Willkommen zurück!"}</h3>

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

                <input
                    className={styles.login__input}
                    type="email"
                    placeholder="E-Mail-Adresse"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

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