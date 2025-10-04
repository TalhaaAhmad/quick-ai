import React, { useState, useEffect } from "react";

const gradientBackground = "linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)";
const PRIMARY_COLOR = "#2C7B34";
const TEXT_COLOR = "#2b3a23";
const TEXT_COLOR_INACTIVE = "#70815b";
const HOVER_BG = "rgba(44, 123, 52, 0.1)";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: "📊" },
  { key: "orders", label: "Orders", icon: "🛒" },
  { key: "products", label: "Products", icon: "📦" },
  { key: "analytics", label: "Analytics", icon: "📈" },
  { key: "conversations", label: "Chats", icon: "💬" },
  { key: "settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar({ activeKey, setActiveKey, isOpen, onToggle, onLogout }) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size (simple)
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on menu click (mobile)
  function handleMenuClick(key) {
    setActiveKey(key);
    if (isMobile && onToggle) onToggle();
  }

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          onClick={onToggle}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.3)",
            zIndex: 1000,
          }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        aria-label="Primary Navigation"
        style={{
          width: 280,
          background: gradientBackground,
          height: "100vh",
          margin: isMobile ? 0 : 20,
          padding: "2rem 1.5rem",
          boxSizing: "border-box",
          borderRadius: isMobile ? 0 : 16,
          boxShadow: isMobile
            ? "none"
            : "0 8px 24px rgba(44,123,52,0.15)",
          display: "flex",
          flexDirection: "column",
          userSelect: "none",
          color: TEXT_COLOR,
          fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          position: isMobile ? "fixed" : "static",
          top: 0,
          left: isMobile ? (isOpen ? 0 : "-320px") : 0,
          transition: "left 0.3s ease",
          zIndex: 1002,
          overflowY: "auto",
        }}
      >
        {/* Close button on mobile */}
        {isMobile && (
          <button
            onClick={onToggle}
            aria-label="Close sidebar menu"
            style={{
              alignSelf: "flex-end",
              background: "transparent",
              border: "none",
              fontSize: 24,
              color: PRIMARY_COLOR,
              cursor: "pointer",
              marginBottom: 20,
              padding: 0,
            }}
          >
            ✕
          </button>
        )}

        {/* Header: Logo + Text */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 40,
            gap: 14,
            userSelect: "none",
          }}
        >
          <img
            src="/greenlogo.png"
            alt="QuickAI Logo"
            style={{
              height: 56,
              width: "auto",
              filter: "drop-shadow(0 0 2px rgba(0,0,0,0.05))",
              userSelect: "none",
            }}
            draggable={false}
          />
          <h1
            style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "0.15em",
              margin: 0,
              color: PRIMARY_COLOR,
            }}
          >
            QuickAI
          </h1>
        </div>

        {/* Menu */}
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          {menuItems.map(({ key, label, icon }) => {
            const isActive = key === activeKey;
            return (
              <li key={key} style={{ marginBottom: 12 }}>
                <button
                  onClick={() => handleMenuClick(key)}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    width: "100%",
                    backgroundColor: isActive ? HOVER_BG : "transparent",
                    border: "none",
                    borderLeft: isActive
                      ? `4px solid ${PRIMARY_COLOR}`
                      : "4px solid transparent",
                    color: isActive ? PRIMARY_COLOR : TEXT_COLOR_INACTIVE,
                    fontWeight: isActive ? "700" : "500",
                    fontSize: 16,
                    padding: "14px 20px",
                    textAlign: "left",
                    borderRadius: "6px 0 0 6px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    transition:
                      "background-color 0.3s ease, color 0.3s ease, border-left-color 0.3s ease",
                    userSelect: "none",
                    outline: "none",
                  }}
                  onMouseEnter={e => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = HOVER_BG;
                    if (!isActive) e.currentTarget.style.color = PRIMARY_COLOR;
                  }}
                  onMouseLeave={e => {
                    if (!isActive)
                      e.currentTarget.style.backgroundColor = "transparent";
                    if (!isActive) e.currentTarget.style.color = TEXT_COLOR_INACTIVE;
                  }}
                  onFocus={e => {
                    e.currentTarget.style.outline = `2px solid ${PRIMARY_COLOR}`;
                    e.currentTarget.style.outlineOffset = "2px";
                  }}
                  onBlur={e => {
                    e.currentTarget.style.outline = "none";
                  }}
                >
                  <span
                    style={{
                      fontSize: 18,
                      minWidth: 24,
                      color: isActive ? PRIMARY_COLOR : TEXT_COLOR_INACTIVE,
                    }}
                  >
                    {icon}
                  </span>
                  {label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Logout Button */}
        {onLogout && (
          <div style={{ marginTop: "auto", marginBottom: 20 }}>
            <button
              onClick={() => {
                if (isMobile && onToggle) onToggle();
                onLogout();
              }}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                border: "1px solid #e63946",
                color: "#e63946",
                fontWeight: "600",
                fontSize: 14,
                padding: "12px 20px",
                textAlign: "center",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transition: "all 0.2s ease",
                userSelect: "none",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#e63946";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#e63946";
              }}
              onFocus={(e) => {
                e.currentTarget.style.outline = `2px solid #e63946`;
                e.currentTarget.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                e.currentTarget.style.outline = "none";
              }}
            >
              <span style={{ fontSize: 16 }}>🚪</span>
              Logout
            </button>
          </div>
        )}

        {/* Footer */}
        <footer
          style={{
            paddingTop: 20,
            borderTop: `1px solid ${TEXT_COLOR_INACTIVE}`,
            fontSize: 13,
            textAlign: "center",
            color: TEXT_COLOR_INACTIVE,
            userSelect: "none",
            fontWeight: "500",
          }}
        >
          &copy; {new Date().getFullYear()} QuickAI
        </footer>
      </nav>
    </>
  );
}
