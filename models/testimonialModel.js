import { ensureTable, pool } from './db.js';

export async function initTestimonialTable() {
    const sql = `CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) DEFAULT NULL,
    details TEXT DEFAULT NULL,
    rating INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
    await ensureTable(sql);
}

export async function createTestimonial({ name, address, details, rating }) {
    const [result] = await pool.query(
        'INSERT INTO testimonials (name, address, details, rating) VALUES (?, ?, ?, ?)',
        [name, address || null, details || null, rating || null]
    );
    return { id: result.insertId };
}

export async function getAllTestimonials() {
    const [rows] = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    return rows;
}

export async function deleteTestimonialById(id) {
    const [res] = await pool.query('DELETE FROM testimonials WHERE id = ?', [id]);
    return res.affectedRows > 0;
}
