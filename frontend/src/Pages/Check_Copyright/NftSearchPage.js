import React, { useState } from 'react';
import axios from 'axios';
import NavBar from '../../components/NavBar';
import Footer from "../../components/Footer";
import './NftSearchPage.css';


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
        const response = await axios.post('https://nft-nexus-g7co.onrender.com/nft-image-upload', formData, {
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
    <div className="nft-search-page-container">
      <h1 className="nft-search-page-title">Find Similar NFTs</h1>
      <input className="nft-file-upload" type="file" accept="image/*" onChange={handleFileUpload} />

      {loading && <p className="nft-loading-message">Loading...</p>}
      {error && <p className="nft-error-message">{error}</p>}

      {nftData && !loading && (
        <div className="nft-result-container">
          {/* Top: Heading */}
          <h2 className="nft-result-heading">Top Match</h2>

          {/* Content: Left Image, Right Details */}
          <div className="nft-result-content">
            {/* Left: Image */}
            <img
              className="nft-result-image"
              src={nftData.metadata.token_image_url}
              alt={nftData.metadata.name}
            />

            {/* Right: Details */}
            <div className="nft-result-details">
              <h3 className="nft-result-title">{nftData.metadata.name}</h3>
              <p className="nft-result-info">Collection: {nftData.metadata.collection_name}</p>
              <p className="nft-result-similarity">
                Similarity Score: {nftData.metric_values.similarity_score.value * 100}%
              </p>
              <p className="nft-result-info">Similarity Category: {nftData.metric_values.similarity_category.value}</p>
            </div>
          </div>
        </div>
      )}
    </div>


    <Footer/>
    </>
  );
};

export default NftSearchPage;
