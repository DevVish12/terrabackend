import { addRestaurantImages, createRestaurant, deleteRestaurantById, getAllRestaurants, updateRestaurantById } from "../models/restaurantModel.js";

export async function listRestaurants(req, res) {
    try {
        const restaurants = await getAllRestaurants();
        res.json({ restaurants });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function createRestaurantItem(req, res) {
    try {
        const { name, address, location, description, contact_number } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });
        const { id } = await createRestaurant({ name, address, location, description, contact_number });
        const files = (req.files || []).map((f) => `/uploads/${f.filename}`);
        await addRestaurantImages(id, files);
        res.status(201).json({ message: "Created", restaurantId: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function updateRestaurant(req, res) {
    try {
        const { id } = req.params;
        const { name, address, location, description, contact_number } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });
        
        const ok = await updateRestaurantById(id, { name, address, location, description, contact_number });
        if (!ok) return res.status(404).json({ message: "Not found" });
        
        const files = (req.files || []).map((f) => `/uploads/${f.filename}`);
        if (files.length > 0) {
            await addRestaurantImages(id, files);
        }
        
        res.json({ message: "Updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function deleteRestaurant(req, res) {
    try {
        const { id } = req.params;
        const ok = await deleteRestaurantById(id);
        if (!ok) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
