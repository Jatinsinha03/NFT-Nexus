import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Main.css';
import Footer from '../../components/Footer'

function Main() {
  const [userDetails, setUserDetails] = useState({ name: "", walletAddress: "" });
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false); // Track dropdown state
  const [walletProfile, setWalletProfile] = useState({
    nftCount: 0,
    collectionCount: 0,
    marketplaceRewards: {
      blur: 0,
      looks: 0,
      rari: 0
    }
  });

  let navigate = useNavigate();

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen); // Toggle dropdown state

  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    navigate("/");
  };

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
      const walletData = unleashData.data[0];
      setWalletProfile({
        nftCount: walletData.nft_count,
        collectionCount: walletData.collection_count,
        marketplaceRewards: walletData.nft_marketplace_reward
      });
    } catch (err) {
      console.error("Error fetching data:", err);
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
    <div className="container">
  <div className="navbar">
    <div className="navbar-header">
      <h1>
        <div className="profile-name">{userDetails.name.charAt(0)}</div>
        Hello {userDetails.name}
      </h1>
    </div>
    <div className="dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        ▼
      </button>
      {dropdownOpen && (
        <div className="dropdown-content">
          <Link to="/favorite"><button>Show Favorites</button></Link>
          <Link to="/marketplacerisk"><button>Analyze Marketplace</button></Link>
          <Link to="/topnfts"><button>Top NFTs</button></Link>
          <p className='dropdown-walletAddress'>{formatWalletAddress(userDetails.walletAddress)}</p>
          <button style={{backgroundColor:'#ff7f50', color:"#ffffff"}} onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  </div>
  {/* search bar */}

  <form className="search-form" onSubmit={handleSearch}>
    <input
      type="text"
      placeholder="Search for NFTs by contract address..."
      value={searchQuery}
      className='searchBar'
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
<Footer/>
</>

  );
}

export default Main;
