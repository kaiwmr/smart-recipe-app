import { useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import RecipeDetail from './components/RecipeDetail/RecipeDetail';
import './App.css';
import { ToastContainer } from "react-toastify"

function PrivateRoute({ children }) {
  const token = localStorage.getItem("BiteWiseToken");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  // Globaler Interceptor: Überwacht alle Anfragen auf 401 (Unauthorized)
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response, // Erfolgreiche Antworten einfach durchlassen
      (error) => {
        if (error.response && error.response.status === 401) {
          handleLogout(); // Automatisch ausloggen
        }
        return Promise.reject(error); // Fehler weiterwerfen, damit Komponenten ihn auch bemerken
      }
    );
    return () => axios.interceptors.response.eject(interceptor); // Aufräumen
  }, []);

  const handleLogout = () => {
      localStorage.removeItem("BiteWiseToken");
      window.location.href = "/login"; // Harter Redirect beim Auto-Logout
  };

  return (
    <div>
      <ToastContainer 
        position="bottom-center"
        autoClose={2500}         // 2 Sekunden sichtbar
        hideProgressBar           // keine Fortschrittsbar
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        newestOnTop={false}
        toastClassName="app__toast"
      />

      <Routes>
        {/* Route 1: Login (Jeder darf hin) */}
        <Route path="/login" element={<Login />} />

        {/* Route 2: Dashboard (Geschützt!) */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* Route 3: Detailansicht (Geschützt!) 
            :id ist ein Platzhalter für die Nummer (z.B. 5) */}
        <Route 
          path="/recipe/:id" 
          element={
            <PrivateRoute>
              <RecipeDetail />
            </PrivateRoute>
          } 
        />

        {/* Route 4: Alles andere -> Geh zum Dashboard (das leitet ggf. zum Login weiter) */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
