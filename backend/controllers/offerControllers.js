import * as Offer from "../models/offerModel.js";
// imports all as Offer

const getAllOffer = async (req, res) => {
    const getAllResponse = await Offer.getAll()
    res.json(getAllResponse);
};

const createNewOffer = async (req, res) => {
    const data = req.body
    
    const newOffer = await Offer.addOne(data)

    if (newOffer.error) {
        res.status(400).json({message: newOffer.error });
    } else {
        res.status(201).json(newOffer);
    }
};

const findOfferById = async (req, res) => {
    const offerId = req.params.offerId;
    const offer = await Offer.findById(offerId);

    if (!offer) res.status(404).json({message: "Offer not found"});
    else res.json(offer); 
};

const updateOfferById = async (req, res) => {
    const offerId = req.params.offerId;
    const offer = await Offer.findById(offerId);
    const updatedData = req.body;

    if(!offer) res.status(404).json({message: "Offer not found"});
    
    else {
        const  updatedOffer = await Offer.updateById(offerId, updatedData);
        res.json(updatedOffer);
    }
}

const deleteOfferById = async (req, res) => {
    const offerId = req.params.offerId;
    const offer = await Offer.findById(offerId);

    if (!offer) res.status(404).json({message: "Offer not found "})
    
    else {
        const isDeleted = await Offer.deleteById(offerId);
        if (isDeleted) res.status(200).json({message: "Delete offer successfully"})
        else res.status(500).json({message: "Delete failed"}); 
    }
}

export {
  getAllOffer,
  createNewOffer,
  findOfferById,
  updateOfferById,
  deleteOfferById
};