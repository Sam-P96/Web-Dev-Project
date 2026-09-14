import mongoose from "mongoose";

/* "Condition" was suggested by claude... but it's so subjective. I dont know. Might remove. Actually, probably should remove.
^Will discuss in the meeting 

Fields:
    seller
    make
    year
    model
    mileage         should be measured in km
    condition       irrelevant for data collection
    estimatePrice   in Euro 
*/



const carSchema = new mongoose.Schema(
    {
        seller: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        make: {type: String, required: true, trim: true},
        model: { type: String, required: true, trim: true },
        year: { type: Number, required: true},
        mileage: { type: Number, required: true, min: 0 },
        // MAYBE USELESS CRITERIA for data collection but useful for buyers?
        condition: { type: String, enum: ["poor", "fair", "good", "excellent"], default: "good" },
        description: { type: String},
        // Does anyone know this?
        // images: [????????????HELP???????????????]
        // CHECK WEB_DEV_SCHOOL_NOTES file on Drive to figure out how to fix this
        estimatedPrice: { type: Number, default: null },
    }
)

export default mongoose.model("Car", carSchema);