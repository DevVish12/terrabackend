import bcrypt from "bcryptjs";
import { createAdmin, findAdminByEmail } from "../models/adminModel.js";
import { pool } from "../models/db.js";

export async function register(req, res) {
    try {
        const { email, password, confirmPassword } = req.body;
        if (!email || !password || !confirmPassword) {
            return res.status(400).json({ message: "Email, password, and confirmPassword are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const existing = await findAdminByEmail(email);
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const admin = await createAdmin({ email, name: null, passwordHash });
        return res.status(201).json({ message: "Registered", admin });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await findAdminByEmail(email);
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });

        const ok = await bcrypt.compare(password, admin.password_hash);
        if (!ok) return res.status(401).json({ message: "Invalid credentials" });

        // Ensure DB connection is usable (helps surface config issues as JSON)
        // No writes are performed during login.
        await pool.query("SELECT 1");

        return res.json({ message: "Logged in", admin: { id: admin.id, email: admin.email, name: admin.name } });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
}
