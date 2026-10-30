# 🎮 SteamLite v2.0

Una plataforma web interactiva inspirada en Steam para explorar, comprar y jugar títulos indie directamente desde el navegador.

Construido con **React 19**, **Vite 8**, **React Router v7** y **Formik + Yup**.

---

## ✨ Características Principales

* 🛍️ **Tienda y Catálogo Completo:** Búsqueda en tiempo real por título o sinopsis, filtros por categorías/género y ordenamiento por precios o alfabéticamente.
* 📦 **Estado Global Sincronizado (`ShopContext`):** Carrito de compras y biblioteca de juegos sincronizados reactivamente en todo el sitio y persistidos en `localStorage`.
* 🛒 **Carrito & Checkout:**
  * Contador dinámico en la barra de navegación.
  * Eliminar items individualmente o vaciar el carrito completo.
  * Formulario con validación completa (Formik + Yup) con botón para auto-rellenar datos de prueba.
  * Modal de confirmación de compra estilo Steam (sustituye alertas nativas).
* 📚 **Mi Biblioteca:** Sección para gestionar todos los juegos adquiridos y lanzarlos al instante.
* 🕹️ **Minijuegos Integrados en Navegador:**
  * **Snake Retro (`g1`):** El clásico juego de la serpiente con registro de récord (*High Score*), pausa y controles WASD/flechas.
  * **Neon Pong (`g2`):** Juego de tenis de mesa estilo synthwave contra una IA dinámica en `<canvas>`, con efectos de neón, marcador y selector de partidas a 5 puntos.

---

## 🚀 Cómo Iniciar el Proyecto

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

3. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 📂 Estructura del Proyecto

```
steamlite/
├── public/
│   └── games.json             # Catálogo de juegos con metadatos
├── src/
│   ├── components/
│   │   ├── GameCard.jsx       # Tarjeta de juego con estados (en biblioteca, en carrito, comprar)
│   │   └── Navbar.jsx         # Barra de navegación con contador dinámico
│   ├── context/
│   │   └── ShopContext.jsx    # Estado global de carrito, biblioteca y notificaciones toast
│   ├── pages/
│   │   ├── Cart.jsx           # Carrito y formulario de pago con modal
│   │   ├── GameDetail.jsx     # Ficha de detalle y botón dinámico
│   │   ├── Home.jsx           # Catálogo con filtros y búsqueda
│   │   ├── Library.jsx        # Biblioteca personal de juegos
│   │   └── Play.jsx           # Motores de minijuegos (Snake y Neon Pong)
│   ├── App.jsx                # Configuración de rutas y Context Provider
│   ├── index.css              # Tema visual oscuro inspirado en Steam
│   └── main.jsx
├── package.json
└── vite.config.js
```
