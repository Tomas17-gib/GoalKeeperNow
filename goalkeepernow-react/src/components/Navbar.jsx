import { useCarrito } from '../context/CarritoContext'
import { useTheme } from '../context/ThemeContext'
import { FaWhatsapp, FaInstagram } from 'react-icons/fa'

function Navbar({ onNavigate, paginaActiva }) {
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const { totalItems } = useCarrito()
  const { darkMode, toggleTheme } = useTheme()

  return (
    <div className="navbar">
      <div className="navbar-top">
        <button className="navbar-logo" onClick={() => onNavigate('home')}>
         <div className="navbar-brand">

  <span className="brand-icon">
    🧤
  </span>


  <div>

    <h2>
      GoalKeeper
      <span>Now</span>
    </h2>

    <small>
      Tu arquero cuando lo necesites
    </small>

  </div>

</div>
        </button>

        <div className="navbar-search">
          <input type="text" placeholder="Buscar arqueros, productos o entrenadores..."></input>
          <button aria-label="Buscar">🔍</button>
        </div>

        <div className="navbar-icons">

          <button
            className="icon-btn theme-toggle"
            title={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            onClick={toggleTheme}
            aria-label={darkMode ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>

          {usuario?.id ? (
            <>
              <button className="icon-btn" title="Mi perfil" onClick={() => onNavigate('perfil')}>👤</button>
              <button className="icon-btn" title="Carrito" onClick={() => onNavigate('carrito')} style={{ position:'relative' }}>
                🛒
                {totalItems > 0 && <span className="navbar-pill">{totalItems}</span>}
              </button>
            </>
          ) : (
            <button className="btn-dorado" onClick={() => onNavigate('login')} style={{ padding:'9px 18px' }}>
              Iniciar sesión
            </button>
          )}
        </div>

          

      </div>

      <div className="navbar-bottom">
        <div className="navbar-bottom-inner">
          
          <button className={`nav-link ${paginaActiva === 'home' ? 'activo' : ''}`} onClick={() => onNavigate('home')}>Inicio</button>
          <button className={`nav-link ${paginaActiva === 'tienda' ? 'activo' : ''}`} onClick={() => onNavigate('tienda')}>Tienda</button>
          <button className={`nav-link ${paginaActiva === 'porteros' ? 'activo' : ''}`} onClick={() => onNavigate('porteros')} style={{ position:'relative' }}>
            Contratar Arquero
            <span className="nav-badge-new">NEW</span>
          </button>
          <button className={`nav-link ${paginaActiva === 'entrenadores' ? 'activo' : ''}`} onClick={() => onNavigate('entrenadores')}>Entrena</button>
          <button className={`nav-link ${paginaActiva === 'canchas' ? 'activo' : ''}`} onClick={() => onNavigate('canchas')}>Canchas</button>
          {usuario?.id && (
            <button className={`nav-link ${['dashboard','admin'].includes(paginaActiva) ? 'activo' : ''}`}
              onClick={() => onNavigate(usuario.tipo === 'admin' ? 'admin' : 'dashboard')}>
              Mi Panel
            </button>

                          

          )}
          <div className="navbar-social">

    <button
        className="social-icon whatsapp"
        title="WhatsApp"
        onClick={() =>
            window.open(
                'https://web.whatsapp.com/',
                '_blank'
            )
        }
    >

        <FaWhatsapp />

    </button>

    <button
        className="social-icon instagram"
        title="Instagram"
        onClick={() =>
            window.open(
                'https://www.instagram.com/teocalle_/',
                '_blank'
            )
        }
    >

        <FaInstagram />

    </button>

</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
