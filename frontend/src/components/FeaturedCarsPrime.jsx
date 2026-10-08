import CarCardPrime from './CarCardPrime';

// Placeholder data, replace with database data later.
const placeholderCars = [
  {
    id: 1,
    image: '/mercedes-benz-c-class.jpg.jpg',
    name: 'Mercedes-Benz C-Class',
    year: 2022,
    km: '38,500',
    location: 'Helsinki, Finland',
    price: '€34,990',
  },
  {
    id: 2,
    image: '/bmw-3-series.jpg.jpg',
    name: 'BMW 3 Series',
    year: 2021,
    km: '45,200',
    location: 'Helsinki, Finland',
    price: '€31,500',
  },
  {
    id: 3,
    image: '/audi-a4.jpg.jpg',
    name: 'Audi A4',
    year: 2022,
    km: '29,800',
    location: 'Espoo, Finland',
    price: '€33,200',
  },
  {
    id: 4,
    image: '/tesla-model-3.jpg.jpg',
    name: 'Tesla Model 3',
    year: 2023,
    km: '18,400',
    location: 'Helsinki, Finland',
    price: '€38,900',
  },
  {
    id: 5,
    image: '/toyota-rav4.jpg.jpg',
    name: 'Toyota RAV4',
    year: 2021,
    km: '52,100',
    location: 'Vantaa, Finland',
    price: '€29,750',
  },
  {
    id: 6,
    image: '/volvo-xc60.jpg.jpg',
    name: 'Volvo XC60',
    year: 2022,
    km: '41,300',
    location: 'Helsinki, Finland',
    price: '€36,400',
  },
];

function FeaturedCarsPrime() {
  return (
    <section className="max-w-[1200px] mx-auto px-[6%] py-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <p className="text-[#2f9449] text-xs font-extrabold tracking-[1.5px]">OUR COLLECTION</p>
          <h2 className="text-[32px] font-bold text-[#202522] max-[700px]:text-[26px]">
            Featured Cars
          </h2>
        </div>
        <a
          href="listings.html"
          className="text-sm font-bold text-[#1f7a38] whitespace-nowrap transition duration-200 hover:text-[#185f2c]"
        >
          View All Cars →
        </a>
      </div>
      <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        {placeholderCars.map((car) => (
          <CarCardPrime
            key={car.id}
            image={car.image}
            name={car.name}
            year={car.year}
            km={car.km}
            location={car.location}
            price={car.price}
          />
        ))}
      </div>
    </section>
  );
}

export default FeaturedCarsPrime;
