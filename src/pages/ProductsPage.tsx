import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Product } from '../types';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getProducts({
        search: search || undefined,
        category: category || undefined,
        limit: 50,
      });
      setProducts(res.data.products);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Mahsulotlarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px' }}>Mahsulotlar</h1>
        <Link
          to="/products/create"
          style={{
            background: '#e94560',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: 500,
            fontSize: '14px',
          }}
        >
          + Yangi mahsulot
        </Link>
      </div>

      {/* Qidiruv va filter */}
      <form
        onSubmit={handleSearch}
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        }}
      >
        <input
          type="text"
          placeholder="Qidirish..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <input
          type="text"
          placeholder="Kategoriya"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: '180px',
            padding: '10px 14px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            background: '#1a1a2e',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: '8px',
            fontWeight: 500,
          }}
        >
          Qidirish
        </button>
      </form>

      {/* Xatolik */}
      {error && (
        <div style={{ background: '#fee', color: '#c00', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px' }}>
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <p style={{ color: '#666' }}>Yuklanmoqda...</p>
      ) : products.length === 0 ? (
        <p style={{ color: '#666' }}>Mahsulotlar topilmadi</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
              }}
            >
              <h3 style={{ marginBottom: '8px', fontSize: '16px' }}>{product.name}</h3>
              <p style={{ color: '#666', fontSize: '13px', marginBottom: '12px' }}>
                {product.description || 'Tavsif yo‘q'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '18px', color: '#e94560' }}>
                  {product.price.toLocaleString()} so‘m
                </span>
                <span
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: product.quantity > 0 ? '#e8f5e9' : '#ffebee',
                    color: product.quantity > 0 ? '#2e7d32' : '#c62828',
                  }}
                >
                  {product.quantity > 0 ? `${product.quantity} dona` : 'Tugagan'}
                </span>
              </div>
              <div style={{ marginTop: '12px', fontSize: '13px', color: '#888' }}>
                Kategoriya: {product.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;