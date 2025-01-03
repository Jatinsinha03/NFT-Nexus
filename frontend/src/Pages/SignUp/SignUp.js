import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Web3 from 'web3';

export default function SignUp(props) {
  const [signup, setSignUp] = useState({ name: "", email: "", password: "", cpassword: "", walletAddress: "" });
  let navigate = useNavigate();

  const handleConnectWallet = async () => {
    try {
      if (!window.ethereum) return alert('MetaMask not detected', 'warning');

      const web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      const walletAddress = accounts[0];

      setSignUp({ ...signup, walletAddress });
      alert('Wallet connected successfully', 'success');
    } catch (error) {
      alert('Failed to connect wallet', 'warning');
    }
  };

  const handleSubmit = async (e) => {
    const { name, email, password, cpassword, walletAddress } = signup;
    e.preventDefault();
    if (password !== cpassword) {
      return alert('Password does not match', 'warning');
    }
    if (!walletAddress) {
      return alert('Wallet address is required', 'warning');
    }
    const response = await fetch("http://localhost:8000/api/auth/createuser", {
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
  };

  const onchange = (e) => {
    setSignUp({ ...signup, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Name</label>
        <input type="text" className="form-control" onChange={onchange} required minLength={3} id="name" name="name" />
      </div>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email address</label>
        <input type="email" className="form-control" onChange={onchange} required id="email" name="email" />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input type="password" className="form-control" onChange={onchange} minLength={5} required name="password" id="password" />
      </div>
      <div className="mb-3">
        <label htmlFor="cpassword" className="form-label">Confirm Password</label>
        <input type="password" className="form-control" onChange={onchange} minLength={5} required name="cpassword" id="cpassword" />
      </div>
      <div className="mb-3">
        <label htmlFor="walletAddress" className="form-label">Wallet Address</label>
        <input
          type="text"
          className="form-control"
          value={signup.walletAddress}
          onChange={onchange}
          placeholder="Enter wallet address or use Connect Wallet"
          id="walletAddress"
          name="walletAddress"
        />
      </div>
      <button type="button" className="btn btn-secondary mb-3" onClick={handleConnectWallet}>
        Connect Wallet
      </button>
      <button type="submit" className="btn btn-primary">
        SignUp
      </button>
    </form>
  );
}
