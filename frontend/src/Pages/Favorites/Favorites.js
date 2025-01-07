import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
<<<<<<< HEAD
import './Favourite.css'
=======
import Footer from '../../components/Footer'
>>>>>>> 73cbbf78a6d8dd5120839cdff487a2c96821d515

function Favorites() {
  const [favoriteNfts, setFavoriteNfts] = useState([]);
  const [nftDetails, setNftDetails] = useState([]);

  

  const fetchNftCollectionData = async (contractAddress) => {
    try {
      const response = await fetch(
        `https://api.unleashnfts.com/api/v2/nft/collection/metadata?sort_order=desc&offset=0&limit=30&contract_address=${contractAddress}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
            "x-api-key": "316dd88ae8840897e1f61160265d1a3f", // Your API key
          },
        }
      );
      const finalResponse = await response.json();
      console.log("NFT details fetched:", finalResponse.data[0]);
      return finalResponse.data[0]; // Assuming the first item is relevant data
    } catch (error) {
      console.error("Error fetching NFT collection data:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFavoritesWithDetails = async () => {
      try {
        // Fetch user favorites
        const call = await fetch("http://localhost:8000/api/nft/getFavorites", {
          method: "GET",
          headers: {
            "accept": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });
        const fetchedFavorites = await call.json();
  
        // Extract the favorites array
        const favoritesArray = fetchedFavorites.favorites;
  
        if (Array.isArray(favoritesArray)) {
          setFavoriteNfts(favoritesArray); // Update state with the extracted array
  
          // Fetch NFT details for each favorite
          const detailsPromises = favoritesArray.map(async (nft) => {
            return await fetchNftCollectionData(nft.contractAddress);
          });
  
          const details = await Promise.all(detailsPromises);
          setNftDetails(details.filter((item) => item !== null)); // Remove failed fetches
        } else {
          console.error("Favorites data is not an array:", favoritesArray);
        }
      } catch (error) {
        console.error("Error fetching favorites or details:", error);
      }
    };
  
    fetchFavoritesWithDetails();
  }, []);

  return (
<<<<<<< HEAD
    <div className="Favorite-page">
  <h1>Your Favorites</h1>
  <div className="Favorite-list">
    {nftDetails.length === 0 ? (
      <p>Loading...</p>
    ) : (
      nftDetails.map((nft, index) => (
        <div key={index} className="Favorite-item">
          {/* Image Section */}
          <div className="Favorite-image">
            <img src={nft.image_url} alt={nft.collection} />
          </div>
          {/* Info Section */}
          <div className="Favorite-info">
            <h2>{nft.collection}</h2>
            <p>{nft.description}</p>
            <Link to={`/nft/${nft.contract_address}`}>
              <button className="Favorite-button">View</button>
            </Link>
          </div>
        </div>
      ))
    )}
  </div>
</div>

=======
    <div className="favorites-page">
      <h1>Your Favorites</h1>
      <div className="favorites-list">
        {nftDetails.length === 0 ? (
          <p>Loading...</p>
        ) : (
          nftDetails.map((nft, index) => (
            <div key={index} className="favorite-nft">
              <div className="nft-info">
                <h2>{nft.collection}</h2>
                <p>{nft.description}</p>
              </div>
              <div className="nft-image">
                <img src={nft.image_url} alt={nft.collection} />
              </div>
              <Link to={`/nft/${nft.contract_address}`}><button>View</button></Link>
            </div>
          ))
        )}
      </div>
      <Footer/>
    </div>
>>>>>>> 73cbbf78a6d8dd5120839cdff487a2c96821d515
  );
}

export default Favorites;