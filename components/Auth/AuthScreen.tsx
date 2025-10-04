'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const primaryColor = '#2C7B34';

interface FormData {
  ownerName: string;
  email: string;
  password: string;
  businessName: string;
  businessDescription: string;
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detect mobile screen size
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  // Convex mutations
  const createBusiness = useMutation(api.auth.signUp);
  const signIn = useMutation(api.auth.signIn);

  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    email: '',
    password: '',
    businessName: '',
    businessDescription: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleMode = () => {
    setError('');
    setIsLogin(!isLogin);
    setFormData({
      ownerName: '',
      email: '',
      password: '',
      businessName: '',
      businessDescription: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please enter email and password.');
      return;
    }

    if (!isLogin) {
      if (!formData.ownerName || !formData.businessName || !formData.businessDescription) {
        setError('Please fill all signup fields.');
        return;
      }
    }

    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await handleLogin();
      } else {
        await handleSignup();
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      const result = await createBusiness({
        ownerName: formData.ownerName,
        email: formData.email,
        password: formData.password,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
      });
  
      console.log("✅ Business created successfully!");
      
      // Store user info in localStorage for session management
      localStorage.setItem('quickai_user', JSON.stringify({
        userId: result.userId,
        businessId: result.businessId,
        email: formData.email,
        businessName: formData.businessName,
      }));
      
      // Navigate to dashboard after signup
      router.push('/dashboard');
    } catch (err) {
      console.error("Signup error:", err);
      throw err;
    }
  };
  
  const handleLogin = async () => {
    try {
      const result = await signIn({
        email: formData.email,
        password: formData.password,
      });
      
      console.log("✅ Logged in:", formData.email);
      
      // Store user info in localStorage for session management
      localStorage.setItem('quickai_user', JSON.stringify({
        userId: result.userId,
        businessId: result.businessId,
        email: formData.email,
        businessName: result.businessName,
      }));
      
      // Navigate to dashboard after login
      router.push('/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      throw err;
    }
  };
  

  return (
    <>
      <Navbar />
      <div
        style={{
          maxWidth: isMobile ? '100%' : 420,
          margin: isMobile ? '100px 1rem 40px' : '120px auto 40px',
          padding: isMobile ? 16 : 24,
          boxShadow: '0 0 20px rgba(0,0,0,0.1)',
          borderRadius: isMobile ? 8 : 10,
          fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          backgroundColor: '#fff',
        }}
      >
        {/* Header Section */}
        <h1
          style={{
            textAlign: 'center',
            color: primaryColor,
            fontWeight: 900,
            fontSize: isMobile ? '2.5rem' : '3.2rem',
            marginBottom: 8,
            letterSpacing: '0.1em',
          }}
        >
          QuickAI
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: '#4a7c35',
            fontWeight: 600,
            fontSize: isMobile ? '1rem' : '1.2rem',
            marginTop: 0,
            marginBottom: 20,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Quick.Simple.Yours.
        </p>
        <h2
          style={{
            textAlign: 'center',
            color: '#555',
            fontWeight: 600,
            fontSize: isMobile ? '1.25rem' : '1.5rem',
            marginTop: 0,
            marginBottom: 28,
          }}
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!isLogin && (
            <>
              <input
                name="ownerName"
                type="text"
                placeholder="Owner Full Name"
                value={formData.ownerName}
                onChange={handleChange}
                required={!isLogin}
                style={inputStyle}
              />
              <input
                name="businessName"
                type="text"
                placeholder="Business Name"
                value={formData.businessName}
                onChange={handleChange}
                required={!isLogin}
                style={inputStyle}
              />
              <textarea
                name="businessDescription"
                placeholder="Briefly describe your business and products"
                value={formData.businessDescription}
                onChange={handleChange}
                rows={4}
                required={!isLogin}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />

          {error && <p style={{ color: 'red', fontSize: '0.9rem' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: loading ? '#ccc' : primaryColor,
              color: '#fff',
              padding: '14px 0',
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: 8,
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = '#245f28')}
            onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = primaryColor)}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p style={{ marginTop: 20, textAlign: 'center', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={toggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: primaryColor,
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  fontSize: '1rem',
  borderRadius: 6,
  border: '1px solid #ccc',
  outline: 'none',
  transition: 'border-color 0.3s',
};
