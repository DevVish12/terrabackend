import { createTestimonial, deleteTestimonialById, getAllTestimonials, initTestimonialTable } from '../models/testimonialModel.js';

// ensure table on controller load
initTestimonialTable().catch((e) => console.error('Failed to init testimonials table', e));

export async function listTestimonials(req, res) {
    try {
        const testimonials = await getAllTestimonials();
        res.json({ testimonials });
    } catch (e) {
        res.status(500).json({ message: 'Failed to load testimonials' });
    }
}

export async function createTestimonialItem(req, res) {
    try {
        const { name, address, details, rating } = req.body;
        if (!name) return res.status(400).json({ message: 'Name is required' });
        let ratingNum = null;
        if (rating !== undefined && rating !== null && rating !== "") {
            const parsed = parseInt(rating, 10);
            ratingNum = Number.isNaN(parsed) ? null : parsed;
            if (ratingNum !== null) {
                if (ratingNum < 1 || ratingNum > 5) {
                    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
                }
            }
        }
        const { id } = await createTestimonial({ name, address, details, rating: ratingNum });
        res.status(201).json({ id, message: 'Testimonial created' });
    } catch (e) {
        console.error('Create testimonial error', e);
        res.status(500).json({ message: 'Failed to create testimonial' });
    }
}

export async function deleteTestimonial(req, res) {
    try {
        const { id } = req.params;
        const ok = await deleteTestimonialById(id);
        if (!ok) return res.status(404).json({ message: 'Not found' });
        res.json({ message: 'Deleted' });
    } catch (e) {
        res.status(500).json({ message: 'Failed to delete testimonial' });
    }
}
