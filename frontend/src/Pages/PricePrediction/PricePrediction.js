import React, { useEffect, useState } from 'react';
import './PricePrediction.css'
import NavBar from '../../components/NavBar';

const PricePrediction = ({ contractAddress, blockchain, chainId }) => {
  const [priceData, setPriceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPricePrediction = async () => {
      try {
        const response = await fetch(
          `https://api.unleashnfts.com/api/v2/nft/liquify/price_estimate?blockchain=${blockchain}&contract_address=${contractAddress}&token_id=${chainId}`,
          {
            headers: {
              accept: 'application/json',
              'x-api-key': '25b658b989ac45f289e072ec17975772',
            },
          }
        );
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          setPriceData(data.data[0]);
        } else {
          throw new Error('No price data available.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch price prediction data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPricePrediction();
  }, [contractAddress, blockchain]);

  if (loading) return <div className="PricePred-loading">Loading price prediction...</div>;
  if (error) return <div className="PricePred-error">Error: {error}</div>;

  const {
    price_estimate,
    price_estimate_lower_bound,
    price_estimate_upper_bound,
    nft_rarity_drivers,
    nft_sales_drivers,
    collection_drivers,
  } = priceData;

  return (
    <>
    
    <div className="PricePred-container">
      <h2 className="PricePred-header">Price Prediction</h2>
      
      <div className="PricePred-row">
        <div className="PricePred-box">
          <h3>Price Estimate</h3>
          <p>{price_estimate.toFixed(2)} ETH</p>
        </div>
        <div className="PricePred-box">
          <h3>Lower Bound</h3>
          <p>{price_estimate_lower_bound.toFixed(2)} ETH</p>
        </div>
        <div className="PricePred-box">
          <h3>Upper Bound</h3>
          <p>{price_estimate_upper_bound.toFixed(2)} ETH</p>
        </div>
      </div>
  
      <div className="PricePred-row">
        <div className="PricePred-box">
          <h3>Rarity Drivers</h3>
          <p>{nft_rarity_drivers}</p>
        </div>
        <div className="PricePred-box">
          <h3>Sales Drivers</h3>
          <p>{nft_sales_drivers}</p>
        </div>
        <div className="PricePred-box">
          <h3>Collection Drivers</h3>
          <p>{collection_drivers}</p>
        </div>
      </div>
    </div>
    </>
  );
  
};

export default PricePrediction;
