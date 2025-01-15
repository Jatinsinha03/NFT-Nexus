import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Web3 from 'web3';
import './SignUp.css'; // Import the new CSS file
import Loader from '../../components/Loader'; // Import the Loader component

export default function SignUp(props) {
  const [signup, setSignUp] = useState({ name: "", email: "", password: "", cpassword: "", walletAddress: "" });
  const [loading, setLoading] = useState(false); // State to track loading status
  let navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      setLoading(true); // Start loader
      if (!window.ethereum) {
        alert('MetaMask not detected', 'warning');
        setLoading(false);
        return;
      }

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const walletAddress = accounts[0];

      setSignUp({ ...signup, walletAddress });
      alert('Wallet connected successfully', 'success');
    } catch (error) {
      alert('Failed to connect wallet', 'warning');
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, cpassword, walletAddress } = signup;

    if (password !== cpassword) {
      return alert('Password does not match', 'warning');
    }
    if (!walletAddress) {
      return alert('Wallet address is required', 'warning');
    }

    try {
      setLoading(true); // Start loader
      const response = await fetch("https://nft-nexus-backend.onrender.com/api/auth/createuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, walletAddress }),
      });

      const json = await response.json();
      if (json.success) {
        localStorage.setItem('token', json.authToken);
        alert("Account created Successfully", "success");
        navigate("/main");
      } else {
        alert("Invalid Credentials", "warning");
      }
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("An error occurred. Please try again.", "warning");
    } finally {
      setLoading(false); // Stop loader
    }
  };

  const onchange = (e) => {
    setSignUp({ ...signup, [e.target.name]: e.target.value });
  };

  return (
    <div className="signup-body">
      {loading && <Loader />} {/* Display loader when loading */}
      <div id="signup-background-text">NFT NEXUS</div>
      <div className="signup-container">
        <form onSubmit={handleSubmit} className="signup-form">
          <h2 className="signup-title">Create Account</h2>
          <div className="signup-mb-3">
            <label htmlFor="signup-name" className="signup-form-label">Name</label>
            <input
              type="text"
              className="signup-form-control"
              onChange={onchange}
              required
              minLength={3}
              id="signup-name"
              name="name"
              placeholder="Enter your name"
            />
          </div>
          <div className="signup-mb-3">
            <label htmlFor="signup-email" className="signup-form-label">Email Address</label>
            <input
              type="email"
              className="signup-form-control"
              onChange={onchange}
              required
              id="signup-email"
              name="email"
              placeholder="Enter your email"
            />
          </div>
          <div className="signup-mb-3">
            <label htmlFor="signup-password" className="signup-form-label">Password</label>
            <input
              type="password"
              className="signup-form-control"
              onChange={onchange}
              minLength={5}
              required
              name="password"
              id="signup-password"
              placeholder="Enter your password"
            />
          </div>
          <div className="signup-mb-3">
            <label htmlFor="signup-cpassword" className="signup-form-label">Confirm Password</label>
            <input
              type="password"
              className="signup-form-control"
              onChange={onchange}
              minLength={5}
              required
              name="cpassword"
              id="signup-cpassword"
              placeholder="Confirm your password"
            />
          </div>
          <div className="signup-mb-3">
            <label htmlFor="signup-walletAddress" className="signup-form-label">Wallet Address</label>
            <input
              type="text"
              className="signup-form-control"
              value={signup.walletAddress}
              onChange={onchange}
              placeholder="Enter wallet address or connect your wallet"
              id="signup-walletAddress"
              name="walletAddress"
            />
          </div>
          <button type="button" className="signup-btn-secondary signup-mb-3" onClick={handleConnectWallet}>
            Connect Wallet
          </button>
          <button type="submit" className="signup-btn-primary">Sign Up</button>
          <p className="signup-text">
            Already have an account? <Link to="login">Log in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
