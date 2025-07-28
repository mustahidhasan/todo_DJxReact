// src/App.js
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './assets/css/App.css';
import Home from './components/Home';
import Login from './components/Login';
import Todo from './components/Todo';
import Register from './components/Register';
import { LogOut } from 'lucide-react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const tokens = JSON.parse(localStorage.getItem('tokens'));
    setIsAuthenticated(!!tokens?.access);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tokens');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav className="navbar">
          <ul>
            {isAuthenticated ? (
              <>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/todo">Todo</Link></li>
                <li className="logout-wrapper">
                  <button onClick={handleLogout} className="logout-button" title="Logout">
                    <LogOut size={20} />
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </nav>

        {/* Page Routes */}
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/todo"
            element={isAuthenticated ? <Todo /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/" />
              ) : (
                <Login onLogin={() => setIsAuthenticated(true)} />
              )
            }
          />
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
