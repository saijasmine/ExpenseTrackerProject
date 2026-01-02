import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseTracker = () => {
  const { year, month } = useParams();
  const navigate = useNavigate();
  
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [formData, setFormData] = useState({ 
    amount: '', 
    category: 'food', 
    description: '' 
  });
  const [loading, setLoading] = useState(true);

  const categories = ['food', 'travel', 'emi', 'essentials', 'rent', 'savings', 'extras'];

  axios.defaults.withCredentials = true;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:8080/api/expenses');
      const data = res.data;

      const filtered = data.filter(t => {
        const d = new Date(t.createdAt);
        return d.getFullYear().toString() === year && 
               d.toLocaleString('default', { month: 'long' }) === month;
      });

      setTransactions(filtered);

      if (filtered.length > 0) {
        const lastEntry = filtered[filtered.length - 1];
        setIncome(lastEntry.currentTotalIncome || 0);
      } else {
        setIncome(0);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/auth');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [year, month]);

  const totalSpends = transactions
    .filter(t => t.type === 'EXPENSE')
    .reduce((acc, t) => acc + Number(t.amount), 0);

  const remainingMoney = income - totalSpends;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const amountNum = Number(formData.amount);

    if (!formData.amount || amountNum <= 0) {
      alert("Please enter a valid amount greater than 0.");
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/expenses', {
        amount: amountNum,
        description: formData.description ? `${formData.category}: ${formData.description}` : formData.category,
        type: 'EXPENSE',
        currentTotalIncome: income
      });
      setFormData({ amount: '', category: 'food', description: '' });
      fetchTransactions();
    } catch (err) {
      alert("Failed to save transaction.");
    }
  };

  const handleUpdateIncome = async () => {
    try {
      await axios.post('http://localhost:8080/api/expenses', {
        amount: 0,
        description: 'INCOME_UPDATE',
        type: 'SETTING',
        currentTotalIncome: income
      });
      alert("Income Updated!");
      fetchTransactions();
    } catch (err) {
      alert("Failed to update income.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this transaction?")) {
      try {
        await axios.delete(`http://localhost:8080/api/expenses/${id}`);
        fetchTransactions();
      } catch (err) {
        alert("Error deleting item.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout');
      navigate('/auth'); 
    } catch (err) {
      console.error("Logout failed");
    }
  };

  const hasExpenses = transactions.some(t => t.type === 'EXPENSE');
  const chartData = {
    labels: categories.map(cat => cat.toUpperCase()),
    datasets: [{
      data: categories.map(cat => 
        transactions
          .filter(t => t.description.toLowerCase().includes(cat) && t.type === 'EXPENSE')
          .reduce((acc, t) => acc + Number(t.amount), 0)
      ),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF'],
      borderWidth: 1,
    }]
  };

  return (
    <div className="container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate('/dashboard')} className="save-income-btn">← Back</button>
          <button onClick={handleLogout} className="save-income-btn" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5' }}>Logout</button>
        </div>
        <h1 style={{ fontSize: '1.8rem', margin: 0 }}>{month} {year}</h1>
      </header>
      
      <div className="dashboard-grid">
        <div className="card income">
          <h3>Total Income</h3>
          <div className="editable-input-wrapper" style={{ justifyContent: 'center', display: 'flex', gap: '5px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₹</span>
            <input 
              type="number" 
              value={income} 
              onChange={(e) => setIncome(Number(e.target.value))} 
              style={{ background: 'transparent', color: '#81c784', border: 'none', borderBottom: '1px dashed white', fontSize: '1.5rem', width: '120px', textAlign: 'center', outline: 'none' }} 
            />
            <button onClick={handleUpdateIncome} className="save-income-btn">Save</button>
          </div>
        </div>
        <div className="card spend"><h3>Spends</h3><p>₹{totalSpends}</p></div>
        <div className="card remaining"><h3>Remaining</h3><p>₹{remainingMoney}</p></div>
      </div>

      <div className="form-container">
        <h3>New Transaction</h3>
        <form onSubmit={handleSubmit} className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input 
                type="number" 
                placeholder="Amount" 
                value={formData.amount} 
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })} 
                required 
                min="1"
                style={{ flex: 1 }}
            />
            <select 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ flex: 1 }}
            >
                {categories.map(cat => <option key={cat} value={cat}>{cat.toUpperCase()}</option>)}
            </select>
          </div>
          
          <input 
            type="text" 
            placeholder="Notes (e.g. Dinner at McDs)" 
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
          />

          <button type="submit" style={{ width: '100%' }}>Add Entry</button>
        </form>
      </div>

      <div className="chart-section">
        {hasExpenses && (
          <>
            <h3>Expense Distribution</h3>
            <div style={{ width: '280px', height: '280px', margin: '0 auto 30px auto' }}>
              <Pie data={chartData} options={{ maintainAspectRatio: false }} />
            </div>
          </>
        )}

        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p style={{ opacity: 0.5, textAlign: 'center' }}>No history found.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
            <tbody>
              {/* REMOVED .reverse() HERE TO APPEND TO END */}
              {transactions.map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                  <td style={{ padding: '12px 5px' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>{t.description.toUpperCase()}</div>
                    <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{new Date(t.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold', color: t.type === 'SETTING' ? '#81c784' : 'white' }}>
                    ₹{t.amount === 0 ? t.currentTotalIncome : t.amount}
                  </td>
                  <td style={{ textAlign: 'right', width: '40px' }}>
                    <button 
                      onClick={() => handleDelete(t.id)} 
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                    >🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ExpenseTracker;