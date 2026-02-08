import { Router } from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { createMenuItem, deleteMenu, listMenus, updateMenuItem } from "../controllers/menuController.js";

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

router.get("/", listMenus);
router.post("/", upload.single("image"), createMenuItem);
router.put("/:id", upload.single("image"), updateMenuItem);
router.delete("/:id", deleteMenu);

export default router;
