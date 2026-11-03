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
      <div className="page-header">
        <div>
          <h1 className="page-title">Buyurtma yaratish</h1>
          <p className="page-subtitle">Mahsulotni bosib savatga qo‘shing</p>
        </div>
      </div>

      <div className="order-layout">
        <div>
          <h2 className="section-title">Mahsulotlar</h2>
          {products.length === 0 && !error ? (
            <div className="center-state">
              <div className="empty-icon">📭</div>
              <span>Sotuvga tayyor mahsulot yo‘q</span>
            </div>
          ) : (
            <div className="pick-grid">
              {products.map((product) => {
                const selected = cart.some((i) => i.product._id === product._id);
                return (
                  <button
                    type="button"
                    key={product._id}
                    onClick={() => addToCart(product)}
                    className={`pick-card${selected ? ' selected' : ''}`}
                  >
                    <div className="pick-name">{product.name}</div>
                    <div className="price" style={{ fontSize: 16 }}>
                      {product.price.toLocaleString()} so‘m
                    </div>
                    <div className="pick-stock">Qoldiq: {product.quantity}</div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="card cart">
          <h2 className="section-title">🛒 Savat</h2>

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">✅ Buyurtma yaratildi!</div>}

          {cart.length === 0 ? (
            <div className="cart-empty">Savat bo‘sh</div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.product._id} className="cart-item">
                  <div>
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-meta">
                      {item.product.price.toLocaleString()} × {item.quantity}
                    </div>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      min={1}
                      max={item.product.quantity}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateQuantity(item.product._id, Number(e.target.value))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="remove"
                      onClick={() => removeFromCart(item.product._id)}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              <div className="cart-total">
                <span>Jami:</span>
                <span className="price">{totalAmount.toLocaleString()} so‘m</span>
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
            <div className="field">
              <label className="label">Mijoz ismi *</label>
              <input
                className="input"
                value={customerName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerName(e.target.value)}
                placeholder="Ism Familya"
              />
            </div>

            <div className="field">
              <label className="label">Telefon</label>
              <input
                className="input"
                value={customerPhone}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCustomerPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
              />
            </div>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="btn btn-primary btn-block"
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