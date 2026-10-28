import { useState, useEffect } from 'react';

import { useParams, useNavigate, Link } from 'react-router-dom';



const GameDetail = () => {

 const { id } = useParams();

 const navigate = useNavigate();

 const [game, setGame] = useState(null);



 useEffect(() => {

  fetch('/games.json')

   .then(res => res.json())

   .then(data => setGame(data.find(g => g.id === id)));

 }, [id]);



 const addToCart = () => {

  const currentCart = JSON.parse(localStorage.getItem('steamlite_cart')) || [];

  // Evitar duplicados en el carrito

  if (!currentCart.find(item => item.id === game.id)) {

   localStorage.setItem('steamlite_cart', JSON.stringify([...currentCart, game]));

  }

  navigate('/cart');

 };



 if (!game) return <h2 style={{ color: 'white', textAlign: 'center' }}>Cargando...</h2>;



 return (

  <div style={{ backgroundColor: '#171a21', minHeight: '100vh', padding: '40px', color: '#c7d5e0' }}>

   <Link to="/" style={{ color: '#66c0f4', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>← Volver</Link>

   <div style={{ display: 'flex', gap: '30px', backgroundColor: '#1a1a1a', padding: '30px', borderRadius: '8px' }}>

    <img src={game.imageUrl} alt={game.title} style={{ width: '400px', borderRadius: '4px' }} />

    <div>

     <h1 style={{ color: 'white', margin: '0 0 10px 0' }}>{game.title}</h1>

     <p style={{ color: '#66c0f4', fontWeight: 'bold', fontSize: '1.2rem' }}>${game.price}</p>

     <p style={{ margin: '20px 0', lineHeight: '1.6' }}>{game.description}</p>

     <button 

      onClick={addToCart}

      style={{ backgroundColor: '#5c7e10', color: '#d2efa9', border: 'none', padding: '12px 24px', fontSize: '1rem', cursor: 'pointer', borderRadius: '2px' }}

     >

      Añadir al Carrito

     </button>

    </div>

   </div>

  </div>

 );

};



export default GameDetail;