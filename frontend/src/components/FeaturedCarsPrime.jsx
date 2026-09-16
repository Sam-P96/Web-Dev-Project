import CarCardPrime from "./CarCardPrime";

function FeaturedCarsPrime() {
    return(
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

        {/* BMW, Audi, Volvo, Toyota, Tesla <article> blocks still here for now */}
      </div>
    </section>
    )
}

export default FeaturedCarsPrime;