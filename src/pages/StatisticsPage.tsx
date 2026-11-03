import { useEffect, useState } from 'react';
import { getStatistics } from '../services/api';
import { Statistics } from '../types';

const StatisticsPage = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getStatistics()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Statistikani yuklashda xatolik'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: '#666' }}>Yuklanmoqda...</p>;
  if (error) return <div style={{ background: '#fee', color: '#c00', padding: '12px 16px', borderRadius: '8px' }}>{error}</div>;
  if (!stats) return null;

  const cards = [
    { label: 'Jami mahsulotlar', value: stats.products.total, color: '#1a1a2e' },
    { label: 'Faol mahsulotlar', value: stats.products.active, color: '#2e7d32' },
    { label: 'Jami buyurtmalar', value: stats.orders.total, color: '#1565c0' },
    { label: 'Jami savdo', value: `${stats.sales.totalRevenue.toLocaleString()} so‘m`, color: '#e94560' },
    { label: 'O‘rtacha chek', value: `${stats.sales.averageOrderValue.toLocaleString()} so‘m`, color: '#6a1b9a' },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>Statistika</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            }}
          >
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>{card.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: card.color }}>{card.value}</div>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: '16px', fontSize: '20px' }}>Eng ko‘p sotilgan mahsulotlar</h2>

      {stats.topProducts.length === 0 ? (
        <p style={{ color: '#666' }}>Hali ma’lumot yo‘q</p>
      ) : (
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            overflow: 'hidden',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f5f7fa', textAlign: 'left' }}>
                <th style={{ padding: '14px 20px' }}>#</th>
                <th style={{ padding: '14px 20px' }}>Mahsulot</th>
                <th style={{ padding: '14px 20px' }}>Sotilgan</th>
                <th style={{ padding: '14px 20px' }}>Daromad</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((item, index) => (
                <tr key={item.productId} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '14px 20px', color: '#888' }}>{index + 1}</td>
                  <td style={{ padding: '14px 20px', fontWeight: 500 }}>{item.name}</td>
                  <td style={{ padding: '14px 20px' }}>{item.totalSold} dona</td>
                  <td style={{ padding: '14px 20px', color: '#e94560', fontWeight: 600 }}>
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