import { createContact, deleteContactById, getAllContacts, getContactById } from "../models/contactModel.js";

export async function submitContact(req, res) {
    try {
        const { name, email, phone, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required" });
        }
        const { id } = await createContact({ name, email, phone, message });
        return res.status(201).json({ message: "Contact submitted", id });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function listContacts(req, res) {
    try {
        const contacts = await getAllContacts();
        return res.json({ contacts });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function getContact(req, res) {
    try {
        const { id } = req.params;
        const contact = await getContactById(id);
        if (!contact) return res.status(404).json({ message: "Not found" });
        return res.json({ contact });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function deleteContact(req, res) {
    try {
        const { id } = req.params;
        const ok = await deleteContactById(id);
        if (!ok) return res.status(404).json({ message: "Not found" });
        return res.json({ message: "Deleted" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}
