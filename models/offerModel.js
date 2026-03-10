import { ensureTable, pool } from "./db.js";

const OFFER_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS offers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  heading VARCHAR(255) NOT NULL,
  price_off VARCHAR(50) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  banner_url VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

export async function initOfferTable() {
    await ensureTable(OFFER_TABLE_SQL);
}

export async function createOffer({ heading, price_off, notes, banner_url }) {
    const [result] = await pool.query(
        "INSERT INTO offers (heading, price_off, notes, banner_url) VALUES (?, ?, ?, ?)",
        [heading, price_off || null, notes || null, banner_url || null]
    );
    return { id: result.insertId };
}

export async function getAllOffers() {
    const [rows] = await pool.query("SELECT * FROM offers ORDER BY created_at DESC");
    return rows;
}

export async function updateOfferById(id, { heading, price_off, notes, banner_url }) {
    const [res] = await pool.query(
        "UPDATE offers SET heading = ?, price_off = ?, notes = ?, banner_url = COALESCE(?, banner_url) WHERE id = ?",
        [heading, price_off || null, notes || null, banner_url, id]
    );
    return res.affectedRows > 0;
}

export async function deleteOfferById(id) {
    const [res] = await pool.query("DELETE FROM offers WHERE id = ?", [id]);
    return res.affectedRows > 0;
}
