import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      // Handle Validation Errors (400 Bad Request)
      if (response.status === 400) {
        setMessage("Password too weak! Use 8+ chars, uppercase, numbers & symbols.");
        setLoading(false);
        return;
      }

      const data = await response.text();

      if (response.ok) {
        setMessage(isLogin ? "Login Successful! Redirecting..." : "Account Created! Please login.");
        
        if (isLogin) {
          setTimeout(() => {
            navigate('/dashboard');
          }, 1000);
        } else {
          setTimeout(() => {
            setIsLogin(true);
            setLoading(false);
            setFormData({ email: '', password: '' }); // Clear form
          }, 2000);
        }
      } else {
        // Handle other errors (401 Unauthorized, etc.)
        setMessage(data || "Invalid credentials. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setMessage("Cannot connect to server. Is Spring Boot running on port 8080?");
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? 'Welcome Back' : 'Mindful Spends'}</h2>
        <p style={{ fontSize: '14px', marginBottom: '20px', color: 'rgba(255,255,255,0.8)' }}>
          {isLogin ? 'Enter your details to access your tracker' : 'Register to start tracking your spends'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              value={formData.password}
              onChange={handleChange} 
              required 
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        
        <p className="toggle-text" onClick={() => { setIsLogin(!isLogin); setMessage(''); }}>
          {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
        </p>
        
        {message && (
          <div className={`message-box ${message.includes('Successful') || message.includes('Created') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;