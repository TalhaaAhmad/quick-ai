'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useRouter } from 'next/navigation';
import Dashboard from './Dashboard';

interface User {
  businessName: string;
  email: string;
  userId: string;
  businessId: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

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
    } else {
      // Redirect to auth if no user data
      router.push('/auth');
    }
  }, [router]);

  // Show loading state
  if (!user) {
    return (
      <div style={{ 
        padding: '2rem', 
        fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f8faf9',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            fontSize: '2rem', 
            marginBottom: '1rem',
            animation: 'spin 1s linear infinite'
          }}>⏳</div>
          <p style={{ color: '#666' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return <Dashboard />;
}