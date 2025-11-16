import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Favourite.css';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
import Loader from '../../components/Loader';

function Favorites() {
  const [favoriteNfts, setFavoriteNfts] = useState([]);
  const [nftDetails, setNftDetails] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [noFavorites, setNoFavorites] = useState(false); // Track if no favorites exist

  const fetchNftCollectionData = async (contractAddress) => {
    try {
      // Use backend proxy to avoid CORS issues
      const response = await fetch(
        `https://nft-nexus-backend.onrender.com/api/unleash/collection/metadata?sort_order=desc&offset=0&limit=30&contract_address=${contractAddress}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const finalResponse = await response.json();
      return finalResponse.data?.[0] || null; // Return the first item or null
    } catch (error) {
      console.error('Error fetching NFT collection data:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchFavoritesWithDetails = async () => {
      try {
        setLoading(true); // Start loading
        setNoFavorites(false); // Reset no favorites state

        const call = await fetch('https://nft-nexus-backend.onrender.com/api/nft/getFavorites', {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'auth-token': localStorage.getItem('token'),
          },
        });

        if (!call.ok) {
          throw new Error(`Failed to fetch favorites: ${call.statusText}`);
        }

        const fetchedFavorites = await call.json();

        // Check if the response indicates no favorites
        if (fetchedFavorites.message === 'No favorite NFTs found') {
          setNoFavorites(true); // Set no favorites state
          setFavoriteNfts([]); // Ensure the state is cleared
          return;
        }

        // Validate the favorites array
        const favoritesArray = fetchedFavorites.favorites || [];
        setFavoriteNfts(favoritesArray);

        // Fetch NFT details for each favorite
        const detailsPromises = favoritesArray.map((nft) => fetchNftCollectionData(nft.contractAddress));
        const details = await Promise.all(detailsPromises);

        setNftDetails(details.filter((item) => item !== null)); // Filter out null items
      } catch (error) {
        console.error('Error fetching favorites or details:', error);
        setNoFavorites(true); // Set no favorites on error
        setFavoriteNfts([]);
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchFavoritesWithDetails();
  }, []);

  const handleRemove = async (contractAddress) => {
    try {
      const response = await fetch('https://nft-nexus-backend.onrender.com/api/nft/removeFavorite', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('token'),
        },
        body: JSON.stringify({
          contractAddress: contractAddress,
        }),
      });

      const json = await response.json();

      if (response.ok) {
        alert('Removed from favorites');
        // Update the nftDetails state to filter out the removed NFT
        setNftDetails((prevDetails) =>
          prevDetails.filter((nft) => nft.contract_address !== contractAddress)
        );
      } else {
        alert(`Failed to remove from favorites: ${json.message || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An error occurred while removing from favorites.');
    }
  };

  return (
    <>
      <NavBar />
      <div className="Favorite-page">
        <h1>
          {loading
            ? 'Loading...'
            : noFavorites
            ? 'No Favorites to Show'
            : 'Your Favorites'}
        </h1>
        <div className="Favorite-list">
          {loading ? (
            <Loader />
          ) : noFavorites ? (
            <p>No favorite NFTs found. Start adding some to your list!</p>
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
                  <button
                    onClick={() => handleRemove(nft.contract_address)}
                    className="Remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Favorites;
