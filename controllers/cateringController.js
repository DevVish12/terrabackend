import { createCatering, deleteCateringById, getAllCaterings, getCateringById, updateCateringById } from "../models/cateringModel.js";

export async function submitCatering(req, res) {
    try {
        const { name, email, phone, event_date, event_type, guests, message } = req.body;
        if (!name || !email) return res.status(400).json({ message: "Name and email are required" });
        const result = await createCatering({ name, email, phone, event_date, event_type, guests, message });
        res.status(201).json({ success: true, id: result.id });
    } catch (e) {
        res.status(500).json({ message: "Failed to submit catering request" });
    }
}

export async function listCaterings(req, res) {
    try {
        const items = await getAllCaterings();
        res.json({ caterings: items });
    } catch (e) {
        res.status(500).json({ message: "Failed to list catering requests" });
    }
}

export async function getCatering(req, res) {
    try {
        const item = await getCateringById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json({ catering: item });
    } catch (e) {
        res.status(500).json({ message: "Failed to get catering" });
    }
}

export async function updateCatering(req, res) {
    try {
        const { name, email, phone, event_date, event_type, guests, message } = req.body;
        if (!name || !email) return res.status(400).json({ message: "Name and email are required" });
        const ok = await updateCateringById(req.params.id, { name, email, phone, event_date, event_type, guests, message });
        if (!ok) return res.status(404).json({ message: "Not found" });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: "Failed to update catering" });
    }
}

export async function deleteCatering(req, res) {
    try {
        const ok = await deleteCateringById(req.params.id);
        if (!ok) return res.status(404).json({ message: "Not found" });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ message: "Failed to delete catering" });
    }
}
