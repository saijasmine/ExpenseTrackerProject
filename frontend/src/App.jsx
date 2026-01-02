import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/pages/Auth';
import Dashboard from './components/pages/Dashboard';
import ExpenseTracker from './components/pages/ExpenseTracker';
import './index.css';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tracker/:year/:month" element={<ExpenseTracker />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default App;