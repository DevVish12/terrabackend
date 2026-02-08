import express from 'express';
import { listTestimonials, createTestimonialItem, deleteTestimonial } from '../controllers/testimonialController.js';

const router = express.Router();

router.get('/', listTestimonials);
router.post('/', createTestimonialItem);
router.delete('/:id', deleteTestimonial);

export default router;
