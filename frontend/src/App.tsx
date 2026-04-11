import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import RecipeDetail from './components/RecipeDetail/RecipeDetail';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';
import { ToastContainer } from "react-toastify"


// HAUPTKOMPONENTE: App
export default function App() {

  return (
    <div>
      
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

        {/* --- GESCHÜTZTE ROUTE: Rezept-Details --- */}
        <Route 
          path="/recipe/:id" 
          element={
            <PrivateRoute>
              <RecipeDetail />
            </PrivateRoute>
          } 
        />

        {/* --- FALLBACK-ROUTE (404 Handling) --- */}
        <Route path="*" element={<Navigate to="/dashboard" />} />

      </Routes>
    </div>
  );
}