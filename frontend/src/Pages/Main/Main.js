import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';

function Main() {
  const [userDetails, setUserDetails] = useState({ name: "", walletAddress: "" });
  const [searchQuery, setSearchQuery] = useState('');
  const [walletProfile, setWalletProfile] = useState({
    nftCount: "0",
    collectionCount: "0",
    marketplaceRewards: {
      blur: 0,
      looks: 0,
      rari: 0
    }
  });

  let navigate = useNavigate();

  const showUserDetail = async () => {
    try {
      const response = await fetch("https://nft-nexus-backend.onrender.com/api/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem('token')
        },
      });

      const json = await response.json();
      setUserDetails({ name: json.name, walletAddress: json.walletAddress });

      // Use backend proxy to avoid CORS issues
      const unleashResponse = await fetch(
        `https://nft-nexus-backend.onrender.com/api/unleash/wallet/profile?wallet=${json.walletAddress}&offset=0&limit=30`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const unleashData = await unleashResponse.json();

      // Safely extract data with default fallback values
      const walletData = unleashData.data && unleashData.data[0] ? unleashData.data[0] : null;
      if (walletData) {
        setWalletProfile({
          nftCount: walletData.nft_count || "Data not found",
          collectionCount: walletData.collection_count || "Data not found",
          marketplaceRewards: {
            blur: walletData.nft_marketplace_reward?.blur || 0,
            looks: walletData.nft_marketplace_reward?.looks || 0,
            rari: walletData.nft_marketplace_reward?.rari || 0
          }
        });
      } else {
        setWalletProfile({
          nftCount: "Data not found",
          collectionCount: "Data not found",
          marketplaceRewards: {
            blur: 0,
            looks: 0,
            rari: 0
          }
        });
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setWalletProfile({
        nftCount: "Data not found",
        collectionCount: "Data not found",
        marketplaceRewards: {
          blur: 0,
          looks: 0,
          rari: 0
        }
      });
    }
  };

  function formatWalletAddress(address) {
    return address ? `${address.slice(0, 4)}...${address.slice(-2)}` : '';
  }

  useEffect(() => {
    showUserDetail();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    navigate(`/nft/${searchQuery}`);
  };

  return (
    <>
      <NavBar />
      <div className="container">
        {/* Search bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search for NFTs by contract address..."
            value={searchQuery}
            className="searchBar"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <div className="stats-row">
          <div className="stats-box">
            <h3>NFT Count</h3>
            <p>{walletProfile.nftCount}</p>
          </div>
          <div className="stats-box">
            <h3>Collection Count</h3>
            <p>{walletProfile.collectionCount}</p>
          </div>
        </div>

        <div className="center-box">
          <h3>Marketplace Rewards</h3>
          <ul>
            <li>Blur: {walletProfile.marketplaceRewards.blur.toFixed(2)}</li>
            <li>LooksRare: {walletProfile.marketplaceRewards.looks.toFixed(2)}</li>
            <li>Rarible: {walletProfile.marketplaceRewards.rari.toFixed(2)}</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Main;
