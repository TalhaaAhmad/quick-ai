'use client';

import Link from 'next/link';
import Navbar from '../components/Navbar';
import ContactUs from '../components/ContactUs';
import Footer from '../components/Footer';

const primaryColor = '#2C7B34';
const gradientBackground = 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)';

export default function LandingPage() {
  return (
    <div
      style={{
        fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: primaryColor,
      }}
    >
      <Navbar />

      {/* HERO SECTION */}
      <div
        style={{
          minHeight: '100vh',
          background: gradientBackground,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '80px 20px 20px',
          textAlign: 'center',
        }}
      >
        <img
          src="/logo.png"
          alt="QuickAI Logo"
          style={{
            width: 120,
            marginBottom: 20,
            filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))',
          }}
        />

        <h1
          style={{
            fontSize: '3rem',
            margin: 0,
            fontWeight: 700,
            letterSpacing: '1px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          }}
          className="text-4xl md:text-6xl"
        >
          QuickAI
        </h1>

        <p
          style={{
            fontSize: '1.35rem',
            marginTop: 10,
            marginBottom: 24,
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#333',
          }}
        >
          Quick. Simple. Yours.
        </p>

        <p
          style={{
            fontSize: '1.15rem',
            maxWidth: 440,
            marginBottom: 50,
            color: '#555',
            lineHeight: 1.6,
          }}
        >
          QuickAI helps your business engage customers, automate sales, and grow effortlessly — with friendly, human-like conversations.
        </p>

        <Link
          href="/auth"
          style={{
            background: primaryColor,
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '16px 48px',
            fontSize: '1.15rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: `0 8px 20px ${primaryColor}50`,
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(4px)',
            textDecoration: 'none',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#245f28';
            e.currentTarget.style.boxShadow = `0 10px 24px ${primaryColor}80`;
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = primaryColor;
            e.currentTarget.style.boxShadow = `0 8px 20px ${primaryColor}50`;
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Get Started
        </Link>
      </div>

      {/* FEATURES SECTION */}
      <section
        id="features"
        style={{
          backgroundColor: '#f9fdf9',
          padding: '80px 20px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ fontSize: '2.2rem', marginBottom: 40, fontWeight: 700 }}>
          What QuickAI Does for You
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '30px',
            maxWidth: 1000,
            margin: '0 auto',
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '30px 20px',
                boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                transition: 'transform 0.3s, box-shadow 0.3s',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(0,0,0,0.06)';
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: 16 }}>{feature.icon}</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: 12 }}>{feature.title}</h3>
              <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        id="howitworks"
        style={{
          backgroundColor: '#ffffff',
          padding: '80px 20px 100px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '2.8rem',
            fontWeight: 700,
            marginBottom: 60,
            maxWidth: 700,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          How QuickAI Works
        </h2>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '40px',
            maxWidth: 960,
            margin: '0 auto',
          }}
        >
          {howItWorksSteps.map(({ icon, title, description }, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#f9fdf9',
                borderRadius: 16,
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                flex: '1 1 320px',
                maxWidth: 320,
                padding: 30,
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'default',
                userSelect: 'none',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
              }}
            >
              <div
                style={{
                  fontSize: '4rem',
                  marginBottom: 20,
                }}
                aria-hidden="true"
              >
                {icon}
              </div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  marginBottom: 16,
                  color: primaryColor,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  color: '#555',
                  userSelect: 'text',
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
      <ContactUs />
      <Footer />
    </div>
  );
}

const features = [
  {
    icon: '💬',
    title: 'Conversational AI',
    description:
      'Chats naturally with your customers in English & Roman Urdu, answering questions about products, prices, and delivery.',
  },
  {
    icon: '🛒',
    title: 'Knows Your Products',
    description:
      'Loads live data from your store to give customers accurate availability, descriptions, and pricing.',
  },
  {
    icon: '✅',
    title: 'Confirms Orders',
    description:
      'Handles orders right in the chat, keeping it seamless and easy for your customers.',
  },
  {
    icon: '🚀',
    title: 'Instant Notifications',
    description:
      'Automatically updates customers on order confirmations and delivery times through WhatsApp.',
  },
  {
    icon: '📊',
    title: 'Growth Insights',
    description:
      'See what customers ask most and how many orders your bot closes, all in one dashboard.',
  },
  {
    icon: '⚙️',
    title: 'Easy to Setup',
    description:
      'Connect your WhatsApp once and go live. No complex API integrations needed.',
  },
];

const howItWorksSteps = [
  {
    icon: '1️⃣',
    title: 'Sign Up Your Business',
    description:
      'Create an account and provide your business name and description to help us set up your AI assistant.',
  },
  {
    icon: '2️⃣',
    title: 'Connect Your WhatsApp',
    description:
      'Scan the QR code to link your business WhatsApp number with QuickAI — no complicated setup needed.',
  },
  {
    icon: '3️⃣',
    title: 'Start Chatting & Selling',
    description:
      'Let QuickAI engage with customers, answer queries, take orders, and send automatic updates.',
  },
];
