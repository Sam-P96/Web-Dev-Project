import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchCars } from '../api/carApi';
import FeaturedCarsPrime from "../components/FeaturedCarsPrime";
import CarCardPrime from "../components/CarCardPrime";
import ListCard from '@/components/ListCard';
import SearchPrime from "../components/SearchPrime";


/* I cant anymore. I am wobbling. */
function FindCarsPrime() {
    const [searchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    useEffect(() => {
        const fetchCars = async () => {
            const { make, model, minPrice, maxPrice, minYear, maxYear } = Object.fromEntries(searchParams.entries());
            const results = await searchCars({ make, model, minPrice, maxPrice, minYear, maxYear });
            setCars(results);
        };
        fetchCars();
    }, [searchParams]);

    return (
        <main>
            <section className="bg-[#f5f6f4] px-[6%] py-16">
                <div className="max-w-[1200px] mx-auto">
                    <SearchPrime />
                    <h2 className="text-[32px] font-bold text-[#202522] mb-6">
                        Search Results
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* {cars.map((car) => (
                            <CarCardPrime
                                key={car._id}
                                image=""
                                name={`${car.make} ${car.model}`}
                                year={car.year}
                                km={car.mileage}
                                location={car.location}
                                price={(car.price ?? car.estimatedPrice) != null ? `${(car.price ?? car.estimatedPrice).toLocaleString()}` : "Price on request"}
                            />
                        ))} */}
                        {cars.map((car) => (
                            <ListCard
                                key={car._id}
                                id={car._id}
                                image={car.image}
                                // name={car.carName}
                                name={`${car.make} ${car.model}`}
                                year={car.year}
                                km={car.mileage}
                                location={car.location}
                                // price={`${car.price?.toLocaleString() ?? "N/A"}`
                                price={(car.price ?? car.estimatedPrice) != null ? `${(car.price ?? car.estimatedPrice).toLocaleString()}€` : "Price on request"}
                            />
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}

export default FindCarsPrime;