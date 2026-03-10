import { createMenu, deleteMenuById, getAllMenus, updateMenuById, initMenuTable } from "../models/menuModel.js";

export async function listMenus(req, res) {
    try {
        await initMenuTable();
        const menus = await getAllMenus();
        res.json({ menus });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function createMenuItem(req, res) {
    try {
        const { name, description, category, status } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const menu = await createMenu({ name, description, category, imageUrl, pdfUrl: null, status });
        res.status(201).json({ message: "Created", menu });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function updateMenuItem(req, res) {
    try {
        const { name, description, category, status } = req.body;
        if (!name) return res.status(400).json({ message: "Name is required" });
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const ok = await updateMenuById(req.params.id, { name, description, category, imageUrl, pdfUrl: null, status });
        if (!ok) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}

export async function deleteMenu(req, res) {
    try {
        const { id } = req.params;
        const ok = await deleteMenuById(id);
        if (!ok) return res.status(404).json({ message: "Not found" });
        res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}
