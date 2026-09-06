import React from 'react'

const Navbar = () => {
  return (
    <div><header className="navbar">
    <div className="logo">AutoTori</div>
    <nav>
      <a href="index.html">Home</a>
      <a href="listings.html">Cars</a>
      <a href="car-form.html">Sell Your Car</a>
      <a href="#">About Us</a>
      <a href="#">Financing</a>
      <a href="#">Contact</a>
    </nav>
    <div className="nav-right">
      <select aria-label="Language">
        <option>EN</option>
        <option>FI</option>
        <option>SV</option>
      </select>
      <a href="login.html" className="login-btn">
        Login
      </a>
    </div>
  </header></div>
  )
}

export default Navbar