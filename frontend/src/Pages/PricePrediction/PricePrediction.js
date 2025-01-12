import React, { useState } from 'react';
import './PricePrediction.css';

const PricePrediction = ({ contractAddress, blockchain }) => {
  const [priceData, setPriceData] = useState(null);
  const [tokenId, setTokenId] = useState(''); // State for token ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePredict = async () => {
    if (!tokenId) {
      setError('Please enter a valid Token ID.');
      return;
    }

    setLoading(true);
    setError('');
    setPriceData(null);

    try {
      const response = await fetch(
        `https://api.unleashnfts.com/api/v2/nft/liquify/price_estimate?blockchain=${blockchain}&contract_address=${contractAddress}&token_id=${tokenId}`,
        {
          headers: {
            accept: 'application/json',
            'x-api-key': '316dd88ae8840897e1f61160265d1a3f',
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

  return (
    <>
      <div className="PricePred-container">
        <h2 className="PricePred-header">Price Prediction</h2>

        {/* Token ID Input */}
        <div className="PricePred-input">
          <input
            type="text"
            placeholder="Enter Token ID"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
          />
          <button onClick={handlePredict}>Predict</button>
        </div>

        {/* Loading and Error Handling */}
        {loading && <div className="PricePred-loading">Loading price prediction...</div>}
        {error && <div className="PricePred-error">Error: {error}</div>}

        {/* Display Prediction Results */}
        {priceData && (
          <>
            <div className="PricePred-row">
              <div className="PricePred-box">
                <h3>Price Estimate</h3>
                <p>{priceData.price_estimate.toFixed(2)} ETH</p>
              </div>
              <div className="PricePred-box">
                <h3>Lower Bound</h3>
                <p>{priceData.price_estimate_lower_bound.toFixed(2)} ETH</p>
              </div>
              <div className="PricePred-box">
                <h3>Upper Bound</h3>
                <p>{priceData.price_estimate_upper_bound.toFixed(2)} ETH</p>
              </div>
            </div>

            <div className="PricePred-row">
              <div className="PricePred-box">
                <h3>Rarity Drivers</h3>
                <p>{priceData.nft_rarity_drivers}</p>
              </div>
              <div className="PricePred-box">
                <h3>Sales Drivers</h3>
                <p>{priceData.nft_sales_drivers}</p>
              </div>
              <div className="PricePred-box">
                <h3>Collection Drivers</h3>
                <p>{priceData.collection_drivers}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PricePrediction;
