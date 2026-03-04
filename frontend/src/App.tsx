import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import Dashboard from './components/Dashboard/Dashboard';
import RecipeDetail from './components/RecipeDetail/RecipeDetail';
import PrivateRoute from './components/PrivateRoute/PrivateRoute';
import './App.css';
import { ToastContainer } from "react-toastify"


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
      {/* Route 1: Login */}
      <Route path="/login" element={<Login />} />

      {/* Route 2: Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />

      {/* Route 3: Detailansicht 
          :id ist ein Platzhalter für die Nummer */}
      <Route 
        path="/recipe/:id" 
        element={
          <PrivateRoute>
            <RecipeDetail />
          </PrivateRoute>
        } 
      />

      {/* Route 4: Alles andere -> Geh zum Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  </div>
);
}
