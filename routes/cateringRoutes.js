import express from "express";
import { deleteCatering, getCatering, listCaterings, submitCatering, updateCatering } from "../controllers/cateringController.js";
import { initCateringTable } from "../models/cateringModel.js";

const router = express.Router();

initCateringTable().catch(() => { });

router.post("/", submitCatering);
router.get("/", listCaterings);
router.get("/:id", getCatering);
router.put("/:id", updateCatering);
router.delete("/:id", deleteCatering);

export default router;
