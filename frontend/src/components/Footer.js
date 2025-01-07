import React from 'react'

function Footer() {
  return (
    <>
    <footer className="footer-section">
    <div className="footer-links">
      <h3>Quick Links</h3>
      <ul>
        <li>Home</li>
        <li>About</li>
        <li>Features</li>
        <li>Contact</li>
      </ul>
    </div>
    <div className="footer-social">
      <h3>Follow Us</h3>
      <div className="social-icons">
        <span>Twitter</span>
        <span>Discord</span>
        <span>Instagram</span>
      </div>
    </div>
    <div className="footer-contact">
      <h3>Contact Us</h3>
      <p>Email: support@nftnexus.com</p>
    </div>
    <div className="footer-legal">
      <span>Powered by</span> | <span>bitsCrunch</span>
    </div>
  </footer>
  </>
  )
}

export default Footer
