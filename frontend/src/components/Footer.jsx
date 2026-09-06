import React from 'react'

const Footer = () => {
  return (
    <div> <footer className="footer">
    <div className="footer-container">
      <div>
        <div className="footer-logo">AutoTori</div>
        <p>Your trusted marketplace to buy and sell cars.</p>
        <p>Helsinki, Finland</p>
      </div>
      <div>
        <h3>Explore</h3>
        <a href="index.html">Home</a>
        <a href="listings.html">Cars</a>
        <a href="car-form.html">Sell Your Car</a>
      </div>
      <div>
        <h3>Company</h3>
        <a href="#">About Us</a>
        <a href="#">Financing</a>
        <a href="#">Contact</a>
      </div>
      <div>
        <h3>Help</h3>
        <a href="#">FAQ</a>
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© 2026 AutoTori. All rights reserved.</span>
      <span>Helsinki, Finland</span>
    </div>
  </footer></div>
  )
}

export default Footer