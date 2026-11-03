import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProduct } from '../services/api';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    category: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.name || !form.price || !form.quantity || !form.category) {
      setError('Barcha majburiy maydonlarni to‘ldiring');
      return;
    }

    try {
      setLoading(true);
      await createProduct({
        name: form.name,
        description: form.description || undefined,
        price: Number(form.price),
        quantity: Number(form.quantity),
        category: form.category,
      });
      setSuccess(true);
      setForm({ name: '', description: '', price: '', quantity: '', category: '' });
      setTimeout(() => navigate('/products'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mahsulot qo‘shishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>Yangi mahsulot qo‘shish</h1>

      <form
        onSubmit={handleSubmit}
        style={{
          background: 'white',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          maxWidth: '560px',
        }}
      >
        {error && (
          <div style={{ background: '#fee', color: '#c00', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
            Mahsulot muvaffaqiyatli qo‘shildi! Yo‘naltirilmoqda...
          </div>
        )}

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Nomi *
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Mahsulot nomi"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Tavsif
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Qisqacha tavsif"
            rows={3}
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
              Narxi (so‘m) *
            </label>
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
              Miqdori *
            </label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0"
              min="0"
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 500, fontSize: '14px' }}>
            Kategoriya *
          </label>
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Masalan: Elektronika"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            background: loading ? '#999' : '#e94560',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '8px',
            fontWeight: 600,
            fontSize: '15px',
          }}
        >
          {loading ? 'Saqlanmoqda...' : 'Mahsulot qo‘shish'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;