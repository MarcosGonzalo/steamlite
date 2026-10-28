import { useState, useEffect } from 'react';

import { Link } from 'react-router-dom';



const Library = () => {

 const [library, setLibrary] = useState([]);



 useEffect(() => {

  const savedLibrary = JSON.parse(localStorage.getItem('steamlite_library')) || [];

  setLibrary(savedLibrary);

 }, []);



 return (

  <div style={{ backgroundColor: '#171a21', minHeight: '100vh', padding: '40px', color: '#c7d5e0' }}>

   <h1 style={{ color: 'white', borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>

    Mi Biblioteca

   </h1>

    

   {library.length === 0 ? (

    <p>Aún no has comprado ningún juego. <Link to="/" style={{ color: '#66c0f4' }}>Ir a la tienda</Link></p>

   ) : (

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>

     {library.map(game => (

      <div key={game.id} style={{ backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden' }}>

       <img src={game.imageUrl} alt={game.title} style={{ width: '100%', height: '120px', objectFit: 'cover' }} />

       <div style={{ padding: '15px', textAlign: 'center' }}>

        <h3 style={{ margin: '0 0 15px', color: 'white', fontSize: '1rem' }}>{game.title}</h3>

        <Link 

         to={`/play/${game.id}`}

         style={{ display: 'block', backgroundColor: '#2a475e', color: 'white', padding: '8px', textDecoration: 'none', borderRadius: '2px', fontWeight: 'bold' }}

        >

         ▶ Jugar

        </Link>

       </div>

      </div>

     ))}

    </div>

   )}

  </div>

 );

};



export default Library;