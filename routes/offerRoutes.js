import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createOfferItem, deleteOffer, listOffers, updateOffer } from "../controllers/offerController.js";
import { initOfferTable } from "../models/offerModel.js";

const router = express.Router();

// Ensure table exists
initOfferTable().catch(() => { });

// Multer storage for banners
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, "offer-" + uniqueSuffix + ext);
    },
});
const upload = multer({ storage });

router.get("/", listOffers);
router.post("/", upload.single("banner"), createOfferItem);
router.put("/:id", upload.single("banner"), updateOffer);
router.delete("/:id", deleteOffer);

export default router;
