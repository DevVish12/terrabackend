import { ensureTable, pool } from "./db.js";

const HAPPY_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS happy_cards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  heading VARCHAR(255) NOT NULL,
  price VARCHAR(50) DEFAULT NULL,
  validity VARCHAR(100) DEFAULT NULL,
  tagline VARCHAR(255) DEFAULT NULL,
  details TEXT DEFAULT NULL,
  terms_conditions TEXT DEFAULT NULL,
  banner_url VARCHAR(255) DEFAULT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

export async function initHappyCardTable() {
    await ensureTable(HAPPY_TABLE_SQL);
    
    // Add missing columns if they don't exist (migration)
    try {
        const columns = ['validity', 'tagline', 'terms_conditions', 'status'];
        for (const col of columns) {
            try {
                await pool.query(`ALTER TABLE happy_cards ADD COLUMN ${col === 'status' ? "status ENUM('active', 'inactive') DEFAULT 'active'" : `${col} ${col === 'tagline' ? "VARCHAR(255)" : "TEXT"} DEFAULT NULL`}`);
                console.log(`✓ Added column: ${col}`);
            } catch (alterErr) {
                // Column might already exist, that's fine
                if (alterErr.code !== 'ER_DUP_FIELDNAME') {
                    console.log(`Column ${col} already exists or error: ${alterErr.code}`);
                }
            }
        }
    } catch (err) {
        console.error("Migration error:", err.message);
    }
}

export async function createHappyCard({ heading, price, validity, tagline, details, terms_conditions, banner_url, status }) {
    const [res] = await pool.query(
        "INSERT INTO happy_cards (heading, price, validity, tagline, details, terms_conditions, banner_url, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [heading, price || null, validity || null, tagline || null, details || null, terms_conditions || null, banner_url || null, status || 'active']
    );
    return { id: res.insertId };
}

export async function getAllHappyCards() {
    const [rows] = await pool.query("SELECT * FROM happy_cards ORDER BY created_at DESC");
    return rows;
}

export async function getHappyCardById(id) {
    const [rows] = await pool.query("SELECT * FROM happy_cards WHERE id = ?", [id]);
    return rows[0] || null;
}

export async function updateHappyCard(id, { heading, price, validity, tagline, details, terms_conditions, banner_url, status }) {
    const [res] = await pool.query(
        "UPDATE happy_cards SET heading = ?, price = ?, validity = ?, tagline = ?, details = ?, terms_conditions = ?, banner_url = COALESCE(?, banner_url), status = ? WHERE id = ?",
        [heading, price || null, validity || null, tagline || null, details || null, terms_conditions || null, banner_url, status || 'active', id]
    );
    return res.affectedRows > 0;
}

export async function deleteHappyCardById(id) {
    const [res] = await pool.query("DELETE FROM happy_cards WHERE id = ?", [id]);
    return res.affectedRows > 0;
}
