import { getAllCars } from '@/apis/carApi';
import ListCard from '@/components/ListCard';
import { useEffect, useState } from 'react';
const CarSale = () => {
  const [cars, setCars] = useState([]);
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getAllCars();

        console.log(data);
        const formattedOffers = data.map((car) => ({
          id: car._id,
          carName: `${car.make} ${car.model}`,
          mileage: `${car.mileage.toLocaleString()} km`,
          location: 'Unknown',
          sellerName: car.seller,
          price: car.estimatedPrice,
          status: car.isVerified,
          image: '',
          submittedDate: car.year,
        }));

        setCars(formattedOffers);
      } catch (error) {
        console.error('Failed to fetch cars:', error);
      }
    };

    fetchCars();
  }, []);

  const handleClick = () => {};

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Available Cars</h1>
          <p className="text-gray-500 mt-1">Browse verified cars available for sale</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {cars.map(
            (data) =>
              data.status === 'Accepted' && (
                <div
                  key={data.id}
                  className="border-2 border-gray-300 rounded-xl shadow-lg hover:shadow-xl transition-shadow bg-[#1f7a38] p-1"
                >
                  <ListCard
                    image={data.image}
                    name={data.carName}
                    year={data.submittedDate}
                    km={data.mileage}
                    location={data.location}
                    price={data.price}
                  />
                </div>
              ),
          )}
        </div>
      </div>
    </div>
  );
};

export default CarSale;
