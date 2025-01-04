// import React from 'react'
// import {
//     Link
    
// } from "react-router-dom";

// export default function LandingPage() {
//   return (
//     <div>
//       <h1>This is the landing page</h1>
//       <Link to="/login"><button>Login</button></Link>
//       <Link to="/signup"><button>SignUp</button></Link>
//     </div>
//   )
// }



import React from "react";
import "./LandingPage.css";
import {
      Link
      
  } from "react-router-dom";
function LandingPage() {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-heading">Welcome to NFT Nexus: Your Gateway to Smarter NFT Decisions</h1>
        <p className="hero-subheading">
          Analyze, trade, and discover NFTs like never before with advanced tools and insights tailored to your needs.
        </p>
        <div className="hero-cta">
        <Link to="/login"><button className="cta-button explore-button">Login</button></Link>
        <Link to="/signup"><button className="cta-button wallet-button">SignUp</button></Link>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <h2 className="about-heading">What is NFT Nexus?</h2>
        <p className="about-content">
          NFT Nexus is a cutting-edge platform for NFT enthusiasts, traders, and collectors. It provides in-depth analytics,
          price estimations, and wallet insights to make data-driven decisions in the NFT space.
        </p>
        <button className="cta-button learn-more-button">Learn More</button>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-heading">Why Choose NFT Nexus?</h2>
        <div className="features-list">
          <div className="feature-item">
            <h3>NFT Collection Overview</h3>
            <p>Track and analyze your favorite collections with ease.</p>
          </div>
          <div className="feature-item">
            <h3>Advanced Analytics</h3>
            <p>Monitor volume trends, transaction patterns, and key metrics.</p>
          </div>
          <div className="feature-item">
            <h3>Price Estimation</h3>
            <p>Get accurate price predictions for NFTs across collections.</p>
          </div>
          <div className="feature-item">
            <h3>Wallet Insights</h3>
            <p>Explore wallet profiles, risk analysis, and wash trading detection.</p>
          </div>
          <div className="feature-item">
            <h3>Real-Time Search</h3>
            <p>Quickly search and access detailed NFT metadata and collections.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <h2 className="how-heading">How Does NFT Nexus Work?</h2>
        <ol className="how-steps">
          <li>Step 1: Connect your wallet.</li>
          <li>Step 2: Search for NFTs or collections.</li>
          <li>Step 3: Explore insights and trade confidently.</li>
        </ol>
      </section>

      {/* Footer Section */}
      <footer className="footer-section">
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Features</li>
            <li>Contact</li>
          </ul>
        </div>
        <div className="footer-social">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <span>Twitter</span>
            <span>Discord</span>
            <span>Instagram</span>
          </div>
        </div>
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: support@nftnexus.com</p>
        </div>
        <div className="footer-legal">
          <span>Terms of Service</span> | <span>Privacy Policy</span>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
