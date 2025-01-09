import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../../components/Loader';
import './TopNFTs.css';
import Footer from '../../components/Footer';

const NFTTable = () => {
  const [nfts, setNfts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('24h'); // State for selected time range

  const fetchNFTs = (page) => {
    setIsLoading(true);
    axios.get('https://api.unleashnfts.com/api/v1/transactions', {
      headers: {
        'accept': 'application/json',
        'x-api-key': '316dd88ae8840897e1f61160265d1a3f'
      },
      params: {
        currency: 'eth',
        blockchain: '1',
        transaction_type: 'trade',
        sort_by: 'transaction_price',
        sort_order: 'desc',
        time_range: timeRange, // Use the selected time range
        offset: page,
        limit: 10,
        is_washtrade: true
      }
    })
    .then(response => {
      setNfts(response.data.transactions);
      setIsLoading(false);
    })
    .catch(error => {
      console.error('Error fetching NFT data:', error);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchNFTs(currentPage);
  }, [currentPage, timeRange]); // Include timeRange in the dependency array

  return (
    <>
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="topnft-container">
          <h1 className="topnft-heading">Top NFTs in last {timeRange}</h1>
          <div>
            <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="topnft-dropdown">
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <table className="topnft-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {nfts.map((nft, index) => (
                <tr key={index}>
                  <td><img src={nft.metadata.token_image_url} alt={nft.metadata.name} /></td>
                  <td>{nft.metadata.name}</td>
                  <td>{nft.transaction_value.value} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="topnft-button" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
          <button className="topnft-button" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default NFTTable;
