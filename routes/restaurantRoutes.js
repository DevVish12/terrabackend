import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createRestaurantItem, deleteRestaurant, listRestaurants, updateRestaurant } from "../controllers/restaurantController.js";

const router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads")),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname || "");
        cb(null, unique + ext);
    },
});
const upload = multer({ storage });

router.get("/", listRestaurants);
router.post("/", upload.array("images", 10), createRestaurantItem);
router.put("/:id", upload.array("images", 10), updateRestaurant);
router.delete("/:id", deleteRestaurant);

export default router;
