import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Importaremos los componentes temporalmente (asegúrate de que los archivos existan)
// Más adelante los llenaremos con su diseño real.
import Navbar from './components/Navbar';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import Cart from './pages/Cart';
import Library from './pages/Library';
import Play from './pages/Play';

function App() {
  return (
    <BrowserRouter>
      {/* El Navbar va fuera de Routes para que se vea en toda la plataforma */}
      <Navbar /> 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game/:id" element={<GameDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/library" element={<Library />} />
        <Route path="/play/:id" element={<Play />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;