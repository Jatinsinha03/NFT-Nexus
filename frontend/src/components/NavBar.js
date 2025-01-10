import React, { useState, useEffect } from 'react';
import { Link, useLocation,useNavigate } from 'react-router-dom';

function NavBar() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [userDetails, setUserDetails] = useState({ name: "", walletAddress: "" });
    const location = useLocation();  // Hook to get the current location
    const navigate = useNavigate()
    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

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
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        showUserDetail();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate("/")
    };

    const formatWalletAddress = (address) => {
        return address ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : '';
    };

    // Helper function to determine if a path is active
    const isActive = (path) => location.pathname === path;
    const isHomePage = location.pathname === "/";

    
    return (
        <div 
  className="navbar"
  style={{
    display: 'flex',
    justifyContent: 'space-between', // Ensures separation between the logo/back and the controls
    alignItems: 'center',
    padding: '10px 20px', // Provides some padding around the elements
    backgroundColor: 'transparent', // Light gray background for visibility
    
  }}
>
    <div style={{display:"flex",alignItems:"center"}} className="navbar-logo-and-back">
        <div className="navbar-back">
            {!isHomePage&&<button onClick={() => window.history.back()}>&#x2190;</button>} {/* Back arrow */}
        </div>
        <h1 className='navbar-logo'>NFT NEXUS</h1>
    </div>
    {!isHomePage &&
    <div className="navbar-controls">
        <div className="navbar-header">
            <h1>
                <div className="profile-name">{userDetails.name ? userDetails.name.charAt(0) : '?'}</div>
                Hello {userDetails.name || 'Guest'}
            </h1>
        </div>
        <div className="dropdown">
            <button className="dropdown-button" onClick={toggleDropdown}>
                ▼
            </button>
            {dropdownOpen && (
                <div className="dropdown-content">
                    <Link to="/main">
                        <button style={isActive('/main') ? { backgroundColor: 'green', color: "#ffffff" } : null}>
                            Dashboard
                        </button>
                    </Link>
                    <Link to="/favorite">
                        <button style={isActive('/favorite') ? { backgroundColor: 'green', color: "#ffffff" } : null}>
                            Show Favorites
                        </button>
                    </Link>
                    <Link to="/marketplacerisk">
                        <button style={isActive('/marketplacerisk') ? { backgroundColor: 'green', color: "#ffffff" } : null}>
                            Analyze Marketplace
                        </button>
                    </Link>
                    <Link to="/topnfts">
                        <button style={isActive('/topnfts') ? { backgroundColor: 'green', color: "#ffffff" } : null}>
                            Top NFTs
                        </button>
                    </Link>
                    <p className='dropdown-walletAddress'>{formatWalletAddress(userDetails.walletAddress)}</p>
                    <button style={{ backgroundColor: '#ff7f50', color: "#ffffff" }} onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            )}
        </div>
    </div>}
</div>

    );
}

export default NavBar;
