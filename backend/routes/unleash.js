const express = require('express');
const router = express.Router();

// Node.js 18+ has native fetch. For Node.js < 18, install: npm install node-fetch
const fetch = globalThis.fetch;

const UNLEASH_API_KEY = '25b658b989ac45f289e072ec17975772';
const UNLEASH_BASE_URL = 'https://api.unleashnfts.com';

// Helper function to proxy requests
const proxyRequest = async (url, res) => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-api-key': UNLEASH_API_KEY,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error('Error proxying UnleashNFTs API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Proxy route for wallet profile
router.get('/wallet/profile', async (req, res) => {
  const { wallet, offset = 0, limit = 30 } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/nft/wallet/profile?wallet=${wallet}&offset=${offset}&limit=${limit}`;
  await proxyRequest(url, res);
});

// Proxy route for collection metadata
router.get('/collection/metadata', async (req, res) => {
  const { contract_address, sort_order = 'desc', offset = 0, limit = 30 } = req.query;

  if (!contract_address) {
    return res.status(400).json({ error: 'Contract address is required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/nft/collection/metadata?sort_order=${sort_order}&offset=${offset}&limit=${limit}&contract_address=${contract_address}`;
  await proxyRequest(url, res);
});

// Proxy route for collection profile
router.get('/collection/profile', async (req, res) => {
  const { blockchain = 'ethereum', contract_address, time_range = 'all', offset = 0, limit = 30, sort_by = 'collection_score', sort_order = 'desc' } = req.query;

  if (!contract_address) {
    return res.status(400).json({ error: 'Contract address is required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/nft/collection/profile?blockchain=${blockchain}&contract_address=${contract_address}&time_range=${time_range}&offset=${offset}&limit=${limit}&sort_by=${sort_by}&sort_order=${sort_order}`;
  await proxyRequest(url, res);
});

// Proxy route for collection analytics
router.get('/collection/analytics', async (req, res) => {
  const { blockchain = 'ethereum', contract_address, offset = 0, limit = 30, sort_by = 'sales', time_range = '24h', sort_order = 'desc' } = req.query;

  if (!contract_address) {
    return res.status(400).json({ error: 'Contract address is required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/nft/collection/analytics?blockchain=${blockchain}&contract_address=${contract_address}&offset=${offset}&limit=${limit}&sort_by=${sort_by}&time_range=${time_range}&sort_order=${sort_order}`;
  await proxyRequest(url, res);
});

// Proxy route for marketplace analytics
router.get('/marketplace/analytics', async (req, res) => {
  const { blockchain, name, time_range = 'all', sort_by = 'name', sort_order = 'desc', limit = 30, offset = 0 } = req.query;

  if (!blockchain || !name) {
    return res.status(400).json({ error: 'Blockchain and marketplace name are required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/nft/marketplace/analytics?blockchain=${blockchain}&name=${name}&time_range=${time_range}&sort_by=${sort_by}&sort_order=${sort_order}&limit=${limit}&offset=${offset}`;
  await proxyRequest(url, res);
});

// Proxy route for marketplace traders
router.get('/marketplace/traders', async (req, res) => {
  const { blockchain, name, time_range = 'all', sort_by = 'name', sort_order = 'desc', limit = 30, offset = 0 } = req.query;

  if (!blockchain || !name) {
    return res.status(400).json({ error: 'Blockchain and marketplace name are required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/nft/marketplace/traders?blockchain=${blockchain}&name=${name}&time_range=${time_range}&sort_by=${sort_by}&sort_order=${sort_order}&limit=${limit}&offset=${offset}`;
  await proxyRequest(url, res);
});

// Proxy route for marketplace washtrade
router.get('/marketplace/washtrade', async (req, res) => {
  const { blockchain, name, time_range = 'all', sort_by = 'name', sort_order = 'desc', limit = 30, offset = 0 } = req.query;

  if (!blockchain || !name) {
    return res.status(400).json({ error: 'Blockchain and marketplace name are required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/nft/marketplace/washtrade?blockchain=${blockchain}&name=${name}&time_range=${time_range}&sort_by=${sort_by}&sort_order=${sort_order}&limit=${limit}&offset=${offset}`;
  await proxyRequest(url, res);
});

// Proxy route for price estimate (liquify)
router.get('/liquify/price_estimate', async (req, res) => {
  const { blockchain, contract_address, token_id } = req.query;

  if (!blockchain || !contract_address || !token_id) {
    return res.status(400).json({ error: 'Blockchain, contract address, and token ID are required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/nft/liquify/price_estimate?blockchain=${blockchain}&contract_address=${contract_address}&token_id=${token_id}`;
  await proxyRequest(url, res);
});

// Proxy route for transactions
router.get('/transactions', async (req, res) => {
  const { currency = 'eth', blockchain = '1', transaction_type = 'trade', sort_by = 'transaction_price', sort_order = 'desc', time_range, offset = 0, limit = 10, is_washtrade } = req.query;

  let url = `${UNLEASH_BASE_URL}/api/v1/transactions?currency=${currency}&blockchain=${blockchain}&transaction_type=${transaction_type}&sort_by=${sort_by}&sort_order=${sort_order}&offset=${offset}&limit=${limit}`;
  
  if (time_range) {
    url += `&time_range=${time_range}`;
  }
  if (is_washtrade !== undefined) {
    url += `&is_washtrade=${is_washtrade}`;
  }

  await proxyRequest(url, res);
});

// Proxy route for wallet balance (tokens)
router.get('/wallet/balance/token', async (req, res) => {
  const { address, blockchain = 'ethereum', time_range = 'all', offset = 0, limit = 30 } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/wallet/balance/token?address=${address}&blockchain=${blockchain}&time_range=${time_range}&offset=${offset}&limit=${limit}`;
  await proxyRequest(url, res);
});

// Proxy route for wallet balance (NFTs)
router.get('/wallet/balance/nft', async (req, res) => {
  const { wallet, blockchain = 'ethereum', time_range = 'all', offset = 0, limit = 30 } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: 'Wallet address is required' });
  }

  const url = `${UNLEASH_BASE_URL}/api/v2/wallet/balance/nft?wallet=${wallet}&blockchain=${blockchain}&time_range=${time_range}&offset=${offset}&limit=${limit}`;
  await proxyRequest(url, res);
});

module.exports = router;

