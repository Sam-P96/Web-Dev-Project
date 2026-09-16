import CarCardPrime from "./CarCardPrime";

// AI generated lists, should be replaced with database data later. 
const placeholderCars = [{
  id: 1,
  image: "",
  name: "Mercedes-Benz C-Class",
  year: 2022,
  km: "38,500",
  location: "Helsinki, Finland",
  price: "€34,990",
},
{
  id: 2,
  image: "",
  name: "BMW 3 Series",
  year: 2021,
  km: "45,200",
  location: "Helsinki, Finland",
  price: "€31,500",
}, {
  id: 3,
  image: "",
  name: "Mercedes-Benz C-Class",
  year: 2022,
  km: "38,500",
  location: "Helsinki, Finland",
  price: "€34,990",
},
{
  id: 4,
  image: "",
  name: "BMW 3 Series",
  year: 2021,
  km: "45,200",
  location: "Helsinki, Finland",
  price: "€31,500",
}, {
  id: 5,
  image: "",
  name: "Mercedes-Benz C-Class",
  year: 2022,
  km: "38,500",
  location: "Helsinki, Finland",
  price: "€34,990",
},
{
  id: 6,
  image: "",
  name: "BMW 3 Series",
  year: 2021,
  km: "45,200",
  location: "Helsinki, Finland",
  price: "€31,500",
},]

function FeaturedCarsPrime() {
  return (
    <section className="featured-section">
      <div className="section-heading">
        <div>
          <p className="section-label">OUR COLLECTION</p>
          <h2>Featured Cars</h2>
        </div>
        <a href="listings.html">View All Cars →</a>
      </div>

      <div className="featured-grid">
        <CarCardPrime
          image=""
          name="Mercedes-Benz C-Class"
          year={2022}
          km="38,500"
          location="Helsinki, Finland"
          price="€34,990"
        />
        <div className="featured-grid">
          {placeholderCars.map((car) => (
            <CarCardPrime
              key={car.id}
              image={car.image}
              name={car.name}
              year={car.year}
              km={car.km}
              location={car.location}
              price={car.price} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCarsPrime;