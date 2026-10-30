import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useShop } from '../context/ShopContext';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, removeFromCart, clearCart, checkout } = useShop();
  const [purchasedItems, setPurchasedItems] = useState(null);

  const formik = useFormik({
    initialValues: {
      name: '',
      cardNumber: '',
      expiry: '12/28',
      cvv: '123'
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, 'Mínimo 3 caracteres')
        .required('Nombre del titular obligatorio'),
      cardNumber: Yup.string()
        .matches(/^[0-9]{16}$/, 'La tarjeta debe tener exactamente 16 dígitos numéricos')
        .required('Número de tarjeta obligatorio'),
      expiry: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Formato MM/AA inválido')
        .required('Fecha obligatoria'),
      cvv: Yup.string()
        .matches(/^[0-9]{3,4}$/, 'CVV de 3 o 4 dígitos')
        .required('CVV obligatorio')
    }),
    onSubmit: () => {
      const items = checkout();
      setPurchasedItems(items);
    }
  });

  const handleFillDemoData = () => {
    formik.setValues({
      name: 'Marcos Gamer',
      cardNumber: '4532890123456789',
      expiry: '09/29',
      cvv: '789'
    });
  };

  if (cart.length === 0 && !purchasedItems) {
    return (
      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 20px', textAlign: 'center' }} className="fade-in">
        <div style={{
          backgroundColor: '#1b2838',
          borderRadius: '8px',
          padding: '60px 24px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{ fontSize: '56px', marginBottom: '20px' }}>🛒</div>
          <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '12px' }}>Tu carrito está vacío</h2>
          <p style={{ color: '#8f98a0', maxWidth: '450px', margin: '0 auto 28px', lineHeight: '1.5' }}>
            Aún no has añadido ningún juego a tu cesta. Explora nuestra selección de títulos y empieza a jugar.
          </p>
          <Link
            to="/"
            style={{
              backgroundColor: '#5c7e10',
              color: '#fff',
              padding: '12px 28px',
              borderRadius: '4px',
              fontWeight: '700',
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            Explorar Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }} className="fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ color: '#fff', fontSize: '2rem', margin: 0, fontWeight: '800' }}>
          Tu Carrito de Compras ({cart.length} {cart.length === 1 ? 'juego' : 'juegos'})
        </h1>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            style={{
              backgroundColor: 'transparent',
              color: '#cd5444',
              border: '1px solid rgba(205, 84, 68, 0.4)',
              padding: '6px 14px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '600'
            }}
          >
            Vaciar Carrito
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '30px',
        alignItems: 'start'
      }}>
        {/* Left: Cart Items List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {cart.map(game => (
            <div
              key={game.id}
              style={{
                backgroundColor: '#1b2838',
                borderRadius: '6px',
                padding: '16px',
                display: 'flex',
                gap: '16px',
                alignItems: 'center',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
              }}
            >
              <img
                src={game.imageUrl}
                alt={game.title}
                style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80';
                }}
              />

              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px', color: '#fff', fontSize: '1.1rem' }}>{game.title}</h3>
                <span style={{ color: '#66c0f4', fontSize: '12px' }}>{game.genre}</span>
              </div>

              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <span style={{ color: '#fff', fontWeight: '800', fontSize: '1.15rem' }}>
                  ${Number(game.price).toFixed(2)}
                </span>
                <button
                  onClick={() => removeFromCart(game.id)}
                  style={{
                    backgroundColor: 'transparent',
                    color: '#8f98a0',
                    fontSize: '12px',
                    textDecoration: 'underline',
                    padding: '2px 4px'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#cd5444'}
                  onMouseLeave={(e) => e.target.style.color = '#8f98a0'}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          {/* Subtotal Banner */}
          <div style={{
            backgroundColor: '#171a21',
            borderRadius: '6px',
            padding: '18px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ color: '#c7d5e0', fontSize: '16px' }}>Total Estimado:</span>
            <span style={{ color: '#66c0f4', fontSize: '1.6rem', fontWeight: '800' }}>
              ${cartTotal.toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* Right: Steam Checkout Form */}
        <div style={{
          backgroundColor: '#1b2838',
          padding: '28px',
          borderRadius: '8px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
          border: '1px solid rgba(102, 192, 244, 0.2)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#fff', fontSize: '1.3rem', margin: 0 }}>Método de Pago</h2>
            <button
              type="button"
              onClick={handleFillDemoData}
              style={{
                backgroundColor: '#2a475e',
                color: '#66c0f4',
                fontSize: '11px',
                fontWeight: '600',
                padding: '4px 10px',
                borderRadius: '4px'
              }}
            >
              ⚡ Auto-rellenar prueba
            </button>
          </div>

          <form onSubmit={formik.handleSubmit}>
            {/* Cardholder Name */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', color: '#c7d5e0', fontSize: '12px', marginBottom: '6px' }}>
                Nombre en la tarjeta
              </label>
              <input
                name="name"
                type="text"
                placeholder="Ej. Marcos Martínez"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#171a21',
                  color: '#fff',
                  border: formik.touched.name && formik.errors.name ? '1px solid #cd5444' : '1px solid #2a475e',
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
              {formik.touched.name && formik.errors.name && (
                <div style={{ color: '#cd5444', fontSize: '11px', marginTop: '4px' }}>{formik.errors.name}</div>
              )}
            </div>

            {/* Card Number */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', color: '#c7d5e0', fontSize: '12px', marginBottom: '6px' }}>
                Número de tarjeta (16 dígitos)
              </label>
              <input
                name="cardNumber"
                type="text"
                maxLength="16"
                placeholder="4532000012345678"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.cardNumber}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  backgroundColor: '#171a21',
                  color: '#fff',
                  border: formik.touched.cardNumber && formik.errors.cardNumber ? '1px solid #cd5444' : '1px solid #2a475e',
                  borderRadius: '4px',
                  fontSize: '14px',
                  letterSpacing: '1px',
                  outline: 'none'
                }}
              />
              {formik.touched.cardNumber && formik.errors.cardNumber && (
                <div style={{ color: '#cd5444', fontSize: '11px', marginTop: '4px' }}>{formik.errors.cardNumber}</div>
              )}
            </div>

            {/* Expiry & CVV Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', color: '#c7d5e0', fontSize: '12px', marginBottom: '6px' }}>
                  Vencimiento (MM/AA)
                </label>
                <input
                  name="expiry"
                  type="text"
                  placeholder="12/28"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.expiry}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#171a21',
                    color: '#fff',
                    border: '1px solid #2a475e',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#c7d5e0', fontSize: '12px', marginBottom: '6px' }}>
                  CVV
                </label>
                <input
                  name="cvv"
                  type="password"
                  maxLength="4"
                  placeholder="123"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.cvv}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    backgroundColor: '#171a21',
                    color: '#fff',
                    border: '1px solid #2a475e',
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Purchase Button */}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#5c7e10',
                color: '#fff',
                borderRadius: '4px',
                fontSize: '15px',
                fontWeight: '700',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 16px rgba(92, 126, 16, 0.4)'
              }}
            >
              <span>🔒</span> Pagar ${cartTotal.toFixed(2)} USD
            </button>
          </form>
        </div>
      </div>

      {/* Steam Purchase Success Modal */}
      {purchasedItems && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div style={{ fontSize: '54px', marginBottom: '16px' }}>🎉</div>
            <h2 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '8px' }}>
              ¡Compra Realizada con Éxito!
            </h2>
            <p style={{ color: '#8f98a0', fontSize: '14px', marginBottom: '24px' }}>
              Tus nuevos juegos han sido añadidos inmediatamente a tu biblioteca personal.
            </p>

            <div style={{
              backgroundColor: '#171a21',
              borderRadius: '6px',
              padding: '16px',
              marginBottom: '24px',
              textAlign: 'left'
            }}>
              <span style={{ color: '#66c0f4', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>
                JUEGOS DESBLOQUEADOS:
              </span>
              {purchasedItems.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#5c7e10' }}>✓</span>
                  <span style={{ color: '#fff', fontWeight: '600' }}>{item.title}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => navigate('/library')}
                style={{
                  backgroundColor: '#5c7e10',
                  color: '#fff',
                  padding: '12px 24px',
                  borderRadius: '4px',
                  fontWeight: '700',
                  fontSize: '14px'
                }}
              >
                📚 Ir a Mi Biblioteca
              </button>
              <button
                onClick={() => { setPurchasedItems(null); navigate('/'); }}
                style={{
                  backgroundColor: '#2a475e',
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '4px',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Seguir Explorando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
