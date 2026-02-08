import { pool } from "./db.js";

export async function initMenuTable() {
    const sql = `
        CREATE TABLE IF NOT EXISTS menus (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            category ENUM('food', 'bar') DEFAULT 'food',
            image_url VARCHAR(255),
            pdf_url VARCHAR(255),
            status ENUM('active', 'inactive') DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    await pool.query(sql).catch(() => {});
    
    // Add missing columns if they don't exist (migration)
    try {
        const migrateColumns = [
            { name: 'description', sql: 'ADD COLUMN description TEXT' },
            { name: 'category', sql: "ADD COLUMN category ENUM('food', 'bar') DEFAULT 'food'" },
            { name: 'pdf_url', sql: 'ADD COLUMN pdf_url VARCHAR(255)' },
            { name: 'status', sql: "ADD COLUMN status ENUM('active', 'inactive') DEFAULT 'active'" },
        ];
        
        for (const col of migrateColumns) {
            try {
                await pool.query(`ALTER TABLE menus ${col.sql}`);
                console.log(`✓ Migrated column: ${col.name}`);
            } catch (alterErr) {
                // Column might already exist, that's fine
                if (alterErr.code !== 'ER_DUP_FIELDNAME' && alterErr.code !== 'ER_DUP_KEYNAME') {
                    // silently continue - column probably exists
                }
            }
        }
    } catch (err) {
        console.error("Menu migration error:", err.message);
    }
}

export async function createMenu({ name, description, category, imageUrl, pdfUrl, status }) {
    const sql = "INSERT INTO menus (name, description, category, image_url, pdf_url, status) VALUES (?, ?, ?, ?, ?, ?)";
    const [result] = await pool.query(sql, [name, description || null, category || 'food', imageUrl || null, pdfUrl || null, status || 'active']);
    return { id: result.insertId, name, description, category, image_url: imageUrl, pdf_url: pdfUrl, status };
}

export async function getAllMenus() {
    const [rows] = await pool.query("SELECT * FROM menus WHERE status = 'active' ORDER BY category, created_at DESC");
    return rows;
}

export async function deleteMenuById(id) {
    const [result] = await pool.query("DELETE FROM menus WHERE id = ?", [id]);
    return result.affectedRows > 0;
}

export async function updateMenuById(id, { name, description, category, imageUrl, pdfUrl, status }) {
    const sql = "UPDATE menus SET name = ?, description = ?, category = ?, image_url = COALESCE(?, image_url), pdf_url = COALESCE(?, pdf_url), status = ? WHERE id = ?";
    const [result] = await pool.query(sql, [name, description || null, category || 'food', imageUrl, pdfUrl, status || 'active', id]);
    return result.affectedRows > 0;
}
