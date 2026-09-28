import express from "express";
import {
  getAllOffer,
  createNewOffer,
  findOfferById,
  updateOfferById,
  deleteOfferById
} from "../controllers/offerControllers.js";
import { requireAuth, requireRole } from "../middleware/requireAuth.js";

const OfferRouter = express.Router();

// Offers are staff-only
OfferRouter.use(requireAuth, requireRole("worker", "admin"))

//ROUTES

//GET /offers
OfferRouter.get("/", getAllOffer)

//POST /offers
OfferRouter.post("/", createNewOffer)

//GET /offers/:offerId
OfferRouter.get("/:offerId", findOfferById)

//PUT /offers/:offerId
OfferRouter.put("/:offerId", updateOfferById)

//DELETE /offers/:offerId
OfferRouter.delete("/:offerId",deleteOfferById)

export default OfferRouter;