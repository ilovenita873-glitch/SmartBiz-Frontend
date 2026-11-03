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
      <div className="page-header">
        <div>
          <h1 className="page-title">Yangi mahsulot</h1>
          <p className="page-subtitle">Omborga yangi mahsulot qo‘shish</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card" style={{ maxWidth: 600, padding: 32 }}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && (
          <div className="alert alert-success">
            ✅ Mahsulot muvaffaqiyatli qo‘shildi! Yo‘naltirilmoqda...
          </div>
        )}

        <div className="field">
          <label className="label">Nomi *</label>
          <input
            className="input"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Mahsulot nomi"
          />
        </div>

        <div className="field">
          <label className="label">Tavsif</label>
          <textarea
            className="textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Qisqacha tavsif"
            rows={3}
          />
        </div>

        <div className="form-grid-2">
          <div className="field">
            <label className="label">Narxi (so‘m) *</label>
            <input
              className="input"
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          <div className="field">
            <label className="label">Miqdori *</label>
            <input
              className="input"
              name="quantity"
              type="number"
              min="0"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
        </div>

        <div className="field" style={{ marginBottom: 24 }}>
          <label className="label">Kategoriya *</label>
          <input
            className="input"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Masalan: Elektronika"
          />
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary btn-block">
          {loading ? 'Saqlanmoqda...' : 'Mahsulot qo‘shish'}
        </button>
      </form>
    </div>
  );
};

export default CreateProductPage;