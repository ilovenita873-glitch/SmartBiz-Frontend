import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email va parolni kiriting');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      navigate('/products');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kirishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#f4f6fb',
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 400,
          background: 'white',
          padding: 32,
          borderRadius: 14,
          boxShadow: '0 4px 20px rgba(20,24,50,0.1)',
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
          Smart<span style={{ color: '#e94560' }}>Biz</span>
        </h1>
        <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
          Tizimga kirish
        </p>

        {error && (
          <div
            style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@smartbiz.uz"
          style={{
            width: '100%',
            padding: '11px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 14,
            marginBottom: 16,
            outline: 'none',
          }}
        />

        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          Parol
        </label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: '100%',
            padding: '11px 14px',
            border: '1px solid #e5e7eb',
            borderRadius: 10,
            fontSize: 14,
            marginBottom: 24,
            outline: 'none',
          }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: 13,
            background: loading ? '#b9bdc9' : '#e94560',
            color: 'white',
            border: 'none',
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 15,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Kirilmoqda...' : 'Kirish'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;