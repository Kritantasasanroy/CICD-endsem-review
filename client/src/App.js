import { useEffect, useState } from 'react';
import { Link, Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Jobs from './pages/Jobs';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Messages from './pages/Messages';
import PostJob from './pages/PostJob';
import Proposals from './pages/Proposals';
import Register from './pages/Register';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <Router>
      <div className="App">
        {user && (
          <nav className="navbar">
            <h2>💼 Freelancer Marketplace</h2>
            <div className="nav-links">
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/jobs">Jobs</Link>
              {user.role === 'worker_seeker' && <Link to="/post-job">Post Job</Link>}
              <Link to="/proposals">Proposals</Link>
              <Link to="/messages">Messages</Link>
              <span className="user-info">{user.name}</span>
              <button onClick={handleLogout}>Logout</button>
            </div>
          </nav>
        )}
        
        <Routes>
          <Route path="/" element={!user ? <Landing /> : <Navigate to="/dashboard" />} />
          <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/" />} />
          <Route path="/jobs" element={user ? <Jobs user={user} /> : <Navigate to="/" />} />
          <Route path="/post-job" element={user?.role === 'worker_seeker' ? <PostJob /> : <Navigate to="/jobs" />} />
          <Route path="/proposals" element={user ? <Proposals user={user} /> : <Navigate to="/" />} />
          <Route path="/messages" element={user ? <Messages user={user} /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
