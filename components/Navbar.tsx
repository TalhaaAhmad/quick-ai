import React, { useState, useEffect } from 'react';

const primaryColor = '#2C7B34';

const linkStyle: React.CSSProperties = {
  position: 'relative',
  textDecoration: 'none',
  color: primaryColor,
  fontWeight: 500,
  fontSize: '0.95rem',
  paddingBottom: 4,
  transition: 'color 0.3s ease',
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  // Detect mobile screen size
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <nav
        style={{
          width: '100%',
          height: '70px',
          backgroundColor: '#fff',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 1000,
          fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/greenlogo.png" alt="QuickAI Logo" style={{ height: 40, marginRight: 10 }} />
          <span style={{ fontSize: '1.4rem', fontWeight: 700, color: primaryColor }}>
            QuickAI
          </span>
        </div>

        {/* Desktop links */}
        <div className="nav-links-desktop" style={{ 
          display: isMobile ? 'none' : 'flex', 
          marginLeft: 'auto', 
          gap: 20 
        }}>
          {['Features', 'How it Works', 'Contact Us'].map((text, idx) => (
            <a
              key={idx}
              href={`#${text.toLowerCase().replace(/\s/g, '')}`}
              style={{
                ...linkStyle,
                marginRight: idx === 2 ? 120 : 20,
                cursor: 'pointer',
              }}
              className="nav-link"
            >
              {text}
              <span className="underline" />
            </a>
          ))}
        </div>

        {/* Hamburger menu for mobile */}
        <button
          onClick={toggleMenu}
          className="hamburger-button"
          aria-label="Toggle menu"
          style={{
            display: isMobile ? 'block' : 'none',
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            flexDirection: 'column',
            justifyContent: 'space-around',
            height: 24,
            width: 30,
            padding: 0,
            marginRight: 40
          }}
        >
          <span
            style={{
              width: 30,
              height: 3,
              backgroundColor: primaryColor,
              borderRadius: 2,
              transition: 'all 0.3s',
              transformOrigin: '1px',
              transform: menuOpen ? 'rotate(45deg)' : 'rotate(0)',
              position: 'relative',
              top: menuOpen ? 7 : 0,
            }}
          />
          <span
            style={{
              width: 30,
              height: 3,
              backgroundColor: primaryColor,
              borderRadius: 2,
              margin: '6px 0',
              opacity: menuOpen ? 0 : 1,
              transition: 'all 0.3s'
            }}
          />
          <span
            style={{
              width: 30,
              height: 3,
              backgroundColor: primaryColor,
              borderRadius: 2,
              transition: 'all 0.3s',
              transformOrigin: '1px',
              transform: menuOpen ? 'rotate(-45deg)' : 'rotate(0)',
              position: 'relative',
              top: menuOpen ? -7 : 0,
            }}
          />
        </button>
      </nav>

      {/* Mobile menu dropdown */}
      <div
        className="nav-links-mobile"
        style={{
          display: menuOpen ? 'flex' : 'none',
          flexDirection: 'column',
          position: 'fixed',
          top: 70,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          padding: '20px 0',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 999,
          alignItems: 'center',
          gap: 20,
        }}
      >
        {['Features', 'How it Works', 'Contact Us'].map((text, idx) => (
          <a
            key={idx}
            href={`#${text.toLowerCase().replace(/\s/g, '')}`}
            style={{
              ...linkStyle,
              color: primaryColor,
              fontSize: '1.25rem',
              marginRight: 0,
              cursor: 'pointer',
            }}
            onClick={() => setMenuOpen(false)}
          >
            {text}
          </a>
        ))}
      </div>

      <style>{`
        /* Hide desktop nav links on small screens */
        @media (max-width: 768px) {
          .nav-links-desktop {
            display: none !important;
          }
          .hamburger-button {
            display: flex !important;
          }
        }

        /* Hide mobile menu on desktop */
        @media (min-width: 769px) {
          .nav-links-mobile {
            display: none !important;
          }
        }

        /* Underline hover effect */
        .nav-link {
          position: relative;
          text-decoration: none;
          color: ${primaryColor};
          font-weight: 500;
          padding-bottom: 4px;
          transition: color 0.3s ease;
        }
        .nav-link:hover {
          color: #1f5a1a;
        }
        .nav-link .underline {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 2px;
          width: 0%;
          background-color: ${primaryColor};
          transition: width 0.3s ease;
        }
        .nav-link:hover .underline {
          width: 100%;
        }
      `}</style>
    </>
  );
}
