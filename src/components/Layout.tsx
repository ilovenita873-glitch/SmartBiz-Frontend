import { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

const links = [
  { to: '/products', label: 'Mahsulotlar' },
  { to: '/products/create', label: 'Yangi mahsulot' },
  { to: '/orders/create', label: 'Buyurtma yaratish' },
  { to: '/statistics', label: 'Statistika' },
];

const Layout = ({ children }: { children?: ReactNode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header style={{ background: '#1a1a2e', boxShadow: '0 2px 12px rgba(0,0,0,0.18)' }}>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <NavLink to="/products" style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>
            SmartBiz
          </NavLink>

          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                style={({ isActive }) => ({
                  padding: '9px 14px',
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: 500,
                  color: 'white',
                  background: isActive ? '#e94560' : 'transparent',
                })}
              >
                {link.label}
              </NavLink>
            ))}

            <button
              type="button"
              onClick={handleLogout}
              style={{
                marginLeft: 8,
                padding: '9px 14px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'transparent',
                color: '#ffb3c0',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Chiqish
            </button>
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px 64px' }}>
        {children ?? <Outlet />}
      </main>
    </>
  );
};

export default Layout;