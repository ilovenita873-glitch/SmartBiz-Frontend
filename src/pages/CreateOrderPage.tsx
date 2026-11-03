import { useEffect, useState, FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, createOrder } from '../services/api';
import { Product } from '../types';

interface CartItem {
  product: Product;
  quantity: number;
}

const CreateOrderPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getProducts({ limit: 100 })
      .then((res) => setProducts(res.data.products.filter((p: Product) => p.quantity > 0)))
      .catch(() => setError('Mahsulotlarni yuklashda xatolik'));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.product._id === product._id);
      if (exists) {
        return prev.map((item) =>
          item.product._id === product._id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: Math.max(1, Math.min(qty, item.product.quantity)) }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!customerName.trim()) {
      setError('Mijoz ismini kiriting');
      return;
    }
    if (cart.length === 0) {
      setError('Kamida 1 ta mahsulot tanlang');
      return;
    }

    try {
      setLoading(true);
      await createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim() || undefined,
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
      });
      setSuccess(true);
      setTimeout(() => navigate('/statistics'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Buyurtma yaratishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: '24px', fontSize: '28px' }}>Buyurtma yaratish</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '24px' }}>
        <div>
          <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Mahsulotlar</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {products.map((product) => (
              <div
                key={product._id}
                onClick={() => addToCart(product)}
                style={{ background: 'white', borderRadius: '10px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer' }}
              >
                <div style={{ fontWeight: 600, marginBottom: '4px' }}>{product.name}</div>
                <div style={{ color: '#e94560', fontWeight: 700 }}>{product.price.toLocaleString()} so‘m</div>
                <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>Qoldiq: {product.quantity}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', height: 'fit-content', position: 'sticky', top: '24px' }}>
          <h2 style={{ marginBottom: '16px', fontSize: '18px' }}>Savat</h2>

          {error && (
            <div style={{ background: '#fee', color: '#c00', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#e8f5e9', color: '#2e7d32', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>
              Buyurtma yaratildi!
            </div>
          )}

          {cart.length === 0 ? (
            <p style={{ color: '#999', fontSize: '14px', marginBottom: '16px' }}>Savat bo‘sh</p>
          ) : (
            <div style={{ marginBottom: '16px' }}>
              {cart.map((item) => (
                <div key={item.product._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', fontSize: '14px' }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{item.product.name}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>{item.product.price.toLocaleString()} × {item.quantity}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      max={item.product.quantity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => updateQuantity(item.product._id, Number(e.target.value))}
                      style={{ width: '50px', padding: '4px 6px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
                    />
                    <button type="button" onClick={() => removeFromCart(item.product._id)} style={{ background: 'none', border: 'none', color: '#c00', fontSize: '16px', cursor: 'pointer' }}>
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #eee', paddingTop: '12px', fontWeight: 700, fontSize: '16px' }}>
                Jami: {totalAmount.toLocaleString()} so‘m
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Mijoz ismi *</label>
              <input
                value={customerName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                placeholder="Ism Familya"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500 }}>Telefon</label>
              <input
                value={customerPhone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              style={{
                width: '100%',
                background: loading || cart.length === 0 ? '#999' : '#e94560',
                color: 'white',
                border: 'none',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Yaratilmoqda...' : 'Buyurtma berish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderPage;