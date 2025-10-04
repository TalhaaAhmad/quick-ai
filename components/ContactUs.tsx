import React from 'react';

const primaryColor = '#2C7B34';

export default function ContactUs() {
  return (
    <section
      id="contactus"
      style={{
        background: '#f9fdf9',
        padding: '80px 20px',
        textAlign: 'center',
        fontFamily: "'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          fontSize: '2.6rem',
          fontWeight: 700,
          marginBottom: 20,
          maxWidth: 700,
          marginLeft: 'auto',
          marginRight: 'auto',
          lineHeight: 1.3,
        }}
      >
        Struggling with Customer Support, Sales Reports, and Growth?
      </h2>
      <p
        style={{
          fontSize: '1.15rem',
          maxWidth: 650,
          margin: '0 auto 50px',
          lineHeight: 1.7,
          color: '#555',
        }}
      >
        <span style={{ color: primaryColor, fontWeight: 600 }}>QuickAI</span> is here to
        help your business thrive. Whether it's automating customer chats, boosting
        sales, or giving you sharp insights — <strong>leave everything to us.</strong><br />
        Connect with us through the form below and let's transform your business together.
      </p>

      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '22px',
          maxWidth: 500,
          margin: '0 auto',
        }}
      >
        <input
          type="text"
          placeholder="Your Name"
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          style={inputStyle}
        />
        <textarea
          rows="5"
          placeholder="Tell us how we can help you"
          required
          style={{ ...inputStyle, resize: 'vertical' }}
        ></textarea>
        <button
          type="submit"
          style={{
            background: primaryColor,
            color: '#fff',
            border: 'none',
            padding: '16px',
            fontSize: '1.1rem',
            fontWeight: 600,
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'background 0.3s, transform 0.2s',
            boxShadow: `0 6px 18px ${primaryColor}50`,
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#245f28';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = primaryColor;
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Send Message
        </button>
      </form>
    </section>
  );
}

const inputStyle = {
  padding: '15px 18px',
  fontSize: '1rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
  outline: 'none',
  transition: 'all 0.3s',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
};
