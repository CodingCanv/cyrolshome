import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import './Header.css'

export function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="header-title" onClick={() => setMenuOpen(false)}>
          CyrolHome
        </Link>
        <button
          type="button"
          className="header-menu-btn"
          aria-label="Menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span className="hamburger" />
          <span className="hamburger" />
          <span className="hamburger" />
        </button>
        <nav className={`header-nav ${menuOpen ? 'open' : ''}`}>
          <Link to="/spazi" onClick={() => setMenuOpen(false)}>
            Spazi
          </Link>
          <Link to="/calendario" onClick={() => setMenuOpen(false)}>
            Calendario
          </Link>
          <Link to="/report" onClick={() => setMenuOpen(false)}>
            Report
          </Link>
          <Link to="/impostazioni" onClick={() => setMenuOpen(false)}>
            Impostazioni
          </Link>
          {user && (
            <button type="button" className="header-logout" onClick={handleLogout}>
              Esci
            </button>
          )}
        </nav>
      </div>
    </header>
  )
}
