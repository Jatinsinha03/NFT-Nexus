import React, { useEffect, useState } from 'react';

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

    fetchPricePrediction();
  }, [contractAddress, blockchain]);

  if (loading) return <div>Loading price prediction...</div>;
  if (error) return <div>Error: {error}</div>;

  const {
    price_estimate,
    price_estimate_lower_bound,
    price_estimate_upper_bound,
    nft_rarity_drivers,
    nft_sales_drivers,
    collection_drivers,
  } = priceData;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Price Prediction</h2>
      
      <div style={{ marginBottom: '10px' }}>
        <h3>Price Estimate: {price_estimate.toFixed(2)} ETH</h3>
        <p>Lower Bound: {price_estimate_lower_bound.toFixed(2)} ETH</p>
        <p>Upper Bound: {price_estimate_upper_bound.toFixed(2)} ETH</p>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <h4>Rarity Drivers: {nft_rarity_drivers}</h4>
        <h4>Sales Drivers: {nft_sales_drivers}</h4>
        <h4>Collection Drivers: {collection_drivers}</h4>
      </div>
    </div>
  );
};

export default PricePrediction;
