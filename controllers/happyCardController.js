import { createHappyCard, deleteHappyCardById, getAllHappyCards, getHappyCardById, updateHappyCard } from "../models/happyCardModel.js";

export async function listHappyCards(req, res) {
    try {
        const cards = await getAllHappyCards();
        res.json({ cards });
    } catch (e) {
        res.status(500).json({ message: "Failed to list happy cards" });
    }
}

export async function getHappyCard(req, res) {
    try {
        const card = await getHappyCardById(req.params.id);
        if (!card) return res.status(404).json({ message: "Not found" });
        res.json({ card });
    } catch (e) {
        res.status(500).json({ message: "Failed to get happy card" });
    }
}

export async function createHappyCardItem(req, res) {
    try {
        const { heading, price, validity, tagline, details, terms_conditions, status } = req.body;
        if (!heading) return res.status(400).json({ message: "Heading is required" });
        const banner_url = req.file ? `/uploads/${req.file.filename}` : null;
        const result = await createHappyCard({ heading, price, validity, tagline, details, terms_conditions, banner_url, status });
        res.status(201).json({ success: true, id: result.id });
    } catch (e) {
        res.status(500).json({ message: "Failed to create happy card" });
    }
}

export async function updateHappyCardItem(req, res) {
    try {
        const { heading, price, validity, tagline, details, terms_conditions, status } = req.body;
        if (!heading) return res.status(400).json({ message: "Heading is required" });
        const banner_url = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("Updating card:", req.params.id, { heading, price, validity, tagline, details, terms_conditions, banner_url, status });
        const ok = await updateHappyCard(req.params.id, { heading, price, validity, tagline, details, terms_conditions, banner_url, status });
        if (!ok) return res.status(404).json({ message: "Card not found" });
        res.json({ success: true, message: "Card updated successfully" });
    } catch (e) {
        console.error("Update error:", e);
        res.status(500).json({ message: "Failed to update happy card", error: e.message });
    }
}

export async function deleteHappyCard(req, res) {
    try {
        const ok = await deleteHappyCardById(req.params.id);
        if (!ok) return res.status(404).json({ message: "Not found" });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: "Failed to delete happy card" });
    }
}
