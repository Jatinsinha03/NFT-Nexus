const express = require('express');
const router = express.Router();
const NFT = require('../models/NFT'); // Your NFT model
const fetchUser = require('../middleware/fetchuser'); // Assuming the middleware is for authentication

// POST route to mark NFT as favorite
router.post('/addToFavorite', fetchUser, async (req, res) => {
    try {
        const { blockchain, contractAddress, chainId } = req.body;

        // Validate incoming data
        if (!blockchain || !contractAddress || !chainId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Create a new NFT instance with user and NFT details
        const newNFT = new NFT({
            user: req.user.id, // user ID from fetchUser middleware
            blockchain,
            contractAddress,
            chainId,
        });

        // Save the NFT to the database
        await newNFT.save();

        res.status(200).json({ message: 'NFT added to favorites successfully', nft: newNFT });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/getFavorites', fetchUser, async (req, res) => {
    try {
        // Retrieve all NFTs associated with the authenticated user
        const favorites = await NFT.find({ user: req.user.id });

        if (favorites.length === 0) {
            return res.status(404).json({ message: 'No favorite NFTs found' });
        }

        res.status(200).json({ favorites });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
