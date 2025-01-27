import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Send, 
  RefreshCw, 
  Terminal, 
  Copy, 
  Check ,
  ExternalLink, 
  CheckCircle, 
  AlertTriangle, 
  Info 
} from 'lucide-react';
import { Button } from '../../components/Button';
import { Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import NavBar from '../../components/NavBar';
import './Chat.css'
// Utility for syntax highlighting and formatting JSON
const formatJSON = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    return json;
  }
};

const NFTGETRESPONSE  = ({ response }) => {
  // Safely parse the response
  const data = typeof response === 'string' ? JSON.parse(response) : response;

  return (
    <div className="ChatPage-response-container text-white space-y-4 p-4 bg-gray-900 rounded-lg">
      {/* Collection Header */}
      <div className="ChatPage-header border-b border-violet-500/30 pb-3">
        <h2 className="ChatPage-title text-xl font-bold text-violet-400">
          {data.collection_name} Analysis
        </h2>
        <p className="ChatPage-description text-sm text-gray-300">{data.collection_description}</p>
      </div>

      {/* Market Trends */}
      <div className="ChatPage-market-trends bg-gray-800 p-3 rounded-lg border border-gray-700">
        <h3 className="text-lg font-semibold text-violet-300">📊 Market Trends</h3>
        <p className="text-gray-100">{data.market_trends}</p>
      </div>

      {/* Liquidity */}
      <div className="ChatPage-liquidity bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
        <h4 className="font-semibold text-blue-300">💧 Liquidity</h4>
        <p className="text-gray-100">{data.liquidity}</p>
      </div>

      {/* Buy Recommendation */}
      <div className="ChatPage-buy-rec bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h4 className="font-semibold text-green-300">Buy Recommendation</h4>
        </div>
        <p className="text-gray-100"><strong>Decision:</strong> {data.buy_recommendation.decision}</p>
        <p className="text-gray-100"><strong>Reasoning:</strong> {data.buy_recommendation.reasoning}</p>
      </div>

      {/* Overall Benefits */}
      <div className="ChatPage-benefits bg-gray-800 p-3 rounded-lg border border-gray-700">
        <h4 className="font-semibold text-green-300">✅ Overall Benefits</h4>
        <p className="text-gray-100">{data.overall_benefit}</p>
      </div>

      {/* Risks Section */}
      <div className="ChatPage-risks bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h4 className="font-semibold text-red-300">⚠️ Potential Risks</h4>
        </div>
          {data.risks.map((risk, index) => (
            <li key={index}>{risk}</li>
          ))}
      </div>

      {/* Alternative Collections */}
<div className="ChatPage-alt-collections bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
  <div className="flex items-center space-x-2 mb-2">
    <Info className="w-5 h-5 text-blue-500" />
    <h4 className="font-semibold text-blue-300">🔄 Alternative Collections</h4>
  </div>
  <ul className="space-y-1 text-gray-100">
    {data.alternative_collections.map((collection, index) => (
      <li key={index} className="flex items-center space-x-2">
        {/* Remove the bullet span */}
        <span>{collection}</span>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([{
    type: 'system',
    content: 'Welcome to NFT Trader’s Hub. Ask me anything about NFT collections, market trends, tokens, and investment strategies! Powered by bitsCrunch API and Cohere, I provide expert advice to help you make informed decisions in the world of NFTs and digital assets.'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = (content) => {
    navigator.clipboard.writeText(JSON.stringify(content, null, 2));
    setCopiedMessage(content);
    setTimeout(() => setCopiedMessage(null), 2000);
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('https://nft-nexus-trader-aiagent.onrender.com/stream_chat', {
        prompt: input
      });

      // Remove code block markers and parse JSON
      let formattedResponse;
      if (typeof response.data === 'string') {
        // Remove ```json and ``` if present
        const cleanedData = response.data
          .replace(/^```json\s*/, '')
          .replace(/```\s*$/, '')
          .trim();

        try {
          formattedResponse = JSON.parse(cleanedData);
          console.log(formattedResponse)
        } catch (parseError) {
          // Fallback parsing
          formattedResponse = {
            protocol_name: "Error parsing response",
            protocol_description: "Unable to parse the API response",
            protocol_steps: [],
            risks: ["Response parsing failed"],
            alternative_protocols: []
          };
          console.error("JSON Parsing Error:", parseError);
        }
      } else {
        // If it's already an object, use it directly
        formattedResponse = response.data;
      }

      // Add AI response
      setMessages(prev => [
        ...prev, 
        { 
          type: 'ai', 
          content: formattedResponse 
        }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev, 
        { 
          type: 'error', 
          content: error.message || 'Something went wrong' 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMessage = (message) => {
    switch (message.type) {
      case 'system':
        return (
          <div className="ChatPage-system-message text-green-400 italic">
            🤖 {message.content}
          </div>
        );
      case 'user':
        return (
          <div className="ChatPage-user-message text-blue-300">
            User: {message.content}
          </div>
        );
      case 'ai':
        return (
          <div className="ChatPage-ai-message text-white">
            <NFTGETRESPONSE response={message.content} />
          </div>
        );
      case 'error':
        return (
          <div className="ChatPage-error-message text-red-500">
            ❌ {message.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <NavBar />
      <div className="ChatPage-container" style={{
        minHeight: 'calc(100vh - 64px)',
        padding: '20px',
        marginTop: '1px'
      }}>
        <div className="ChatPage-header-container" style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '16px'
        }}>
          <h2 className="ChatPage-header-text" style={{
            fontSize: '24px', // Increased font size
            fontFamily: 'Monaco, monospace',
            color: '#32cd32'
          }}>
            NFT Trader’s Hub
          </h2>
        </div>
        {/* Chat Messages Container */}
        <div className="ChatPage-messages-container" style={{
          flexGrow: 1,
          overflowY: 'auto',
          marginBottom: '16px',
          border: '1px solid #32cd324d',
          borderRadius: '8px',
          padding: '16px',
          gap: '12px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderMessage(message)}
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="ChatPage-input-form" style={{
          display: 'flex',
          gap: '8px'
        }}>
          <div style={{ flexGrow: 1 }}>
            <input
              id="ChatPage-input"
              className="ChatPage-input-field"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about NFT collections..."
              style={{
                width: '100%',
                color: 'black',
                padding: '12px', // Increased padding for better input visibility
                borderRadius: '8px',
                outline: 'none',
                fontSize: '18px', // Increased font size for input
              }}
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="ChatPage-submit-button"
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '18px', // Increased font size for button text
            }}
          >
            {loading ? <RefreshCw className="animate-spin" /> : <Send />}
          </Button>
        </form>
      </div>
    </>
  );
};

export default Chat;
