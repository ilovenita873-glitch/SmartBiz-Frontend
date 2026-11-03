import { useEffect, useState } from 'react';
import { getStatistics } from '../services/api';
import { Statistics } from '../types';

const StatisticsPage = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStatistics()
      .then((res) => setStats(res))
      .catch((err) =>
        setError(err.response?.data?.message || 'Statistikani yuklashda xatolik')
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="center-state">
        <div className="spinner" />
        <span>Yuklanmoqda...</span>
      </div>
    );

  if (error) return <div className="alert alert-error">{error}</div>;
  if (!stats) return null;

  const cards = [
    { label: 'Jami mahsulotlar', value: stats.products.total, icon: '📦', color: '#1a1a2e', bg: '#e8e8f2' },
    { label: 'Faol mahsulotlar', value: stats.products.active, icon: '✅', color: '#2e7d32', bg: '#e8f5e9' },
    { label: 'Jami buyurtmalar', value: stats.orders.total, icon: '🧾', color: '#1565c0', bg: '#e3f0fc' },
    {
      label: 'Jami savdo',
      value: `${stats.sales.totalRevenue.toLocaleString()} so‘m`,
      icon: '💰',
      color: '#e94560',
      bg: '#fdecef',
    },
    {
      label: 'O‘rtacha chek',
      value: `${stats.sales.averageOrderValue.toLocaleString()} so‘m`,
      icon: '📈',
      color: '#6a1b9a',
      bg: '#f3e5f9',
    },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Statistika</h1>
          <p className="page-subtitle">Do‘kon bo‘yicha umumiy ko‘rsatkichlar</p>
        </div>
      </div>

      <div className="stats-grid">
        {cards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-icon" style={{ background: card.bg }}>
              {card.icon}
            </div>
            <div>
              <div className="stat-label">{card.label}</div>
              <div className="stat-value" style={{ color: card.color }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-title">🏆 Eng ko‘p sotilgan mahsulotlar</h2>

      {stats.topProducts.length === 0 ? (
        <div className="center-state card">
          <div className="empty-icon">📊</div>
          <span>Hali ma’lumot yo‘q</span>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Mahsulot</th>
                <th>Sotilgan</th>
                <th>Daromad</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((item, index) => (
                <tr key={item.productId}>
                  <td>
                    <span className={`rank${index < 3 ? ' top' : ''}`}>{index + 1}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td>{item.totalSold} dona</td>
                  <td className="price" style={{ fontSize: 14 }}>
                    {item.totalRevenue.toLocaleString()} so‘m
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StatisticsPage;