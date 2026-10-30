import { NavLink } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

const Navbar = () => {
  const { cartCount, libraryCount } = useShop();

  return (
    <nav style={{
      backgroundColor: '#171a21',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Brand & Left Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <NavLink 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            textDecoration: 'none',
            color: '#fff'
          }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1b2838 0%, #66c0f4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 12px rgba(102, 192, 244, 0.4)',
            fontSize: '18px'
          }}>
            🎮
          </div>
          <span style={{ 
            fontWeight: '800', 
            fontSize: '1.25rem', 
            letterSpacing: '0.5px',
            background: 'linear-gradient(90deg, #ffffff, #66c0f4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            SteamLite
          </span>
        </NavLink>

        {/* Navigation Items */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <NavLink 
            to="/" 
            end
            style={({ isActive }) => ({
              color: isActive ? '#fff' : '#c7d5e0',
              fontWeight: isActive ? '600' : '400',
              padding: '8px 14px',
              borderRadius: '4px',
              backgroundColor: isActive ? '#2a475e' : 'transparent',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s'
            })}
          >
            <span>🛍️</span> Tienda
          </NavLink>

          <NavLink 
            to="/library" 
            style={({ isActive }) => ({
              color: isActive ? '#fff' : '#c7d5e0',
              fontWeight: isActive ? '600' : '400',
              padding: '8px 14px',
              borderRadius: '4px',
              backgroundColor: isActive ? '#2a475e' : 'transparent',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background-color 0.2s'
            })}
          >
            <span>📚</span> Mi Biblioteca
            {libraryCount > 0 && (
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#fff',
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '10px',
                fontWeight: '600'
              }}>
                {libraryCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* Right Side - Cart */}
      <div>
        <NavLink 
          to="/cart" 
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: isActive ? '#5c7e10' : '#2a475e',
            color: '#fff',
            padding: '8px 16px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s ease',
            boxShadow: cartCount > 0 ? '0 0 10px rgba(102, 192, 244, 0.25)' : 'none'
          })}
        >
          <span>🛒</span>
          <span>Carrito</span>
          {cartCount > 0 ? (
            <span style={{
              backgroundColor: '#5c7e10',
              border: '1px solid rgba(255,255,255,0.3)',
              color: '#d2efa9',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '12px',
              fontWeight: '700'
            }}>
              {cartCount}
            </span>
          ) : (
            <span style={{ color: '#8f98a0', fontSize: '12px' }}>(0)</span>
          )}
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
