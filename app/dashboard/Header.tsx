import React, { useState, useRef, useEffect } from "react";

const PRIMARY_COLOR = "#2C7B34";

interface User {
  userId: string;
  businessId: string;
  businessName?: string;
  email: string;
  ownerName: string;
}

interface Business {
  _id: string;
  ownerName: string;
  email: string;
  ownerId: string;
  businessName: string;
  businessDescription: string;
  whatsappIntegrated: boolean;
  whatsappToken?: string;
  createdAt: number;
  roles: string[];
  settings: {
    notifications: boolean;
    language: string;
  };
  lastLoginAt: number;
}

interface HeaderProps {
  primaryColor?: string;
  onSidebarToggle?: () => void;
  user: User | null;
  business: Business | null | undefined;
  onLogout: () => void;
}

export default function Header({ primaryColor = PRIMARY_COLOR, onSidebarToggle, user, business, onLogout }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Get business name from props or fallback
  const businessName = business?.businessName || user?.businessName || "QuickAI Business";

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      style={{
        width: "100%",
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: "#fff",
        borderBottom: "1px solid #e6e6e6",
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 64,
        gap: 16,
      }}
    >
      {/* Sidebar Toggle */}
      {onSidebarToggle && (
        <button
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: primaryColor,
            fontSize: 24,
            padding: 6,
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg
            width="24"
            height="24"
            fill={primaryColor}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <rect y="4" width="24" height="2" rx="1" />
            <rect y="11" width="24" height="2" rx="1" />
            <rect y="18" width="24" height="2" rx="1" />
          </svg>
        </button>
      )}

      {/* Business Name */}
      <h1
        style={{
          fontSize: "clamp(16px, 4vw, 22px)",
          fontWeight: "700",
          color: "#222",
          margin: 0,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flexGrow: 1,
        }}
      >
        Welcome back,{" "}
        <span style={{ color: primaryColor }}>
          {businessName || "Loading..."}
        </span>
        
        !
      </h1>

      {/* Right side icons */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {/* Notifications */}
        <button
          aria-label="Notifications"
          title="Notifications"
          onClick={() => alert("No new notifications yet!")}
          style={{
            position: "relative",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#666",
            fontSize: 20,
            padding: 8,
            borderRadius: 8,
            transition: "background-color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f5f5f5")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
        >
          🔔
          <span
            style={{
              position: "absolute",
              top: 6,
              right: 6,
              width: 10,
              height: 10,
              backgroundColor: "#e63946",
              borderRadius: "50%",
              border: "2px solid white",
            }}
          />
        </button>

        {/* Profile avatar */}
        <div style={{ position: "relative" }} ref={dropdownRef}>
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            title={businessName}
            style={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              backgroundColor: primaryColor,
              color: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "700",
              fontSize: 18,
              cursor: "pointer",
              boxShadow: `0 0 4px ${primaryColor}80`,
              userSelect: "none",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            {businessName ? businessName.charAt(0).toUpperCase() : "B"}
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                marginTop: 10,
                background: "#fff",
                boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
                borderRadius: 8,
                overflow: "hidden",
                width: 160,
                zIndex: 1100,
              }}
            >
              <button style={dropdownItemStyle} onClick={() => alert("Go to Profile")}>
                Profile
              </button>
              <button style={dropdownItemStyle} onClick={() => alert("Go to Settings")}>
                Settings
              </button>
              <hr style={{ margin: "6px 0", borderColor: "#eee" }} />
              <button style={dropdownItemStyle} onClick={() => {
                setDropdownOpen(false);
                if (onLogout) {
                  onLogout();
                }
              }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

const dropdownItemStyle = {
  width: "100%",
  padding: "12px 16px",
  background: "none",
  border: "none",
  textAlign: "left",
  fontSize: 16,
  color: "#333",
  cursor: "pointer",
  outline: "none",
  transition: "background-color 0.2s",
  userSelect: "none",
};
