import CarCardPrime from "./CarCardPrime";
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllCars } from '@/api/carApi';
import ListCard from '@/components/ListCard';

// AI generated lists, should be replaced with database data later. 
// const placeholderCars = [{
//   id: 1,
//   image: "",
//   name: "Mercedes-Benz C-Class",
//   year: 2022,
//   km: "38,500",
//   location: "Helsinki, Finland",
//   price: "€34,990",
// },
// {
//   id: 2,
//   image: "",
//   name: "BMW 3 Series",
//   year: 2021,
//   km: "45,200",
//   location: "Helsinki, Finland",
//   price: "€31,500",
// }, {
//   id: 3,
//   image: "",
//   name: "Mercedes-Benz C-Class",
//   year: 2022,
//   km: "38,500",
//   location: "Helsinki, Finland",
//   price: "€34,990",
// },
// {
//   id: 4,
//   image: "",
//   name: "BMW 3 Series",
//   year: 2021,
//   km: "45,200",
//   location: "Helsinki, Finland",
//   price: "€31,500",
// }, {
//   id: 5,
//   image: "",
//   name: "Mercedes-Benz C-Class",
//   year: 2022,
//   km: "38,500",
//   location: "Helsinki, Finland",
//   price: "€34,990",
// },
// {
//   id: 6,
//   image: "",
//   name: "BMW 3 Series",
//   year: 2021,
//   km: "45,200",
//   location: "Helsinki, Finland",
//   price: "€31,500",
// },]



function FeaturedCarsPrime() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getAllCars();

        console.log(data);

        const formattedOffers = data
          .filter((cars) => !cars.company)
          .slice(0, 9)
          .map((car) => ({
            key: car._id,
            id: car._id,
            carName: `${car.make} ${car.model}`,
            mileage: car.mileage != null ? `${car.mileage.toLocaleString()} km` : 'N/A',
            location: car.location,
            sellerName: car.seller,
            price: car.price ?? car.estimatedPrice,
            status: car.isVerified,
            image: car.image,
            year: car.year,
          }));

        setData(formattedOffers);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };

    fetchCars();
  }, []);

  return (
    <section className="max-w-[1200px] mx-auto px-[6%] py-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <p className="text-[#2f9449] text-xs font-extrabold tracking-[1.5px]">OUR COLLECTION</p>
          <h2 className="text-[32px] font-bold text-[#202522] max-[700px]:text-[26px]">Featured Cars</h2>
        </div>
        <Link to="/find_cars" className="text-sm font-bold text-[#1f7a38] whitespace-nowrap transition duration-200 hover:text-[#185f2c]">View All Cars →</Link>
      </div>
      <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {data.map((car) => (
          <ListCard
            key={car.id}
            id={car.id}
            image={car.image}
            // name={car.carName}
            name={`${car.carName}}`}
            year={car.year}
            km={car.mileage}
            location={car.location}
            // price={`${car.price?.toLocaleString() ?? "N/A"}`
            price={(car.price ?? car.estimatedPrice) != null ? `${(car.price ?? car.estimatedPrice).toLocaleString()} €` : "Price on request"}
          />
        ))}
      </div>
    </section>
  )
}

export default FeaturedCarsPrime;