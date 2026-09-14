import express from "express";
import {
  getAllOffer,
  createNewOffer,
  findOfferById,
  updateOfferById,
  deleteOfferById
} from "../controllers/offerControllers.js";

const OfferRouter = express.Router();
//ROUTES

//GET /offers
OfferRouter.get("/offers", getAllOffer)

//POST /offers
OfferRouter.post("/offers", createNewOffer)

//GET /offers/:offerId
OfferRouter.get("/offers/:offerId", findOfferById)

//PUT /offers/:offerId
OfferRouter.put("/offers/:offerId", updateOfferById)

//DELETE /offers/:offerId
OfferRouter.delete("/offers/:offerId",deleteOfferById)

export default OfferRouter;