import { Link, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          background: '#1a1a2e',
          color: 'white',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ fontWeight: 700, fontSize: '20px' }}>SmartBiz</div>

        <nav style={{ display: 'flex', gap: '8px' }}>
          <Link
            to="/products"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: isActive('/products') || isActive('/') ? '#e94560' : 'transparent',
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Mahsulotlar
          </Link>
          <Link
            to="/products/create"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: isActive('/products/create') ? '#e94560' : 'transparent',
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Yangi mahsulot
          </Link>
          <Link
            to="/orders/create"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: isActive('/orders/create') ? '#e94560' : 'transparent',
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Buyurtma yaratish
          </Link>
          <Link
            to="/statistics"
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: isActive('/statistics') ? '#e94560' : 'transparent',
              color: 'white',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Statistika
          </Link>
        </nav>
      </header>

      <main style={{ flex: 1, padding: '24px', maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
