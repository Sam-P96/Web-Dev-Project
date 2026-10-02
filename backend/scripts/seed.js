import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { getMongoUri } from "../db.js";
// Importing the model files registers the "User" and "Car" models with mongoose
import "../models/userModel.js";
import "../models/carModel.js";

/* Seeds the dev database with sample cars (for the chatbot and the Find Cars page).

Usage (from backend/):
    npm run seed           -> (re)create the seed user + its cars
    npm run seed -- --clean -> only remove the seed user + its cars

Safe to run many times: it only ever touches the seed user and cars owned by that user.
Real users and their cars are never modified.
*/

const User = mongoose.model("User");
const Car = mongoose.model("Car");

const SEED_EMAIL = "seed-client@autotori.test";
const SEED_PASSWORD = "seedpassword123";

// Values match the options in frontend/src/components/CarForm.jsx
const SEED_CARS = [
  { make: "Toyota", model: "Corolla", year: 2019, mileage: 68000, fuel: "Hybrid", transmission: "Automatic", location: "Helsinki", condition: "excellent", estimatedPrice: 17900, isVerified: "Accepted", description: "One owner, full service history." },
  { make: "Toyota", model: "RAV4", year: 2021, mileage: 42000, fuel: "Hybrid", transmission: "Automatic", location: "Espoo", condition: "excellent", estimatedPrice: 32500, isVerified: "Accepted", description: "AWD, winter tyres included." },
  { make: "Volkswagen", model: "Golf", year: 2016, mileage: 142000, fuel: "Diesel", transmission: "Manual", location: "Tampere", condition: "good", estimatedPrice: 9800, isVerified: "Accepted", description: "Economical commuter car." },
  { make: "Volkswagen", model: "Passat", year: 2018, mileage: 165000, fuel: "Diesel", transmission: "Automatic", location: "Vantaa", condition: "good", estimatedPrice: 14200, isVerified: "Accepted", description: "Estate, tow bar." },
  { make: "Skoda", model: "Octavia", year: 2020, mileage: 89000, fuel: "Petrol", transmission: "Automatic", location: "Turku", condition: "excellent", estimatedPrice: 18400, isVerified: "Accepted", description: "Family estate, large boot." },
  { make: "Skoda", model: "Fabia", year: 2015, mileage: 121000, fuel: "Petrol", transmission: "Manual", location: "Oulu", condition: "fair", estimatedPrice: 5600, isVerified: "Accepted", description: "Small city car, some scratches." },
  { make: "Volvo", model: "V60", year: 2017, mileage: 178000, fuel: "Diesel", transmission: "Automatic", location: "Helsinki", condition: "good", estimatedPrice: 15900, isVerified: "Accepted", description: "Leather seats, parking heater." },
  { make: "Volvo", model: "XC60", year: 2022, mileage: 35000, fuel: "Hybrid", transmission: "Automatic", location: "Espoo", condition: "excellent", estimatedPrice: 44900, isVerified: "Accepted", description: "Plug-in hybrid, still under warranty." },
  { make: "BMW", model: "320d", year: 2018, mileage: 134000, fuel: "Diesel", transmission: "Automatic", location: "Jyväskylä", condition: "good", estimatedPrice: 19500, isVerified: "Accepted", description: "M Sport package." },
  { make: "Ford", model: "Focus", year: 2014, mileage: 198000, fuel: "Petrol", transmission: "Manual", location: "Lahti", condition: "fair", estimatedPrice: 4300, isVerified: "Accepted", description: "Cheap and reliable first car." },
  { make: "Kia", model: "Ceed", year: 2020, mileage: 61000, fuel: "Petrol", transmission: "Manual", location: "Kuopio", condition: "excellent", estimatedPrice: 15200, isVerified: "Accepted", description: "Remaining manufacturer warranty." },
  { make: "Honda", model: "Civic", year: 2017, mileage: 104000, fuel: "Petrol", transmission: "Manual", location: "Tampere", condition: "good", estimatedPrice: 12900, isVerified: "Accepted", description: "Well maintained." },
  // Accepted but no estimate yet: estimatedPrice is often null in real data too
  { make: "Mazda", model: "CX-5", year: 2019, mileage: 87000, fuel: "Petrol", transmission: "Automatic", location: "Helsinki", condition: "good", estimatedPrice: null, isVerified: "Accepted", description: "AWD, waiting for valuation." },
  // Pending / Rejected: must NOT be shown to buyers (tests the isVerified filter)
  { make: "Audi", model: "A4", year: 2016, mileage: 155000, fuel: "Diesel", transmission: "Automatic", location: "Helsinki", condition: "good", estimatedPrice: null, isVerified: "Pending", description: "Pending review." },
  { make: "Toyota", model: "Yaris", year: 2018, mileage: 72000, fuel: "Hybrid", transmission: "Automatic", location: "Espoo", condition: "good", estimatedPrice: null, isVerified: "Pending", description: "Pending review." },
  { make: "Nissan", model: "Qashqai", year: 2015, mileage: 210000, fuel: "Diesel", transmission: "Manual", location: "Pori", condition: "poor", estimatedPrice: null, isVerified: "Pending", description: "Pending review." },
  { make: "Opel", model: "Astra", year: 2012, mileage: 260000, fuel: "Petrol", transmission: "Manual", location: "Vaasa", condition: "poor", estimatedPrice: null, isVerified: "Rejected", description: "Rejected: inspection failed." },
  { make: "Peugeot", model: "308", year: 2013, mileage: 230000, fuel: "Diesel", transmission: "Manual", location: "Turku", condition: "poor", estimatedPrice: null, isVerified: "Rejected", description: "Rejected: incomplete documents." },
];

const clean = async () => {
  const user = await User.findOne({ email: SEED_EMAIL });
  if (!user) return 0;
  const { deletedCount } = await Car.deleteMany({ client: user._id });
  await User.deleteOne({ _id: user._id });
  return deletedCount;
};

const seed = async () => {
  const removed = await clean();

  const password = await bcrypt.hash(SEED_PASSWORD, 10);
  const user = await User.create({ name: "Seed Client", email: SEED_EMAIL, password, role: "client" });

  // insertMany instead of carModel.addOne(): addOne ignores isVerified
  const cars = await Car.insertMany(SEED_CARS.map((car) => ({ ...car, client: user._id })));

  const accepted = cars.filter((car) => car.isVerified === "Accepted").length;
  console.log(`Removed ${removed} old seed cars.`);
  console.log(`Inserted ${cars.length} cars (${accepted} Accepted) owned by ${SEED_EMAIL} / ${SEED_PASSWORD}`);
};

const uri = getMongoUri();
if (!uri) {
  console.error("MONGODB_URI is not set in .env");
  process.exit(1);
}

try {
  await mongoose.connect(uri);
  console.log(`Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

  if (process.argv.includes("--clean")) {
    const removed = await clean();
    console.log(`Removed seed user and ${removed} seed cars.`);
  } else {
    await seed();
  }
} catch (err) {
  console.error(`Seed failed: ${err.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
