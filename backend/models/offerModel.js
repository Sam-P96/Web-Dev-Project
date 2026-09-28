import mongoose from "mongoose";

/*This is for the worker to make a price offer for a car a seller submits if the seller originally declined 
the AI generated offer estimate. Maybe this could be used in junction with a form for the worker to fill in. 
Note: I bet we could make an auto reply or auto fill for the worker wtih AI if we have time. 

fIELDS:
    car
    worker
    amount
    message     
    status      whether or not the offer made it through, so pending, accepted, rejected, the thing is.. for legal reasons
                there should not be shown as accepted unless its confirmed in person, so there should ALWAYS be a disclaimer
                where its said "accepted if..... meets a specific criteria" might have to make something for the message for that
    respondAt   This i the date

*/

const offerSchema = new mongoose.Schema(
    {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, min: 0 },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending"
    },
    respondedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema)
// Require Fields

const REQUIRED_FIELDS = ['car', 'worker', 'amount', 'message'];

// workers for offer can change (in case this is needed in a hypothetical scenario)
const ALLOWED_UPDATE_FIELDS = [
    'worker', 'amount', 'message', 'status'
];

const getAll = async () => {
    return await Offer.find();
};

const addOne = async (data) => {
    const missing = REQUIRED_FIELDS.filter(field => !data[field]);
    if (missing.length > 0) {
        return { error: `Missing required fields: ${missing.join(', ')}` };
    }

    try {
        const newOffer = await Offer.create({
            car: data.car,
            worker: data.worker,
            amount: data.amount,
            message: data.message,
            status: data.status,
            respondedAt: data.respondedAt,
        });
        return newOffer;
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

    const offer = await Offer.findById(id);
    return offer ?? false;
};

const updateById = async (id, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const allowed = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
        if (updatedData[field] !== undefined) {
            allowed[field] = updatedData[field];
        }
    });

    const offer = await Offer.findByIdAndUpdate(id, allowed, {
        returnDocument: 'after',
        runValidators: true
    });

    return offer ?? false;
};

const deleteById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const offer = await Offer.findByIdAndDelete(id);
    return offer ? true : false;
};

export {
    addOne,
    getAll,
    findById,
    updateById,
    deleteById
};