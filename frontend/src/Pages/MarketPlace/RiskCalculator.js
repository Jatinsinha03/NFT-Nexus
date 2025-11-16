import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RiskCalculator.css'
import Footer from '../../components/Footer'
import NavBar from '../../components/NavBar'

const RiskCalculator = () => {
  // State to hold user inputs and API data
  const [blockchain, setBlockchain] = useState('ethereum');
  const [marketplaceName, setMarketplaceName] = useState('');
  const [riskScore, setRiskScore] = useState(null);
  const [marketplaceData, setMarketplaceData] = useState(null);

  // Function to fetch data based on user input
  const fetchData = async () => {
    try {
      // Use backend proxy to avoid CORS issues
      const [analyticsResponse, tradersResponse, washtradeResponse] = await Promise.all([
        axios.get(`https://nft-nexus-backend.onrender.com/api/unleash/marketplace/analytics`, {
          params: {
            blockchain,
            name: marketplaceName,
            time_range: 'all',
            sort_by: 'name',
            sort_order: 'desc',
            limit: 30,
            offset: 0
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`https://nft-nexus-backend.onrender.com/api/unleash/marketplace/traders`, {
          params: {
            blockchain,
            name: marketplaceName,
            time_range: 'all',
            sort_by: 'name',
            sort_order: 'desc',
            limit: 30,
            offset: 0
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }),
        axios.get(`https://nft-nexus-backend.onrender.com/api/unleash/marketplace/washtrade`, {
          params: {
            blockchain,
            name: marketplaceName,
            time_range: 'all',
            sort_by: 'name',
            sort_order: 'desc',
            limit: 30,
            offset: 0
          },
          headers: {
            'Content-Type': 'application/json'
          }
        })
      ]);

      const marketplaceData = {
        analytics: analyticsResponse.data.data[0],
        traders: tradersResponse.data.data[0],
        washtrades: washtradeResponse.data.data[0]
      };

      setMarketplaceData(marketplaceData);
      calculateRisk(marketplaceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Calculate risk score based on fetched data
  const calculateRisk = (data) => {
    const { analytics, traders, washtrades } = data;

    // Step 1: Market Activity Risk
    const marketActivityRisk = analytics.sales === 0 && analytics.volume === 0 ? 1 : (analytics.transactions_change / 100) + (analytics.transfers_change / 100);

    // Step 2: Wash Trade Risk
    const washTradeRisk = washtrades.washtrade_assets === '0' ? 0 : 1;

    // Step 3: Trader Activity Risk
    const traderRatio = traders.traders_ratio < 0.5 ? 1 : traders.traders_ratio > 0.9 ? 0 : 0.5;
    const traderChange = (traders.traders_sellers_change - traders.traders_buyers_change) / 100;

    // Final Risk Score Calculation
    const finalRiskScore = (0.4 * marketActivityRisk) + (0.2 * washTradeRisk) + (0.4 * (traderRatio + traderChange));

    setRiskScore(finalRiskScore);
  };

  // Handle user input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'blockchain') {
      setBlockchain(value);
    } else if (name === 'marketplaceName') {
      setMarketplaceName(value);
    }
  };

  // Handle submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Determine risk level based on score
  const determineRiskLevel = (score) => {
    if (score >= 0.7) return "High Risk";
    if (score >= 0.3) return "Medium Risk";
    return "Low Risk";
  };

  return (
    <>
    <NavBar/>
    <div className="RiskCalc-container">
      <h1 className="RiskCalc-header">NFT Marketplace Risk Calculator</h1>
      <form className="RiskCalc-form" onSubmit={handleSubmit}>
      <div className="RiskCalc-form-group">
  <label className="RiskCalc-label">Blockchain:</label>
  <select
    className="RiskCalc-select"
    name="blockchain"
    value={blockchain}
    onChange={handleInputChange}
  >
    <option value="ethereum">Ethereum</option>
    <option value="polygon">Polygon</option>
    {/* Add more blockchains as needed */}
  </select>
</div>

        <div className="RiskCalc-form-group">
          <label className="RiskCalc-label">Marketplace Name:</label>
          <input
            className="RiskCalc-input"
            type="text"
            name="marketplaceName"
            value={marketplaceName}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="RiskCalc-button" type="submit">
          Get Risk Score
        </button>
      </form>
  
      {riskScore !== null && (
        <div className="RiskCalc-score-container">
          <h2 className="RiskCalc-score">Risk Score: {riskScore.toFixed(2)}</h2>
          <h3 className="RiskCalc-risk-level">
            Risk Level: {determineRiskLevel(riskScore)}
          </h3>
        </div>
      )}
  
      {marketplaceData && (
        <div className="RiskCalc-data">
        <h3 className="RiskCalc-data-header">Marketplace Information</h3>
        <div className="RiskCalc-data-grid">
          <div className="RiskCalc-data-box">
            <p><strong>Marketplace:</strong> {marketplaceData.analytics.name}</p>
          </div>
          <div className="RiskCalc-data-box">
            <p><strong>Transactions:</strong> {marketplaceData.analytics.transactions}</p>
          </div>
          <div className="RiskCalc-data-box">
            <p><strong>Transfers:</strong> {marketplaceData.analytics.transfers}</p>
          </div>
          <div className="RiskCalc-data-box">
            <p><strong>Wash Trade Suspect Sales:</strong> {marketplaceData.washtrades.washtrade_suspect_sales}</p>
          </div>
          <div className="RiskCalc-data-box">
            <p><strong>Traders:</strong> {marketplaceData.traders.traders}</p>
          </div>
        </div>
      </div>
      
      )}
    </div>
      <Footer/>
      </>
  );
};  

export default RiskCalculator;
