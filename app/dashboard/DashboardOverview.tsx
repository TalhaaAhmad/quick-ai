import React, { useState, useEffect } from "react";

const PRIMARY_COLOR = "#2C7B34";
const TEXT_COLOR = "#1a1a1a";
const TEXT_LIGHT = "#666";

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

interface DashboardOverviewProps {
  primaryColor?: string;
  business: Business | null | undefined;
}

export default function DashboardOverview({ primaryColor = PRIMARY_COLOR, business }: DashboardOverviewProps) {
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const stats = [
    { label: "Active Conversations", value: "42", icon: "💬", description: "Live customer chats" },
    { label: "Avg. Response Time", value: "1m 23s", icon: "⏱️", description: "AI response speed" },
    { label: "Sales Closed via Bot", value: "27", icon: "💰", description: "This month" },
    { label: "Customer Satisfaction", value: "94%", icon: "⭐", description: "Based on feedback" },
  ];

  const recentActivity = [
    { type: "order", message: "New order #1234 from John Doe", time: "2 min ago", status: "success" },
    { type: "chat", message: "Customer inquiry about delivery", time: "5 min ago", status: "info" },
    { type: "order", message: "Order #1233 completed", time: "8 min ago", status: "success" },
    { type: "chat", message: "Product question answered", time: "12 min ago", status: "info" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "1rem" : "2rem" }}>
      {/* Welcome Section */}
      <div style={{ 
        background: "linear-gradient(135deg, #2C7B34 0%, #1a5a1f 100%)", 
        borderRadius: isMobile ? "12px" : "16px", 
        padding: isMobile ? "1.5rem" : "2rem", 
        color: "white",
        textAlign: "center"
      }}>
        <h1 style={{ 
          fontSize: isMobile ? "1.5rem" : "2rem", 
          fontWeight: 700, 
          margin: "0 0 0.5rem 0",
          lineHeight: "1.2"
        }}>
          Welcome back, {business?.businessName || "Business Owner"}!
        </h1>
        <p style={{ 
          fontSize: isMobile ? "0.9rem" : "1.1rem", 
          opacity: 0.9, 
          margin: 0,
          lineHeight: "1.4"
        }}>
          Your AI assistant is actively helping customers and driving sales
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))",
          gap: isMobile ? 16 : 24,
        }}
      >
        {stats.map(({ label, value, icon, description }) => (
          <section
            key={label}
            aria-label={label}
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "24px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              cursor: "default",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
              border: "1px solid #f0f0f0",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.1)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                backgroundColor: primaryColor + "15",
                color: primaryColor,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: `0 0 8px ${primaryColor}22`,
                fontSize: "24px",
              }}
            >
              {icon}
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 14,
                  color: TEXT_LIGHT,
                  marginBottom: 4,
                  fontWeight: "600",
                  letterSpacing: "0.03em",
                }}
              >
                {label}
              </p>
              <p
                style={{
                  fontSize: 28,
                  fontWeight: "800",
                  color: TEXT_COLOR,
                  margin: "0 0 4px 0",
                }}
              >
                {value}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: TEXT_LIGHT,
                  margin: 0,
                }}
              >
                {description}
              </p>
            </div>
          </section>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid #f0f0f0",
      }}>
        <h2 style={{ 
          fontSize: "1.5rem", 
          fontWeight: 700, 
          margin: "0 0 1.5rem 0", 
          color: TEXT_COLOR 
        }}>
          Recent Activity
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {recentActivity.map(({ type, message, time, status }, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: status === "success" ? "#f0fdf4" : "#f8fafc",
                borderLeft: `4px solid ${status === "success" ? "#2C7B34" : "#3b82f6"}`,
              }}
            >
              <div style={{
                fontSize: "20px",
                minWidth: "24px",
              }}>
                {type === "order" ? "🛒" : "💬"}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ 
                  margin: "0 0 4px 0", 
                  fontSize: "14px", 
                  fontWeight: 500,
                  color: TEXT_COLOR 
                }}>
                  {message}
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: "12px", 
                  color: TEXT_LIGHT 
                }}>
                  {time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
