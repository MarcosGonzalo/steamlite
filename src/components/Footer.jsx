import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#101216',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '36px 24px 24px',
      color: '#8f98a0',
      fontSize: '13px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1240px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '20px'
      }}>
        {/* Brand & info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontSize: '18px' }}>🎮</span>
            <span style={{ color: '#fff', fontWeight: '800', fontSize: '15px' }}>SteamLite</span>
            <span style={{
              backgroundColor: '#2a475e',
              color: '#66c0f4',
              fontSize: '10px',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              v2.0
            </span>
          </div>
          <p style={{ margin: 0, maxWidth: '420px', lineHeight: '1.4' }}>
            Proyecto Integrador Frontend — Plataforma SPA de distribución digital, simulación de pasarela de pago y mini-juegos integrados.
          </p>
        </div>

        {/* Tech Stack Badges */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['Vite', 'React 19', 'React Router v7', 'Formik + Yup', 'Context API', 'HTML5 Canvas'].map(tech => (
            <span
              key={tech}
              style={{
                backgroundColor: '#171a21',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#c7d5e0',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: '600'
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div style={{
        maxWidth: '1240px',
        margin: '24px auto 0',
        paddingTop: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px'
      }}>
        <span>© 2026 SteamLite. Desarrollado con fines educativos y de demostración técnica.</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <Link to="/" style={{ color: '#66c0f4' }}>Catálogo</Link>
          <Link to="/library" style={{ color: '#66c0f4' }}>Biblioteca</Link>
          <Link to="/cart" style={{ color: '#66c0f4' }}>Carrito</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
