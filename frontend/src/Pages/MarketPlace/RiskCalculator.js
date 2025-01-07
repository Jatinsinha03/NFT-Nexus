import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../../components/Footer';

const RiskCalculator = () => {
  // State to hold user inputs and API data
  const [blockchain, setBlockchain] = useState('ethereum');
  const [marketplaceName, setMarketplaceName] = useState('');
  const [riskScore, setRiskScore] = useState(null);
  const [marketplaceData, setMarketplaceData] = useState(null);

  // Function to fetch data based on user input
  const fetchData = async () => {
    const apiKey = '316dd88ae8840897e1f61160265d1a3f';

    try {
      const [analyticsResponse, tradersResponse, washtradeResponse] = await Promise.all([
        axios.get(`https://api.unleashnfts.com/api/v2/nft/marketplace/analytics`, {
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
            'x-api-key': apiKey
          }
        }),
        axios.get(`https://api.unleashnfts.com/api/v2/nft/marketplace/traders`, {
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
            'x-api-key': apiKey
          }
        }),
        axios.get(`https://api.unleashnfts.com/api/v2/nft/marketplace/washtrade`, {
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
            'x-api-key': apiKey
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
    <div>
      <h1>NFT Marketplace Risk Calculator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Blockchain: </label>
          <select name="blockchain" value={blockchain} onChange={handleInputChange}>
            <option value="ethereum">Ethereum</option>
            <option value="polygon">Polygon</option>
            {/* Add more blockchains as needed */}
          </select>
        </div>
        <div>
          <label>Marketplace Name: </label>
          <input
            type="text"
            name="marketplaceName"
            value={marketplaceName}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit">Get Risk Score</button>
      </form>

      {riskScore !== null && (
        <div>
          <h2>Risk Score: {riskScore.toFixed(2)}</h2>
          <h3>Risk Level: {determineRiskLevel(riskScore)}</h3>
        </div>
      )}

      {marketplaceData && (
        <div>
          <h3>Marketplace Information:</h3>
          <p>Marketplace: {marketplaceData.analytics.name}</p>
          <p>Transactions: {marketplaceData.analytics.transactions}</p>
          <p>Transfers: {marketplaceData.analytics.transfers}</p>
          <p>Wash Trade Suspect Sales: {marketplaceData.washtrades.washtrade_suspect_sales}</p>
          <p>Traders: {marketplaceData.traders.traders}</p>
        </div>
      )}
    </div>
     <Footer/>
     </>
  );
};

export default RiskCalculator;
