import mongoose from 'mongoose';

// ⚠️⚠️⚠️Dont delete all the notes for this one, still in progress (images)

/* "Condition" was suggested by claude... but it's so subjective. I dont know. Might remove. Actually, probably should remove.
^Will discuss in the meeting

Fields:
    client
    make
    year
    model
    mileage         should be measured in km
    condition       irrelevant for data collection
    estimatePrice   in Euro
*/
const carSchema = new mongoose.Schema({
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true, trim: true },
  model: { type: String, required: true, trim: true },
  year: { type: Number, required: true },
  mileage: { type: Number, required: true, min: 0 },
  // Added this cus the form had them. - Sam
  fuel: { type: String, trim: true },
  transmission: { type: String, trim: true },
  location: { type: String, trim: true },
  // MAYBE USELESS CRITERIA for data collection but useful for buyers?
  condition: { type: String, enum: ['poor', 'fair', 'good', 'excellent'], default: 'good' },
  description: { type: String },
  image: { type: String }, // so I added this image here (Aakash)
  // "Asking Price" from CarForm. estimatedPrice stays the AI estimate
  price: { type: Number, min: 0 },
  // true = sent with handlePostCar in CarForm -> shows in WorkerOffers. false = normal listing -> shows in AvailableCars
  company: { type: Boolean, default: false },
  estimatedPrice: { type: Number, default: null },
  isVerified: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
});



const Car = mongoose.model('Car', carSchema);

// new Require Fields

const REQUIRED_FIELDS = ['client', 'make', 'model', 'year', 'mileage'];

// client is deliberately NOT updatable — you don't hand off ownership via PUT
const ALLOWED_UPDATE_FIELDS = [
  'make',
  'model',
  'year',
  'mileage',
  'fuel',
  'transmission',
  'location',
  'condition',
  'description',
  'estimatedPrice',
  'isVerified',
];

const getAll = async () => {
  return await Car.find();
};

const addOne = async (data) => {
  const missing = REQUIRED_FIELDS.filter((field) => !data[field]);
  if (missing.length > 0) {
    return { error: `Missing required fields: ${missing.join(', ')}` };
  }

  try {
    const newCar = await Car.create({
      client: data.client,
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      fuel: data.fuel,
      transmission: data.transmission,
      location: data.location,
      condition: data.condition,
      description: data.description,
      estimatedPrice: data.estimatedPrice,
      image: data.image, // image added here as well
      price: data.price,
      company: data.company,
    });
    return newCar;
  } catch (err) {
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern)[0];
      return { error: `${field} already in use` };
    }
    return { error: err.message };
  }
};

const findById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const car = await Car.findById(id).populate('client', 'name email phone address');
  return car ?? false;
};

const updateById = async (id, updatedData) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const allowed = {};
  ALLOWED_UPDATE_FIELDS.forEach((field) => {
    if (updatedData[field] !== undefined) {
      allowed[field] = updatedData[field];
    }
  });

  const car = await Car.findByIdAndUpdate(id, allowed, {
    returnDocument: 'after',
    runValidators: true,
  });

  return car ?? false;
};

const deleteById = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;

  const car = await Car.findByIdAndDelete(id);
  return car ? true : false;
};

// Search for Ridhi's FindCarsPrime page. Every filter is optional: no filters = every listed car
const search = async (filters) => {
  // Same rule as AvailableCars: cars sold to the company are not public listings
  const query = { company: { $ne: true } };

  if (filters.make) query.make = filters.make;
  if (filters.model) query.model = filters.model;

  if (filters.minYear || filters.maxYear) {
    query.year = {};
    if (filters.minYear) query.year.$gte = Number(filters.minYear);
    if (filters.maxYear) query.year.$lte = Number(filters.maxYear);
  }

  // Checks the asking price, or the AI estimate when a car has no asking price (like the seed cars)
  // Same fallback as Duy's fix in AvailableCars: price ?? estimatedPrice
  if (filters.minPrice || filters.maxPrice) {
    const range = {};
    if (filters.minPrice) range.$gte = Number(filters.minPrice);
    if (filters.maxPrice) range.$lte = Number(filters.maxPrice);
    query.$or = [{ price: range }, { price: null, estimatedPrice: range }];
  }

  return await Car.find(query);
};

export { addOne, getAll, findById, updateById, deleteById, search };