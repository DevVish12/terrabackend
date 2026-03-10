import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { initDb } from "./models/db.js";
import { initTestimonialTable } from "./models/testimonialModel.js";
import { initHappyCardTable } from "./models/happyCardModel.js";
import { initMenuTable } from "./models/menuModel.js";
import { initRestaurantTable } from "./models/restaurantModel.js";
import adminRoutes from "./routes/adminRoutes.js";
import cateringRoutes from "./routes/cateringRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import happyCardRoutes from "./routes/happyCardRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import offerRoutes from "./routes/offerRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ||
    "https://terradinenwine.com,http://localhost:5173,http://localhost:5174,http://localhost:3000")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, cb) => {
            // allow non-browser tools (no Origin header)
            if (!origin) return cb(null, true);
            if (allowedOrigins.includes(origin)) return cb(null, true);
            return cb(null, false);
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

app.options("*", cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/catering", cateringRoutes);
app.use("/api/happycard", happyCardRoutes);
app.use("/api/testimonial", testimonialRoutes);
// serve uploaded files
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const port = process.env.PORT || 5000;

initDb()
    .then(async () => {
        try {
            await initTestimonialTable();
            await initHappyCardTable();
            await initMenuTable();
            await initRestaurantTable();
        } catch (e) {
            console.error("Failed to init tables", e);
        }
        app.listen(port, () => {
            console.log(`Backend listening on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to init DB", err);
        process.exit(1);
    });
