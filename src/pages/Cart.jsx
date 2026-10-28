import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { useFormik } from 'formik';

import * as Yup from 'yup';



const Cart = () => {

 const navigate = useNavigate();

 const [cart, setCart] = useState([]);



 useEffect(() => {

  const savedCart = JSON.parse(localStorage.getItem('steamlite_cart')) || [];

  setCart(savedCart);

 }, []);



 const total = cart.reduce((sum, game) => sum + game.price, 0).toFixed(2);



 const formik = useFormik({

  initialValues: { cardNumber: '', name: '' },

  validationSchema: Yup.object({

   cardNumber: Yup.string()

    .matches(/^[0-9]{16}$/, 'La tarjeta debe tener 16 dígitos exactos')

    .required('Número de tarjeta obligatorio'),

   name: Yup.string().min(3, 'Mínimo 3 caracteres').required('Nombre obligatorio')

  }),

  onSubmit: () => {

   // 1. Obtener biblioteca actual

   const library = JSON.parse(localStorage.getItem('steamlite_library')) || [];

    

   // 2. Añadir nuevos juegos (sin duplicados)

   const newLibrary = [...library];

   cart.forEach(game => {

    if (!newLibrary.find(g => g.id === game.id)) newLibrary.push(game);

   });



   // 3. Guardar en biblioteca y limpiar carrito

   localStorage.setItem('steamlite_library', JSON.stringify(newLibrary));

   localStorage.removeItem('steamlite_cart');

    

   // 4. Redirigir a la biblioteca

   alert('¡Compra exitosa!');

   navigate('/library');

  }

 });



 if (cart.length === 0) {

  return <h2 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Tu carrito está vacío.</h2>;

 }



 return (

  <div style={{ backgroundColor: '#171a21', minHeight: '100vh', padding: '40px', color: '#c7d5e0' }}>

   <h1 style={{ color: 'white', marginBottom: '30px' }}>Tu Carrito ({cart.length} artículos)</h1>

    

   <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

    {/* Lista de juegos */}

    <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '4px' }}>

     {cart.map(game => (

      <div key={game.id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', padding: '15px 0' }}>

       <span style={{ fontSize: '1.2rem', color: 'white' }}>{game.title}</span>

       <span style={{ color: '#66c0f4', fontWeight: 'bold' }}>${game.price}</span>

      </div>

     ))}

     <h2 style={{ textAlign: 'right', marginTop: '20px', color: 'white' }}>Total: ${total}</h2>

    </div>



    {/* Formulario de Checkout (Formik + Yup) */}

    <div style={{ backgroundColor: '#2a475e', padding: '30px', borderRadius: '4px' }}>

     <h2 style={{ color: 'white', marginBottom: '20px' }}>Método de Pago</h2>

     <form onSubmit={formik.handleSubmit}>

      <input

       name="name"

       placeholder="Nombre en la tarjeta"

       onChange={formik.handleChange}

       onBlur={formik.handleBlur}

       value={formik.values.name}

       style={{ width: '100%', padding: '10px', marginBottom: '5px', backgroundColor: '#171a21', color: 'white', border: 'none' }}

      />

      {formik.touched.name && formik.errors.name ? <div style={{ color: '#E50914', fontSize: '12px', marginBottom: '15px' }}>{formik.errors.name}</div> : <div style={{marginBottom: '15px'}}></div>}



      <input

       name="cardNumber"

       placeholder="Número de tarjeta (16 dígitos)"

       onChange={formik.handleChange}

       onBlur={formik.handleBlur}

       value={formik.values.cardNumber}

       style={{ width: '100%', padding: '10px', marginBottom: '5px', backgroundColor: '#171a21', color: 'white', border: 'none' }}

      />

      {formik.touched.cardNumber && formik.errors.cardNumber ? <div style={{ color: '#E50914', fontSize: '12px', marginBottom: '15px' }}>{formik.errors.cardNumber}</div> : <div style={{marginBottom: '15px'}}></div>}



      <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#5c7e10', color: '#d2efa9', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>

       Finalizar Compra

      </button>

     </form>

    </div>

   </div>

  </div>

 );

};



export default Cart;