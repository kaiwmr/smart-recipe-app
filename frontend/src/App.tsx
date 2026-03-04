import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import RecipeDetail from './components/RecipeDetail/RecipeDetail';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';
import { ToastContainer } from "react-toastify"

/**
 * ==========================================
 * HAUPTKOMPONENTE: App
 * ==========================================
 * Routing der gesamten Anwendung definieren.
 */
export default function App() {

  return (
    <div>
      {/* KONFIGURATION DER BENACHRICHTIGUNGEN (Toastify)
        Zentrale Steuerung für alle Erfolgs- und Fehlermeldungen in der App.
      */}
      <ToastContainer 
        position="bottom-center"
        autoClose={2500}         
        hideProgressBar          
        closeOnClick
        pauseOnHover={false}
        draggable={false}
        newestOnTop={false}
        toastClassName="app__toast"
      />

      {/* ROUTING-LOGIK 
        Hier werden die verschiedenen URLs der App definiert.
      */}
      <Routes>
        
        {/* --- ÖFFENTLICHE ROUTE: Login --- */}
        <Route path="/login" element={<Login />} />

        {/* --- GESCHÜTZTE ROUTE: Dashboard --- */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />

        {/* --- GESCHÜTZTE ROUTE: Rezept-Details --- 
          Der Parameter ':id' wird dynamisch aus der URL extrahiert (z.B. /recipe/42).
        */}
        <Route 
          path="/recipe/:id" 
          element={
            <PrivateRoute>
              <RecipeDetail />
            </PrivateRoute>
          } 
        />

        {/* --- FALLBACK-ROUTE (404 Handling) --- 
          Jede unbekannte URL leitet automatisch zum Dashboard weiter.
        */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </div>
  );
}