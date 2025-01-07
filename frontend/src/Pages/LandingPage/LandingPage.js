import React, { useEffect } from "react";
import "./LandingPage.css";

/* global gsap, ScrollTrigger */

import { Link } from "react-router-dom";

function LandingPage() {
  useEffect(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Set initial state for sections
    gsap.set(".about-section", { opacity: 0, y: 50 });
    gsap.set(".features-section", { opacity: 0, x: -200 });
    gsap.set(".how-it-works-section", { opacity: 0, x: 200 });
    gsap.set(".footer-section", { opacity: 0, y: 50 });

    // Scroll-triggered animation for About Section
    gsap.to(".about-section", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    // Scroll-triggered animation for Features Section (Slide in from Left)
    gsap.to(".features-section", {
      opacity: 1,
      x: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".features-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    // Scroll-triggered animation for How It Works Section (Slide in from Right)
    gsap.to(".how-it-works-section", {
      opacity: 1,
      x: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".how-it-works-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });

    // Scroll-triggered animation for Footer Section (Fade in from Top)
    gsap.to(".footer-section", {
      opacity: 1,
      y: 0,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".footer-section",
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none none",
      },
    });
  }, []);

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
  <h1 className="hero-heading">Welcome to NFT Nexus: Your Gateway to Smarter NFT Decisions</h1>
  <p className="hero-subheading">
    Analyze and trade NFTs like never before with advanced tools and insights tailored to your needs.
  </p>
  <div className="hero-cta">
    <Link to="/login">
      <button className="cta-button explore-button">Login</button>
    </Link>
    <Link to="/signup">
      <button className="cta-button wallet-button">SignUp</button>
    </Link>
  </div>

  {/* Powered by bitsCrunch */}
  <div className="powered-by-section">
    <p className="powered-by-text">Powered by bitsCrunch</p>
    <p className="powered-by-description">
      bitsCrunch provides cutting-edge AI-powered analytics for NFTs, helping users make informed decisions by offering insights on
      market trends, transaction patterns, and wallet analysis. With bitsCrunch's tools, NFT traders and collectors can gain a competitive edge.
    </p>
  </div>
</section>
{/* About Section */}
<section className="about-section">
  <h2 className="about-heading">What is NFT Nexus?</h2>
  <div className="cards-container">
    <div className="about-card">
      <h3 className="card-heading">NFT Nexus Overview</h3>
      <p className="about-content">
        NFT Nexus is a cutting-edge platform for NFT enthusiasts, traders, and collectors. It provides in-depth analytics,
        price estimations, and wallet insights to make data-driven decisions in the NFT space. Our goal is to democratize the
        world of digital assets by giving users the power to make smarter decisions backed by data.
      </p>
    </div>
    <div className="about-card">
      <h3 className="card-heading">Platform Benefits</h3>
      <p className="about-content">
        Whether you are a newbie exploring NFTs or a seasoned trader looking for market trends, NFT Nexus is your go-to
        platform. From real-time market updates to historical data analysis, we've got you covered.
      </p>
    </div>
  </div>
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
          <div className="feature-item">
            <h3>Market Analysis</h3>
            <p>Get a risk score for different marketplaces to make informed trading decisions.</p>
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
