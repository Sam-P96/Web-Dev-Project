function CarCardPrime({ image, name, year, km, location, price }) {
  return (
    <article className="featured-card">
      <img src={image} alt={name} />
      <div className="featured-info">
        <p>
          {year} • {km} km
        </p>
        <h3>{name}</h3>
        <span>{location}</span>
        <div className="featured-bottom">
          <strong>{price}</strong>
          <a href="listings.html">View →</a>
        </div>
      </div>
    </article>
  );
}

export default CarCardPrime;