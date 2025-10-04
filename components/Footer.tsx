import React from 'react';

const primaryColor = '#2C7B34';

export default function Footer() {
  return (
    <footer
      style={{
        background: primaryColor,
        color: '#fff',
        padding: '50px 20px',
        fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '30px',
        }}
      >
        {/* COMPANY */}
        <div style={{ flex: '1 1 220px', minWidth: '200px' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>QuickAI</h3>
          <p style={{ lineHeight: 1.6 }}>
            Helping your business automate customer support & sales so you can
            focus on growth.
          </p>
        </div>

        {/* LINKS */}
        <div style={{ flex: '1 1 180px', minWidth: '180px' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Links</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: 2 }}>
            <li><a href="/privacy" style={linkStyle}>Privacy Policy</a></li>
            <li><a href="/terms" style={linkStyle}>Terms & Conditions</a></li>
            <li><a href="/#contact" style={linkStyle}>Contact Us</a></li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div style={{ flex: '1 1 180px', minWidth: '180px' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Follow Us</h4>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a 
              href="https://facebook.com" 
              style={iconLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a 
              href="https://instagram.com" 
              style={iconLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a 
              href="https://linkedin.com" 
              style={iconLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        {/* ADDRESS */}
        <div style={{ flex: '1 1 220px', minWidth: '200px' }}>
          <h4 style={{ fontSize: '1.2rem', marginBottom: '12px' }}>Our Office</h4>
          <p style={{ lineHeight: 1.6 }}>
            NIC Peshawar<br />
            Peshawar, Pakistan<br />
            info@quickease.pk
          </p>
        </div>
      </div>

      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.3)',
          marginTop: '30px',
          paddingTop: '20px',
          textAlign: 'center',
          fontSize: '0.95rem',
        }}
      >
        &copy; {new Date().getFullYear()} QuickAI by Quickease. All rights reserved.
      </div>
    </footer>
  );
}

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  transition: 'color 0.3s',
};

const iconLinkStyle = {
  background: '#fff',
  color: primaryColor,
  borderRadius: '50%',
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  transition: 'all 0.3s',
};

