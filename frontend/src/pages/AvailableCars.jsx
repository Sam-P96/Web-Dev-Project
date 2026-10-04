import { getAllCars } from '@/api/carApi';
import ListCard from '@/components/ListCard';
import React, { useEffect, useState } from 'react';

const AvailableCars = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await getAllCars();

        console.log(data);

        const formattedOffers = data
          .filter((cars) => !cars.company)
          .map((car) => ({
            id: car._id,
            carName: `${car.make} ${car.model}`,
            mileage: `${car.mileage.toLocaleString()} km`,
            location: car.location,
            sellerName: car.seller,
            price: car.price,
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
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-5 py-10 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <ListCard
          key={item.id}
          id={item.id}
          image={item.image}
          name={item.carName}
          year={item.year}
          km={item.mileage}
          location={item.location}
          price={`€${item.price.toLocaleString()}`}
        />
      ))}
    </div>
  );
};

export default AvailableCars;
