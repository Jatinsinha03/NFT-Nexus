import React, { useEffect } from "react";
import "./LandingPage.css";
import Footer from '../../components/Footer'

/* global gsap, ScrollTrigger */

import { Link } from "react-router-dom";
import NavBar from "../../components/NavBar";

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
      duration: 3.5,
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
      duration: 3.5,
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
      duration: 3.5,
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
    <>
    <NavBar/>
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
    <div className="about-card">
      <h3 className="card-heading">AI-Powered Risk Analysis</h3>
      <p className="about-content">
        NFT Nexus integrates an AI model that evaluates the risk levels of NFT collections. It categorizes investments into
        "very low," "low," "mid," "high," and "very high" risk levels, enabling users to make informed decisions on whether to invest.
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
      <h3>NFT Collection Insights</h3>
      <p>Search and analyze NFT collections with real-time metadata and insights.</p>
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
      <h3 className="Landh">Wallet Insights</h3>
      <p>Explore wallet profiles, risk analysis, and wash trading detection.</p>
    </div>
    <div className="feature-item">
      <h3>AI Risk Analysis</h3>
      <p>Evaluate NFT collections with our advanced AI model, offering cutting-edge risk insights to guide smarter investment strategies.</p>
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
  <div className="how-cards">
    {/* Card 1 */}
    <div className="how-card">
      <div className="card-front">
      <h3 className="Landh">Search for Collections</h3>
      </div>
      <div className="card-back">
        <p>
          After logging in or creating an account, use the search bar to enter the contract address of an NFT collection and gain detailed insights.
        </p>
      </div>
    </div>

    {/* Card 2 */}
<div className="how-card">
  <div className="card-front">
  <h3 className="Landh">Top NFT Collections</h3>
  </div>
  <div className="card-back">
    <p>
      Explore the top NFT collections on the blockchain, gaining insights into trending projects and valuable assets.
    </p>
  </div>
</div>


    {/* Card 3 */}
    <div className="how-card">
      <div className="card-front">
      <h3 className="Landh">Favorites</h3>
      </div>
      <div className="card-back">
        <p>
          Add or remove collections to your favorites for quick access and effortless management.
        </p>
      </div>
    </div>

    {/* Card 4 */}
    <div className="how-card">
      <div className="card-front">
      <h3 className="Landh">Risk Analysis</h3>
      </div>
      <div className="card-back">
        <p>
          Enter a contract address to fetch metadata, which is analyzed by our advanced AI model to calculate a comprehensive risk score.
        </p>
      </div>
    </div>

    {/* Card 5 */}
    <div className="how-card">
      <div className="card-front">
      <h3 className="Landh">Marketplace Analysis</h3>
      </div>
      <div className="card-back">
        <p>
          Evaluate scores for various marketplaces like OpenSea and Tofu to choose the best trading platform.
        </p>
      </div>
    </div>

    {/* Card 6 */}
    <div className="how-card">
      <div className="card-front">
      <h3>Your Dashboard</h3>
      </div>
      <div className="card-back">
        <p>
          Access a comprehensive overview of your NFTs, collection count, marketplace rewards, and other essential data.
        </p>
      </div>
    </div>
  </div>
</section>


      <Footer/>
    </div>
    </>
  );
}

export default LandingPage;
