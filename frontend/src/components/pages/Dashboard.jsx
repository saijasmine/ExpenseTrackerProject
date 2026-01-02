// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// axios.defaults.withCredentials = true;

// const Dashboard = () => {
//   const [data, setData] = useState({});
//   const [selectedYear, setSelectedYear] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await axios.get('http://localhost:8080/api/expenses');
//         const rawData = Array.isArray(res.data) ? res.data : [];

//         // Safety: Always start with current month/year
//         const now = new Date();
//         const curYear = now.getFullYear().toString();
//         const curMonth = now.toLocaleString('default', { month: 'long' });
//         const initialData = { [curYear]: new Set([curMonth]) };

//         const grouped = rawData.reduce((acc, item) => {
//           if (!item.createdAt) return acc;
//           const date = new Date(item.createdAt);
//           const year = date.getFullYear().toString();
//           const month = date.toLocaleString('default', { month: 'long' });
//           if (!acc[year]) acc[year] = new Set();
//           acc[year].add(month);
//           return acc;
//         }, initialData);

//         setData(grouped);
//       } catch (err) {
//         if (err.response?.status === 401) navigate('/auth');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, [navigate]);

//   if (loading) return <div className="container"><h2>Loading...</h2></div>;

//   const years = Object.keys(data).sort((a, b) => b - a);

//   return (
//     <div className="container" style={{ padding: '20px' }}>
//       <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
//         <h1 style={{ color: 'white' }}>Archives</h1>
//         <button onClick={() => navigate('/auth')} className="save-income-btn">Logout</button>
//       </header>

//       {!selectedYear ? (
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
//           {years.map(year => (
//             <div key={year} className="card" onClick={() => setSelectedYear(year)} style={{ cursor: 'pointer', background: '#2c2c2c', padding: '30px', textAlign: 'center', borderRadius: '15px', color: 'white' }}>
//               <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{year}</p>
//               <span style={{ color: '#81c784' }}>View Months →</span>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div>
//           <button onClick={() => setSelectedYear(null)} className="save-income-btn" style={{ marginBottom: '20px' }}>← Back</button>
//           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
//             {[...data[selectedYear]].map(month => (
//               <div key={month} className="card" onClick={() => navigate(`/tracker/${selectedYear}/${month}`)} style={{ cursor: 'pointer', background: '#2c2c2c', padding: '25px', borderLeft: '5px solid #81c784', borderRadius: '10px', color: 'white' }}>
//                 <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{month}</p>
//                 <span>Open Tracker</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

axios.defaults.withCredentials = true;

const Dashboard = () => {
  const [data, setData] = useState({});
  const [selectedYear, setSelectedYear] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:8080/api/expenses');
        const rawData = Array.isArray(res.data) ? res.data : [];

        const now = new Date();
        const curYear = now.getFullYear().toString();
        const curMonth = now.toLocaleString('default', { month: 'long' });
        const initialData = { [curYear]: new Set([curMonth]) };

        const grouped = rawData.reduce((acc, item) => {
          if (!item.createdAt) return acc;
          const date = new Date(item.createdAt);
          const year = date.getFullYear().toString();
          const month = date.toLocaleString('default', { month: 'long' });
          if (!acc[year]) acc[year] = new Set();
          acc[year].add(month);
          return acc;
        }, initialData);

        setData(grouped);
      } catch (err) {
        if (err.response?.status === 401) navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2 style={{ color: 'rgba(255,255,255,0.6)', fontWeight: '300' }}>Syncing your archives...</h2>
      </div>
    );
  }

  const years = Object.keys(data).sort((a, b) => b - a);

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '50px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
        <div>
          <h1 style={{ color: 'white', margin: 0, fontSize: '2.5rem', fontWeight: '700' }}>
            Financial <span style={{ color: '#81c784' }}>Archives</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '5px' }}>
            {selectedYear ? `Viewing months for ${selectedYear}` : 'Select a year to review your spending'}
          </p>
        </div>
        <button 
          onClick={() => navigate('/auth')} 
          style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff6b6b', border: '1px solid rgba(255, 68, 68, 0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', transition: '0.3s' }}
          onMouseOver={(e) => e.target.style.background = 'rgba(255, 68, 68, 0.2)'}
          onMouseOut={(e) => e.target.style.background = 'rgba(255, 68, 68, 0.1)'}
        >
          Logout
        </button>
      </header>

      {!selectedYear ? (
        /* YEAR GRID */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
          {years.map(year => (
            <div 
              key={year} 
              className="card" 
              onClick={() => setSelectedYear(year)} 
              style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.03)', padding: '40px 20px', textAlign: 'center', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)', transition: 'transform 0.3s, border-color 0.3s', position: 'relative', overflow: 'hidden' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.borderColor = '#81c784'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(90deg, transparent, #81c784, transparent)' }}></div>
              <h3 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '10px' }}>Yearly Summary</h3>
              <p style={{ fontSize: '3.5rem', fontWeight: '800', color: 'white', margin: '0' }}>{year}</p>
              <div style={{ marginTop: '20px', color: '#81c784', fontWeight: '500', fontSize: '0.9rem' }}>View Timeline →</div>
            </div>
          ))}
        </div>
      ) : (
        /* MONTH GRID */
        <div>
          <button 
            onClick={() => setSelectedYear(null)} 
            style={{ marginBottom: '30px', background: 'transparent', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.2)', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            ← Back to Years
          </button>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {[...data[selectedYear]].map(month => (
              <div 
                key={month} 
                className="card" 
                onClick={() => navigate(`/tracker/${selectedYear}/${month}`)} 
                style={{ cursor: 'pointer', background: 'rgba(129, 199, 132, 0.05)', padding: '30px', borderRadius: '16px', border: '1px solid rgba(129, 199, 132, 0.15)', textAlign: 'left', transition: '0.3s' }}
                onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(129, 199, 132, 0.1)'; e.currentTarget.style.borderColor = '#81c784'; }}
                onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(129, 199, 132, 0.05)'; e.currentTarget.style.borderColor = 'rgba(129, 199, 132, 0.15)'; }}
              >
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '5px' }}>{selectedYear}</p>
                <p style={{ fontSize: '1.8rem', fontWeight: '700', color: 'white', margin: '0' }}>{month}</p>
                <div style={{ width: '30px', height: '2px', background: '#81c784', marginTop: '15px' }}></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;