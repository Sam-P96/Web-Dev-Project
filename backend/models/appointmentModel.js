import mongoose from "mongoose";

/* 
Field
  car
  seller
  worker
  scheduledAt   TBD the format, but talked to Aakash about this, and that Aakash and Duy will work this out, then I can store it here
  location
  notes
  status        default is "booked"
*/


const appointmentSchema = new mongoose.Schema(
  {
    car: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    worker: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    scheduledAt: { type: Date, required: true },
    location: { type: String},
    notes: { type: String},
    status: {
      type: String,
      enum: ["booked", "confirmed", "completed", "cancelled"],
      default: "booked"
    }
  },
  { timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
// new Require Fields

const REQUIRED_FIELDS = ['car', 'seller', 'scheduledAt'];

const ALLOWED_UPDATE_FIELDS = [
    'worker', 'scheduledAt', 'location', 'notes', 'status'
];

const SIGNUP_ROLES = ['client', 'worker'];




const getAll = async (workerId) => {
  const filter = workerId ? { worker: workerId } : {};
  return await Appointment.find(filter)
    .populate("car", "make model year")
    .populate("seller", "name")
    .sort({ scheduledAt: 1 });
};

const addOne = async (data) => {
    const missing = REQUIRED_FIELDS.filter(field => !data[field]);
    if (missing.length > 0) {
        return { error: `Missing required fields: ${missing.join(', ')}` };
    }

    try {
        const newAppointment = await Appointment.create({
            car: data.car,
            seller: data.seller,
            worker: data.worker ?? null,
            scheduledAt: data.scheduledAt,
            location: data.location,
            notes: data.notes,
            status: data.status ?? "booked"
        });
        return newAppointment;
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

    const appointment = await Appointment.findById(id);
    return appointment ?? false;
};

const updateById = async (id, updatedData) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const allowed = {};
    ALLOWED_UPDATE_FIELDS.forEach((field) => {
        if (updatedData[field] !== undefined) {
            allowed[field] = updatedData[field];
        }
    });

    const appointment = await Appointment.findByIdAndUpdate(id, allowed, {
        new: true,
        runValidators: true
    });

    return appointment ?? false;
};

const deleteById = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) return false;

    const appointment = await Appointment.findByIdAndDelete(id);
    return appointment ? true : false;
};






export {
    addOne,
    getAll,
    findById,
    updateById,
    deleteById
};