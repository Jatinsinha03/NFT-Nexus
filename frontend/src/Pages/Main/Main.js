import React, { useEffect, useState } from 'react';
import { useNavigate,Link } from 'react-router-dom'; 

function Main() {
  const [userDetails, setUserDetails] = useState({ name: "", walletAddress: "" });
  const [searchQuery, setSearchQuery] = useState('');
  let navigate = useNavigate()
  const [walletProfile, setWalletProfile] = useState({
    nftCount: 0,
    collectionCount: 0,
    marketplaceRewards: {
      blur: 0,
      looks: 0,
      rari: 0
    }
  });

  // Fetch user details
  const showUserDetail = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
      });
      const json = await response.json();
      setUserDetails({ name: json.name, walletAddress: json.walletAddress });

      // Fetch wallet profile from UnleashNFTs API using CORS
      const unleashResponse = await fetch(
        `https://api.unleashnfts.com/api/v2/nft/wallet/profile?wallet=${json.walletAddress}&offset=0&limit=30`,
        {
          method: "GET",
          headers: {
            "accept": "application/json",
            "x-api-key": "316dd88ae8840897e1f61160265d1a3f",
          },
        }
      );

      const unleashData = await unleashResponse.json();
      const walletData = unleashData.data[0]; // Access the first wallet profile
      setWalletProfile({
        nftCount: walletData.nft_count,
        collectionCount: walletData.collection_count,
        marketplaceRewards: walletData.nft_marketplace_reward
      });
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    showUserDetail();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
        navigate(`/nft/${searchQuery}`); // Redirect to NFT page
      
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Hello {userDetails.name}</h1>
      <Link to="/favorite"><button>Show Favorites</button></Link>
      <h2>Wallet Address: {userDetails.walletAddress}</h2>
      <h3>NFT Count: {walletProfile.nftCount}</h3>
      <h3>Collection Count: {walletProfile.collectionCount}</h3>
      <h3>Marketplace Rewards:</h3>
      <ul>
        <li>Blur: {walletProfile.marketplaceRewards.blur.toFixed(2)}</li>
        <li>LooksRare: {walletProfile.marketplaceRewards.looks.toFixed(2)}</li>
        <li>Rarible: {walletProfile.marketplaceRewards.rari.toFixed(2)}</li>
      </ul>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search for NFTs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: "10px", width: "250px" }}
        />
        <button type="submit" style={{ padding: "10px", marginLeft: "10px" }}>Search</button>
      </form>
    </div>
    
  );
}

export default Main;
