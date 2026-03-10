import { createOffer, deleteOfferById, getAllOffers, updateOfferById } from "../models/offerModel.js";

export async function listOffers(req, res) {
    try {
        const offers = await getAllOffers();
        res.json({ offers });
    } catch (e) {
        res.status(500).json({ message: "Failed to list offers" });
    }
}

export async function createOfferItem(req, res) {
    try {
        const { heading, price_off, notes } = req.body;
        const banner_url = req.file ? `/uploads/${req.file.filename}` : null;
        if (!heading) return res.status(400).json({ message: "Heading is required" });
        const result = await createOffer({ heading, price_off, notes, banner_url });
        res.status(201).json({ success: true, id: result.id });
    } catch (e) {
        res.status(500).json({ message: "Failed to create offer" });
    }
}

export async function updateOffer(req, res) {
    try {
        const { id } = req.params;
        const { heading, price_off, notes } = req.body;
        const banner_url = req.file ? `/uploads/${req.file.filename}` : null;
        if (!heading) return res.status(400).json({ message: "Heading is required" });
        const ok = await updateOfferById(id, { heading, price_off, notes, banner_url });
        if (!ok) return res.status(404).json({ message: "Offer not found" });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: "Failed to update offer" });
    }
}

export async function deleteOffer(req, res) {
    try {
        const { id } = req.params;
        const ok = await deleteOfferById(id);
        if (!ok) return res.status(404).json({ message: "Offer not found" });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: "Failed to delete offer" });
    }
}
