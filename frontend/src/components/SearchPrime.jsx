function SearchPrime() {
    return(
        <section className="search-section">
  <div className="search-header">
    <p className="section-label">FIND YOUR CAR</p>
    <h2>Search Cars</h2>
  </div>
  <div className="search-box">
    <div className="search-row">
      <div className="search-field">
        <label htmlFor="make">Make</label>
        <select id="make">
          <option>All Makes</option>
          <option>Audi</option>
          <option>BMW</option>
          <option>Mercedes-Benz</option>
          <option>Volvo</option>
          <option>Toyota</option>
          <option>Tesla</option>
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="model">Model</label>
        <select id="model">
          <option>All Models</option>
          <option>A4</option>
          <option>3 Series</option>
          <option>C-Class</option>
          <option>XC60</option>
          <option>RAV4</option>
          <option>Model 3</option>
        </select>
      </div>
      <div className="search-field">
        <label htmlFor="price">Price</label>
        <select id="price">
          <option>Any Price</option>
          <option>Under €15,000</option>
          <option>€15,000 - €25,000</option>
          <option>€25,000 - €35,000</option>
          <option>€35,000+</option>
        </select>
      </div>
    </div>
    <a href="listings.html" className="search-button">
      Search
    </a>
  </div>
</section>

    )
};

export default SearchPrime;