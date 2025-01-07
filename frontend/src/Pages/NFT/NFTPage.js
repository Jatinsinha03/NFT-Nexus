import React, { useEffect, useState } from 'react';
import './NFTPage.css'
import { useParams } from 'react-router-dom';
import AnalyticsPage from '../Analytics/AnalyticsPage';
import PricePrediction from '../PricePrediction/PricePrediction';
import Footer from '../../components/Footer'

function NFTPage() {
    const { contractAddress } = useParams();
    const [nftData, setNftData] = useState(null);
    const fetchNftCollectionData = async () => {
        try {
          const response = await fetch(`https://api.unleashnfts.com/api/v2/nft/collection/metadata?sort_order=desc&offset=0&limit=30&contract_address=${contractAddress}`,
            {
              method: "GET",
              headers: {
                "accept": 'application/json',
                'x-api-key': '316dd88ae8840897e1f61160265d1a3f', // Your API key
              },
            }
          );
          const finalResponse = await response.json()
          
          setNftData(finalResponse.data[0]); // Assuming the first item is the relevant data
        } catch (error) {
          alert('Error fetching NFT collection data:', error);
        }
      };
  useEffect(() => {

    fetchNftCollectionData();
  }, [contractAddress]);

  if (!nftData) {
    return <div>Loading...</div>;
  }

  const handleFavorite = async () => {
    try {
  
      const response = await fetch("http://localhost:8000/api/nft/addToFavorite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token'),
        },
        body: JSON.stringify({
          blockchain: nftData.blockchain,
          contractAddress: nftData.contract_address,
          chainId: nftData.chain_id,
        }),
      });
  
      const json = await response.json();
  
      if (response.ok) {
        alert("Added to favorites");
      } else {
        alert(`Failed to add to favorites: ${json.message || "Unknown error"}`);
      }
    } catch (error) {
      alert("An error occurred while adding to favorites.");
    }
  };
  

  return (
    <>
    <div className="nft-page">
      <div className="banner">
        <img src={nftData.banner_image_url} alt="Banner" className="banner-img" />
      </div>
      <div className="nft-info">
        <h1>{nftData.collection}</h1>
        <button onClick={handleFavorite}>Add to Favorite</button>
        <p>{nftData.description}</p>
        <div className="links">
          {nftData.external_url && (
            <a href={nftData.external_url} target="_blank" rel="noopener noreferrer">
              Official Website
            </a>
          )}
          {nftData.discord_url && (
            <a href={nftData.discord_url} target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          )}
          {nftData.instagram_url && (
            <a href={nftData.instagram_url} target="_blank" rel="noopener noreferrer">
              Instagram
            </a>
          )}
          {nftData.twitter_url && (
            <a href={nftData.twitter_url} target="_blank" rel="noopener noreferrer">
              Twitter
            </a>
          )}
          {nftData.marketplace_url && (
            <a href={nftData.marketplace_url} target="_blank" rel="noopener noreferrer">
              OpenSea Marketplace
            </a>
          )}
        </div>
      </div>
      <div className="nft-image">
        <img src={nftData.image_url} alt={nftData.collection} />
      </div>  
      <AnalyticsPage contractAddress={contractAddress}/>
      <PricePrediction blockchain={nftData.blockchain} contractAddress={contractAddress} chainId={1000}/>
    </div>
    <Footer/>
    </>
  );
}

export default NFTPage;
