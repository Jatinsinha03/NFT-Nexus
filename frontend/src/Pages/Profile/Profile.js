import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import NavBar from '../../components/NavBar'

const Profile = () => {
  const [userDetails, setUserDetails] = useState({ name: "", walletAddress: "" });
  const [erc20Portfolio, setErc20Portfolio] = useState([]);
  const [nftPortfolio, setNftPortfolio] = useState([]);
  const [erc20Page, setErc20Page] = useState(0);
  const [nftPage, setNftPage] = useState(0);

  useEffect(() => {
    // Fetch user details
    const fetchUserDetails = async () => {
      const response = await fetch("https://nft-nexus-backend.onrender.com/api/auth/getuser", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      setUserDetails({ name: json.name, walletAddress: json.walletAddress });
    };

    // Fetch ERC-20 portfolio
    const fetchErc20Portfolio = async () => {
      const response = await axios.get(
        `https://api.unleashnfts.com/api/v2/wallet/balance/token?address=${userDetails.walletAddress}&blockchain=ethereum&time_range=all&offset=${erc20Page}&limit=30`,
        {
          headers: {
            accept: "application/json",
            "x-api-key": "316dd88ae8840897e1f61160265d1a3f",
          },
        }
      );
      setErc20Portfolio(response.data.data);
    };

    // Fetch NFT portfolio
    const fetchNftPortfolio = async () => {
        try {
          const response = await axios.get(   
            `https://api.unleashnfts.com/api/v2/wallet/balance/nft?wallet=${userDetails.walletAddress}&blockchain=ethereum&time_range=all&offset=${nftPage}&limit=30`,
            {
              headers: {
                accept: "application/json",
                "x-api-key": "316dd88ae8840897e1f61160265d1a3f", // Ensure API key is correct
              },
            }
          );
          
          // Check if data exists
          if (response.data.data) {
            setNftPortfolio(response.data.data); // Update NFT portfolio state
          } else {
            console.log("No NFTs found for this page.");
          }
        } catch (error) {
          console.error("Error fetching NFT portfolio: ", error.response || error);
          if (error.response) {
            console.error("API Response Error: ", error.response.data);
          }
        }
      };
      

    fetchUserDetails();
    if (userDetails.walletAddress) {
      fetchErc20Portfolio();
      fetchNftPortfolio();
    }
  }, [erc20Page, nftPage, userDetails.walletAddress]);

  return (
    <>
    <NavBar/>
    <div style={{ padding: "20px" }}>
      <h2>User Profile</h2>
      <div>
        <p>Name: {userDetails.name}</p>
        <p>Wallet Address: {userDetails.walletAddress}</p>
      </div>

      {/* ERC-20 Portfolio Table */}
      <h3>ERC-20 Portfolio</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Token Name</TableCell>
              <TableCell>Token Symbol</TableCell>
              <TableCell>Quantity</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {erc20Portfolio.map((token, index) => (
              <TableRow key={index}>
                <TableCell>{token.token_name}</TableCell>
                <TableCell>{token.token_symbol}</TableCell>
                <TableCell>{(token.quantity / Math.pow(10, token.decimal)).toFixed(4)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "10px" }}>
        <Button onClick={() => setErc20Page(erc20Page - 1)} disabled={erc20Page === 0}>
          Previous
        </Button>
        <Button onClick={() => setErc20Page(erc20Page + 1)}>Next</Button>
      </div>

      {/* NFT Portfolio Table */}
      <h3>NFT Portfolio</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Collection Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {nftPortfolio.map((nft, index) => (
              <TableRow key={index}>
                <TableCell>{nft.collection}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "10px" }}>
        <Button onClick={() => setNftPage(nftPage - 1)} disabled={nftPage === 0}>
          Previous
        </Button>
        <Button onClick={() => setNftPage(nftPage + 1)}>Next</Button>
      </div>
    </div>
    </>
  );
};

export default Profile;
