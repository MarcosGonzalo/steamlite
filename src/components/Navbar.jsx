import { Link } from 'react-router-dom';
const Navbar = () => (
  <nav style={{ backgroundColor: '#171a21', padding: '15px', color: 'white' }}>
    <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Inicio</Link>
  </nav>
);
export default Navbar;