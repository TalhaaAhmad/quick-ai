'use client';

import React, { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import DashboardOverview from "./DashboardOverview";
import ProductsPage from "../../components/Products/ProductsPage";

const PRIMARY_COLOR = "#2C7B34";
const BACKGROUND_COLOR = "#f8faf9";
const TEXT_COLOR = "#1a1a1a";

// Define user type
type User = {
  userId: string;
  businessId: string;
  businessName?: string;
  email: string;
  ownerName: string;
};

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null as User | null);
  const router = useRouter();

  // Type guard to check if user has required properties
  const isValidUser = (user: any): user is User => {
    return user && typeof user.userId === 'string' && typeof user.businessId === 'string';
  };

  useEffect(() => {
    // Get user info from localStorage
    const userData = localStorage.getItem('quickai_user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        
        // Handle migration from old format (ownerId) to new format (userId)
        if (parsedUser.ownerId && !parsedUser.userId) {
          console.log('🔄 Clearing old authentication format, redirecting to login...');
          localStorage.removeItem('quickai_user');
          router.push('/auth');
          return;
        }
        
        // Validate that we have the required fields
        if (!parsedUser.userId || !parsedUser.businessId) {
          console.log('⚠️ Invalid user data, clearing and redirecting...');
          localStorage.removeItem('quickai_user');
          router.push('/auth');
          return;
        }
        
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('quickai_user');
        router.push('/auth');
      }
    }
  }, [router]);

  // Get business data from Convex
  const business = useQuery(api.auth.getBusinessByOwnerId, 
    user ? { ownerId: (user as any).userId } : "skip"
  );

  // Logout function
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('quickai_user');
    
    // Clear any other stored data if needed
    // localStorage.removeItem('other_data');
    
    // Redirect to auth page
    router.push('/auth');
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: BACKGROUND_COLOR,
        color: TEXT_COLOR,
        flexDirection: sidebarOpen ? "column" : "row",
      }}
    >
      <Sidebar 
        activeKey={activeMenu} 
        setActiveKey={setActiveMenu}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />

      <main
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header 
          primaryColor={PRIMARY_COLOR}
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          user={user}
          business={business}
          onLogout={handleLogout}
        />

        <div
          style={{
            flexGrow: 1,
            padding: sidebarOpen ? "1rem" : "2rem",
            overflowY: "auto",
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          {activeMenu === "dashboard" && <DashboardOverview primaryColor={PRIMARY_COLOR} business={business} />}
          {activeMenu === "orders" && <OrdersSection />}
          {activeMenu === "products" && business && <ProductsPage business={business} />}
          {activeMenu === "analytics" && <AnalyticsSection />}
          {activeMenu === "conversations" && <ConversationsSection />}
          {activeMenu === "settings" && <SettingsSection />}
        </div>
      </main>
    </div>
  );
}

// Placeholder sections for different menu items
function OrdersSection() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, color: PRIMARY_COLOR, marginBottom: "1rem" }}>
        Orders Management
      </h2>
      <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
        Track and manage all your customer orders processed through QuickAI.
      </p>
      <div style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        padding: "3rem", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)" 
      }}>
        <p style={{ fontSize: "1.2rem", color: "#888" }}>Orders section coming soon!</p>
      </div>
    </div>
  );
}


function AnalyticsSection() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, color: PRIMARY_COLOR, marginBottom: "1rem" }}>
        Analytics & Insights
      </h2>
      <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
        Get detailed insights into your AI chatbot performance and sales metrics.
      </p>
      <div style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        padding: "3rem", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)" 
      }}>
        <p style={{ fontSize: "1.2rem", color: "#888" }}>Analytics section coming soon!</p>
      </div>
    </div>
  );
}

function ConversationsSection() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, color: PRIMARY_COLOR, marginBottom: "1rem" }}>
        Live Conversations
      </h2>
      <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
        Monitor and manage real-time customer conversations with your AI assistant.
      </p>
      <div style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        padding: "3rem", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)" 
      }}>
        <p style={{ fontSize: "1.2rem", color: "#888" }}>Conversations section coming soon!</p>
      </div>
    </div>
  );
}

function SettingsSection() {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", fontWeight: 700, color: PRIMARY_COLOR, marginBottom: "1rem" }}>
        Settings & Configuration
      </h2>
      <p style={{ fontSize: "1.1rem", color: "#666", marginBottom: "2rem" }}>
        Configure your AI assistant settings, business information, and preferences.
      </p>
      <div style={{ 
        background: "#fff", 
        borderRadius: "12px", 
        padding: "3rem", 
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)" 
      }}>
        <p style={{ fontSize: "1.2rem", color: "#888" }}>Settings section coming soon!</p>
      </div>
    </div>
  );
}
