import { Router } from "express";
import { deleteContact, getContact, listContacts, submitContact } from "../controllers/contactController.js";

const router = Router();

router.post("/", submitContact);
router.get("/", listContacts);
router.get("/:id", getContact);
router.delete("/:id", deleteContact);

export default router;
