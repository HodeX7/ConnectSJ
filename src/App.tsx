import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Resources from './pages/Resources';
import Incentives from './pages/Incentives';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Jobs from './pages/Jobs';
import Chatbot from './components/ChatBot';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import LanguageSelector from './components/LanguageSelector';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  let chat_token = import.meta.env.VITE_CHATBOT_API_KEY;
  // console.log(chat_token)

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  // Determine if we should show language selector (not on login/signup)
  const showLanguageSelector = !location.pathname.includes('/login') && 
    !location.pathname.includes('/signup');

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {showLanguageSelector && (
        <div className="fixed top-4 right-4 z-50">
          <LanguageSelector />
          <Chatbot token={chat_token}/>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route 
            path="/" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Navigate to="/login" replace />
            } 
          />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/signup" 
            element={
              isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Signup onSignup={handleLogin} />
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resources" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Resources />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/incentives" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Incentives />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/rewards" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Rewards />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Jobs />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App