import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
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
Seed images are copied into uploads/ with a "seed-" prefix so --clean can remove them.
*/

const User = mongoose.model("User");
const Car = mongoose.model("Car");

const SEED_EMAIL = "seed-client@autotori.test";
const SEED_PASSWORD = "seedpassword123";

// Paths (this file is backend/scripts/seed.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCE_IMAGE_DIR = path.join(__dirname, "..", "..", "image"); // project-root /image
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");          // backend/uploads
const SEED_IMAGE_PREFIX = "seed-";

// Must match how real uploads are stored in car.image.
// "/uploads/" -> stores "/uploads/seed-toyota-rav4.jpg"
// ""          -> stores "seed-toyota-rav4.jpg"
const IMAGE_URL_PREFIX = "/uploads/";

// All car images in the project-root /image folder (hero is a banner, so it's left out)
const CAR_IMAGES = [
  "toyota-rav4.jpg.jpg",
  "volvo-xc60.jpg.jpg",
  "bmw-3-series.jpg.jpg",
  "audi-a4.jpg.jpg",
  "mercedes-benz-c-class.jpg.jpg",
  "tesla-model-3.jpg.jpg",
];

// Values match the options in frontend/src/components/CarForm.jsx
// imageFile = a matching picture. Cars without one get the next image from CAR_IMAGES.
const SEED_CARS = [
  { make: "Toyota", model: "Corolla", year: 2019, mileage: 68000, fuel: "Hybrid", transmission: "Automatic", location: "Helsinki", condition: "excellent", estimatedPrice: 17900, isVerified: "Accepted", description: "One owner, full service history." },
  { make: "Toyota", model: "RAV4", year: 2021, mileage: 42000, fuel: "Hybrid", transmission: "Automatic", location: "Espoo", condition: "excellent", estimatedPrice: 32500, isVerified: "Accepted", description: "AWD, winter tyres included.", imageFile: "toyota-rav4.jpg.jpg" },
  { make: "Volkswagen", model: "Golf", year: 2016, mileage: 142000, fuel: "Diesel", transmission: "Manual", location: "Tampere", condition: "good", estimatedPrice: 9800, isVerified: "Accepted", description: "Economical commuter car." },
  { make: "Volkswagen", model: "Passat", year: 2018, mileage: 165000, fuel: "Diesel", transmission: "Automatic", location: "Vantaa", condition: "good", estimatedPrice: 14200, isVerified: "Accepted", description: "Estate, tow bar." },
  { make: "Skoda", model: "Octavia", year: 2020, mileage: 89000, fuel: "Petrol", transmission: "Automatic", location: "Turku", condition: "excellent", estimatedPrice: 18400, isVerified: "Accepted", description: "Family estate, large boot." },
  { make: "Skoda", model: "Fabia", year: 2015, mileage: 121000, fuel: "Petrol", transmission: "Manual", location: "Oulu", condition: "fair", estimatedPrice: 5600, isVerified: "Accepted", description: "Small city car, some scratches." },
  { make: "Volvo", model: "V60", year: 2017, mileage: 178000, fuel: "Diesel", transmission: "Automatic", location: "Helsinki", condition: "good", estimatedPrice: 15900, isVerified: "Accepted", description: "Leather seats, parking heater." },
  { make: "Volvo", model: "XC60", year: 2022, mileage: 35000, fuel: "Hybrid", transmission: "Automatic", location: "Espoo", condition: "excellent", estimatedPrice: 44900, isVerified: "Accepted", description: "Plug-in hybrid, still under warranty.", imageFile: "volvo-xc60.jpg.jpg" },
  { make: "BMW", model: "320d", year: 2018, mileage: 134000, fuel: "Diesel", transmission: "Automatic", location: "Jyväskylä", condition: "good", estimatedPrice: 19500, isVerified: "Accepted", description: "M Sport package.", imageFile: "bmw-3-series.jpg.jpg" },
  { make: "Ford", model: "Focus", year: 2014, mileage: 198000, fuel: "Petrol", transmission: "Manual", location: "Lahti", condition: "fair", estimatedPrice: 4300, isVerified: "Accepted", description: "Cheap and reliable first car." },
  { make: "Kia", model: "Ceed", year: 2020, mileage: 61000, fuel: "Petrol", transmission: "Manual", location: "Kuopio", condition: "excellent", estimatedPrice: 15200, isVerified: "Accepted", description: "Remaining manufacturer warranty." },
  { make: "Honda", model: "Civic", year: 2017, mileage: 104000, fuel: "Petrol", transmission: "Manual", location: "Tampere", condition: "good", estimatedPrice: 12900, isVerified: "Accepted", description: "Well maintained." },
  { make: "Mercedes-Benz", model: "C-Class", year: 2021, mileage: 52000, fuel: "Diesel", transmission: "Automatic", location: "Helsinki", condition: "excellent", estimatedPrice: 33900, isVerified: "Accepted", description: "AMG Line, full service history.", imageFile: "mercedes-benz-c-class.jpg.jpg" },
  { make: "Tesla", model: "Model 3", year: 2022, mileage: 41000, fuel: "Electric", transmission: "Automatic", location: "Espoo", condition: "excellent", estimatedPrice: 31900, isVerified: "Accepted", description: "Long Range, Autopilot.", imageFile: "tesla-model-3.jpg.jpg" },
  // Accepted but no estimate yet: estimatedPrice is often null in real data too
  { make: "Mazda", model: "CX-5", year: 2019, mileage: 87000, fuel: "Petrol", transmission: "Automatic", location: "Helsinki", condition: "good", estimatedPrice: null, isVerified: "Accepted", description: "AWD, waiting for valuation." },
  // Pending / Rejected: must NOT be shown to buyers (tests the isVerified filter)
  { make: "Audi", model: "A4", year: 2016, mileage: 155000, fuel: "Diesel", transmission: "Automatic", location: "Helsinki", condition: "good", estimatedPrice: null, isVerified: "Pending", description: "Pending review.", imageFile: "audi-a4.jpg.jpg" },
  { make: "Toyota", model: "Yaris", year: 2018, mileage: 72000, fuel: "Hybrid", transmission: "Automatic", location: "Espoo", condition: "good", estimatedPrice: null, isVerified: "Pending", description: "Pending review." },
  { make: "Nissan", model: "Qashqai", year: 2015, mileage: 210000, fuel: "Diesel", transmission: "Manual", location: "Pori", condition: "poor", estimatedPrice: null, isVerified: "Pending", description: "Pending review." },
  { make: "Opel", model: "Astra", year: 2012, mileage: 260000, fuel: "Petrol", transmission: "Manual", location: "Vaasa", condition: "poor", estimatedPrice: null, isVerified: "Rejected", description: "Rejected: inspection failed." },
  { make: "Peugeot", model: "308", year: 2013, mileage: 230000, fuel: "Diesel", transmission: "Manual", location: "Turku", condition: "poor", estimatedPrice: null, isVerified: "Rejected", description: "Rejected: incomplete documents." },
];

// Copies every image in CAR_IMAGES into backend/uploads once.
// Returns a lookup: { "toyota-rav4.jpg.jpg": "/uploads/seed-toyota-rav4.jpg", ... }
const copySeedImages = async () => {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const lookup = {};
  for (const imageFile of CAR_IMAGES) {
    const cleanName = imageFile.replace(/\.jpg\.jpg$/i, ".jpg"); // fix the double extension
    const destName = `${SEED_IMAGE_PREFIX}${cleanName}`;
    await fs.copyFile(path.join(SOURCE_IMAGE_DIR, imageFile), path.join(UPLOADS_DIR, destName));
    lookup[imageFile] = `${IMAGE_URL_PREFIX}${destName}`;
  }
  return lookup;
};

// Removes only the images this script copied (anything starting with "seed-")
const cleanSeedImages = async () => {
  try {
    const files = await fs.readdir(UPLOADS_DIR);
    const seedFiles = files.filter((file) => file.startsWith(SEED_IMAGE_PREFIX));
    await Promise.all(seedFiles.map((file) => fs.unlink(path.join(UPLOADS_DIR, file))));
    return seedFiles.length;
  } catch {
    return 0; // uploads/ doesn't exist yet
  }
};

const clean = async () => {
  await cleanSeedImages();
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

  const imageLookup = await copySeedImages();

  // Matching image if the car has one, otherwise cycle through CAR_IMAGES
  let nextImage = 0;
  const carDocs = SEED_CARS.map(({ imageFile, ...car }) => {
    const file = imageFile ?? CAR_IMAGES[nextImage++ % CAR_IMAGES.length];
    return { ...car, image: imageLookup[file], client: user._id };
  });

  // insertMany instead of carModel.addOne(): addOne ignores isVerified
  const cars = await Car.insertMany(carDocs);

  const accepted = cars.filter((car) => car.isVerified === "Accepted").length;
  console.log(`Removed ${removed} old seed cars.`);
  console.log(`Inserted ${cars.length} cars (${accepted} Accepted, all with images) owned by ${SEED_EMAIL} / ${SEED_PASSWORD}`);
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