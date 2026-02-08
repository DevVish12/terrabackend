import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createHappyCardItem, deleteHappyCard, getHappyCard, listHappyCards, updateHappyCardItem } from "../controllers/happyCardController.js";
import { initHappyCardTable } from "../models/happyCardModel.js";

const router = express.Router();

initHappyCardTable().catch(() => { });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads"));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, "happy-" + uniqueSuffix + ext);
    },
});
const upload = multer({ storage });

router.get("/", listHappyCards);
router.get("/:id", getHappyCard);
router.post("/", upload.single("banner"), createHappyCardItem);
router.put("/:id", upload.single("banner"), updateHappyCardItem);
router.delete("/:id", deleteHappyCard);

export default router;
