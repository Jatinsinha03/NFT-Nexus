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

// Utility for syntax highlighting and formatting JSON
const formatJSON = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    return json;
  }
};


const DeFiResponseRenderer = ({ response }) => {
    // Safely parse the response
    const data = typeof response === 'string' 
      ? JSON.parse(response) 
      : response;
  
    return (
      <div className="text-white space-y-4 p-4 bg-gray-900 rounded-lg">
        {/* Protocol Header */}
        <div className="flex items-center space-x-3 border-b border-violet-500/30 pb-3">
          <CheckCircle className="w-6 h-6 text-green-500" />
          <div>
            <h2 className="text-xl font-bold text-violet-400">
              {data.protocol_name} Cross-Chain Transfer Guide
            </h2>
            <p className="text-sm text-gray-300">{data.protocol_description}</p>
          </div>
          <a 
            href={data.protocol_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="ml-auto hover:bg-violet-500/20 p-2 rounded-full transition"
          >
            <ExternalLink className="w-5 h-5 text-violet-400" />
          </a>
        </div>
  
        {/* Step-by-Step Guide */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-violet-300">
            📍 Step-by-Step Transfer Process
          </h3>
          {data.protocol_steps.map((step) => (
            <div 
              key={step.step_number} 
              className="bg-gray-800 p-3 rounded-lg border border-gray-700"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className="bg-violet-500 text-white px-2 py-1 rounded-full text-xs">
                  Step {step.step_number}
                </span>
                <span className="text-sm text-gray-400">
                  ⏱️ Estimated Time: {step.estimated_time}
                </span>
              </div>
              <p className="text-gray-100">{step.description}</p>
              {step.potential_fees && (
                <div className="mt-2 text-sm text-yellow-300">
                  💸 Potential Fees: {step.potential_fees}
                </div>
              )}
            </div>
          ))}
        </div>
  
        {/* Overall Insights */}
        <div className="space-y-4 mt-4">
          <div className="bg-green-900/20 border border-green-500/30 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <h4 className="font-semibold text-green-300">Overall Benefits</h4>
            </div>
            <p className="text-gray-100">{data.overall_benefit}</p>
          </div>
  
          {/* Risks Section */}
          <div className="bg-red-900/20 border border-red-500/30 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h4 className="font-semibold text-red-300">Potential Risks</h4>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-100">
              {data.risks.map((risk, index) => (
                <li key={index}>{risk}</li>
              ))}
            </ul>
          </div>
  
          {/* Alternatives */}
          <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Info className="w-5 h-5 text-blue-500" />
              <h4 className="font-semibold text-blue-300">Alternative Protocols</h4>
            </div>
            <ul className="space-y-1 text-gray-100">
              {data.alternative_protocols.map((protocol, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="text-blue-400">•</span>
                  <span>{protocol}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Slippage and Additional Info */}
        <div className="bg-gray-800 p-3 rounded-lg mt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Info className="w-5 h-5 text-violet-500" />
            <h4 className="font-semibold text-violet-300">Slippage Insights</h4>
          </div>
          <p className="text-gray-100">{data.estimated_slippage}</p>
        </div>
      </div>
    );
  };

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      type: 'system',
      content: 'Welcome to DeFi Optimizer Chat. Ask me anything about DeFi protocols and swaps!\n Powered by bitsCrunch API and Cohere'
    }
  ]);
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
      const response = await axios.post('http://localhost:8000/stream_rag_output', {
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
          <div className="text-green-400 italic">
            🤖 {message.content}
          </div>
        );
      case 'user':
        return (
          <div className="text-blue-300">
            User: {message.content}
          </div>
        );
        case 'ai':
            return (
              <div className="text-white">
                <DeFiResponseRenderer response={message.content} />
              </div>
        );
      case 'error':
        return (
          <div className="text-red-500">
            ❌ {message.content}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
    <NavBar/>
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      padding: '20px',
      marginTop: '1px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <Terminal style={{
          width: '24px',
          height: '24px',
          marginRight: '8px',
          color: '#32cd32'
        }} />
        <h2 style={{
          fontSize: '24px', // Increased font size
          fontFamily: 'Monaco, monospace',
          color: '#32cd32'
        }}>
          DeFi Optimizer Terminal
        </h2>
      </div>

      {/* Chat Messages Container */}
      <div style={{
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
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        gap: '8px'
      }}>
        <div style={{ flexGrow: 1 }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about DeFi protocols..."
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