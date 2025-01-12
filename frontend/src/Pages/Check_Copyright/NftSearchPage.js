import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Footer from "../../components/Footer";


const NftSearchPage = () => {
  const [nftData, setNftData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('image', file);

      try {
        // Send the file to your Flask server
        const response = await axios.post('http://localhost:3030/nft-image-upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.nfts && response.data.nfts.length > 0) {
          setNftData(response.data.nfts[0]);  // Get the top match
        } else {
          setError('No similar NFTs found');
        }
      } catch (err) {
        console.error('Error fetching NFT data:', err);
        setError('An error occurred while fetching NFT data');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
    <NavBar/>
    <div className="nft-search-page">
      <h1>Find Similar NFTs</h1>
      <input type="file" accept="image/*" onChange={handleFileUpload} />
      
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {nftData && !loading && (
        <div className="nft-result">
          <h2>Top Match</h2>
          <img src={nftData.metadata.token_image_url} alt={nftData.metadata.name} />
          <h3>{nftData.metadata.name}</h3>
          <p>Collection: {nftData.metadata.collection_name}</p>
          <p>Similarity Score: {nftData.metric_values.similarity_score.value*100}%</p>
          <p>Similarity Category: {nftData.metric_values.similarity_category.value}</p>
        </div>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default NftSearchPage;
