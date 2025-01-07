import React from 'react';
import loadingGif from '../assets/loader.gif'; // Ensure the path to your loading GIF is correct

const Loader = () => {
  return (
    <div style={{
      position: 'fixed', // Use fixed to cover the whole screen
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'linear-gradient( 85.2deg,  rgba(33,3,40,1) 7.5%, rgba(65,5,72,1) 88.7% )', // Semi-transparent black background
      zIndex: 9999, // Make sure loader is on top of other content
      display: 'flex', // Use flexbox for easy centering
      justifyContent: 'center', // Center horizontally
      alignItems: 'center' // Center vertically
    }}>
      <img src={loadingGif} alt="Loading..." style={{ width: '100px',background:'none' }} /> {/* Increased size for visibility */}
    </div>
  );
};

export default Loader;
