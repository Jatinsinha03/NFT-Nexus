import React, { useEffect, useState } from 'react';
import './NFTPage.css';
import { useParams } from 'react-router-dom';
import AnalyticsPage from '../Analytics/AnalyticsPage';
import PricePrediction from '../PricePrediction/PricePrediction';
import Footer from '../../components/Footer'
import NavBar from '../../components/NavBar'
import Loader from '../../components/Loader'

function NFTPage() {
    const { contractAddress } = useParams();
    const [nftData, setNftData] = useState(null);
    const [profileData, setProfileData] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [anomalyPrediction, setAnaomalyPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch metadata and profile data
    const fetchNftData = async () => {
        try {
            const metadataResponse = await fetch(
                `https://api.unleashnfts.com/api/v2/nft/collection/metadata?sort_order=desc&offset=0&limit=30&contract_address=${contractAddress}`,
                {
                    method: "GET",
                    headers: {
                        "accept": "application/json",
                        "x-api-key": "316dd88ae8840897e1f61160265d1a3f",
                    },
                }
            );

            const profileResponse = await fetch(
                `https://api.unleashnfts.com/api/v2/nft/collection/profile?blockchain=ethereum&contract_address=${contractAddress}&time_range=all&offset=0&limit=30&sort_by=collection_score&sort_order=desc`,
                {
                    method: "GET",
                    headers: {
                        "accept": "application/json",
                        "x-api-key": "316dd88ae8840897e1f61160265d1a3f",
                    },
                }
            );

            const metadataData = await metadataResponse.json();
            const profileData = await profileResponse.json();

            const nft = metadataData.data[0] || null;
            const profile = profileData.data[0] || null;
            console.log(profile)

            setNftData(nft);
            setProfileData(profile);

            if (nft) {
                fetchFavorites(nft);
            }

            if (profile) {
                handleInvestmentProfile(profile);
                handleAnomalyPrediction(profile);
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching NFT data:", error);
            setLoading(false);
        }
    };

    // Fetch favorites
    const fetchFavorites = async (nft) => {
        try {
            const response = await fetch("https://nft-nexus-backend.onrender.com/api/nft/getFavorites", {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
            });

            const data = await response.json();

            if (Array.isArray(data.favorites)) {
                const isFavoriteItem = data.favorites.some(
                    (fav) => fav.contractAddress.toUpperCase() === nft.contract_address.toUpperCase()
                );
                setIsFavorite(isFavoriteItem);
            }
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    // Predict risk category
    const handleInvestmentProfile = async (profile) => {
        const features = {
            loss_making_trades: profile.loss_making_trades,
            avg_loss_making_trades: profile.avg_loss_making_trades,
            loss_making_trades_percentage: profile.loss_making_trades_percentage,
            loss_making_volume: profile.loss_making_volume,
            diamond_hands: profile.diamond_hands,
            liquidity_score: profile.liquidity_score,
        };

        try {
            const response = await fetch("https://nft-nexus-g7co.onrender.com/risk-predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(features),
            });

            const result = await response.json();
            setPrediction(result.risk_category || "Unknown");
        } catch (error) {
            console.error("Error predicting risk category:", error);
        }
    };

    const handleAnomalyPrediction = async (profile) => {
        const features = {
            washtrade_index: profile.washtrade_index,
            zero_profit_trades: profile.zero_profit_trades,
            loss_making_volume: profile.loss_making_volume,
        };
    
        try {
            const response = await fetch("https://nft-nexus-g7co.onrender.com/anomaly-predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(features),
            });
    
            const result = await response.json();
            setAnaomalyPrediction(result.prediction || "Unknown");
        } catch (error) {
            console.error("Error predicting anomaly:", error);
        }
    };
    

    // Add to favorites
    const handleFavorite = async () => {
        if (isFavorite) return;

        try {
            const response = await fetch("https://nft-nexus-backend.onrender.com/api/nft/addToFavorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({
                    blockchain: nftData.blockchain,
                    contractAddress: nftData.contract_address,
                    chainId: nftData.chain_id,
                }),
            });

            if (response.ok) {
                alert("Added to favorites!");
                setIsFavorite(true);
            } else {
                const json = await response.json();
                alert(`Failed to add to favorites: ${json.message || "Unknown error"}`);
            }
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    };

    useEffect(() => {
        fetchNftData();
    }, [contractAddress]);

    if (loading) {
        return (<Loader/>);
    }



    return (
      <>
        <NavBar/>
        <div className="nftpage-container">
            <div className="nftpage-banner">
                <img src={nftData.banner_image_url} alt="Banner" className="nftpage-banner-img" />
                <div className="nftpage-image">
                    <img src={nftData.image_url} alt="NFT" className="nftpage-image-img" />
                </div>
            </div>

            <div className="nftpage-card">
                <div className="nftpage-card-header">
                    <h1>{nftData.collection}</h1>
                    
                    <button onClick={handleFavorite} disabled={isFavorite} className="nftpage-favorite-btn">{isFavorite ? 'Favorited' : 'Add to Favorite'}</button>
                </div>
                
                <h2 className='nftpage-investment-risk'>Investment Risk : {prediction} </h2>
                <p className='nftpage-investment-risk-desc'>(Risk is determined by our advanced AI model using a comprehensive analysis of the collection's profile, which includes metrics such as loss-making trades, average loss-making trades, trade percentage, loss-making volume, diamond hands, and liquidity score.)</p>
                <h2 className='nftpage-investment-risk'>Anomaly : {anomalyPrediction} </h2>
                <p className="nftpage-description">{nftData.description}</p>
                <div className="nftpage-links">
                    {nftData.external_url && (
                        <a href={nftData.external_url} target="_blank" rel="noopener noreferrer">
                            Official Website
                        </a>
                    )}
                    {nftData.discord_url && (
                        <a href={nftData.discord_url} target="_blank" rel="noopener noreferrer">
                            Discord
                        </a>
                    )}
                    {nftData.instagram_url && (
                        <a href={nftData.instagram_url} target="_blank" rel="noopener noreferrer">
                            Instagram
                        </a>
                    )}
                    {nftData.twitter_url && (
                        <a href={nftData.twitter_url} target="_blank" rel="noopener noreferrer">
                            Twitter
                        </a>
                    )}
                    {nftData.marketplace_url && (
                        <a href={nftData.marketplace_url} target="_blank" rel="noopener noreferrer">
                            OpenSea Marketplace
                        </a>
                    )}
                </div>

            </div>
            
           
            <AnalyticsPage contractAddress={contractAddress} />
            <PricePrediction blockchain={nftData.blockchain} contractAddress={contractAddress} chainId={1000} />
            <Footer/>
        </div>
      </>
    );
}

export default NFTPage;
