import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import NavBar from '../../components/NavBar';
import './Profile.css';
import Footer from "../../components/Footer";

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
            "x-api-key": "25b658b989ac45f289e072ec17975772",
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
              "x-api-key": "25b658b989ac45f289e072ec17975772",
            },
          }
        );
        if (response.data.data) {
          setNftPortfolio(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching NFT portfolio: ", error.response || error);
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
      <NavBar />
      <div className="Profile-container">
        <h2 className="Profile-heading">Your Profile</h2>
        <div className="Profile-info">
          <p><span className="Profile-important">{userDetails.walletAddress}</span></p>
        </div>

        <div className="Profile-tables">
          {/* ERC-20 Portfolio Table */}
          <div className="Profile-table">
            <h3 className="Profile-subheading">Your ERC-20 Portfolio</h3>
            <TableContainer className="Profile-erc20-table-container">
              <Table className="Profile-erc20-table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Token Name</TableCell>
                    <TableCell align="center">Token Symbol</TableCell>
                    <TableCell align="center">Quantity</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {erc20Portfolio.map((token, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{token.token_name}</TableCell>
                      <TableCell align="center">{token.token_symbol}</TableCell>
                      <TableCell align="center">{(token.quantity / Math.pow(10, token.decimal)).toFixed(4)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <div className="Profile-pagination">
              <Button onClick={() => setErc20Page(erc20Page - 1)} disabled={erc20Page === 0}>
                Previous
              </Button>
              <Button onClick={() => setErc20Page(erc20Page + 1)}>Next</Button>
            </div>
          </div>

          {/* NFT Portfolio Table */}
          <div className="Profile-table">
            <h3 className="Profile-subheading">Your NFT Portfolio</h3>
            <TableContainer className="Profile-nft-table-container">
              <Table className="Profile-nft-table">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Collection Name</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {nftPortfolio.map((nft, index) => (
                    <TableRow key={index}>
                      <TableCell align="center">{nft.collection}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <div className="Profile-pagination">
              <Button onClick={() => setNftPage(nftPage - 1)} disabled={nftPage === 0}>
                Previous
              </Button>
              <Button onClick={() => setNftPage(nftPage + 1)}>Next</Button>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Profile;
