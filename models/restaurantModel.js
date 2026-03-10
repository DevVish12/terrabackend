import { ensureTable, pool } from "./db.js";

const RESTAURANT_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(512),
    location VARCHAR(255),
    description TEXT,
    contact_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

export async function initRestaurantTable() {
    await ensureTable(RESTAURANT_TABLE_SQL);
    
    // Add missing columns if they don't exist (migration)
    try {
        const migrateColumns = [
            { name: 'description', sql: 'ADD COLUMN description TEXT' },
            { name: 'contact_number', sql: 'ADD COLUMN contact_number VARCHAR(20)' },
        ];
        
        for (const col of migrateColumns) {
            try {
                await pool.query(`ALTER TABLE restaurants ${col.sql}`);
                console.log(`✓ Migrated column: ${col.name}`);
            } catch (alterErr) {
                // Column might already exist, that's fine
                if (alterErr.code !== 'ER_DUP_FIELDNAME' && alterErr.code !== 'ER_DUP_KEYNAME') {
                    // silently continue
                }
            }
        }
    } catch (err) {
        console.error("Restaurant migration error:", err.message);
    }
}

export async function createRestaurant({ name, address, location, description, contact_number }) {
    const [result] = await pool.query(
        "INSERT INTO restaurants (name, address, location, description, contact_number) VALUES (?, ?, ?, ?, ?)",
        [name, address || null, location || null, description || null, contact_number || null]
    );
    return { id: result.insertId };
}

export async function updateRestaurantById(id, { name, address, location, description, contact_number }) {
    const [res] = await pool.query(
        "UPDATE restaurants SET name = ?, address = ?, location = ?, description = ?, contact_number = ? WHERE id = ?",
        [name, address || null, location || null, description || null, contact_number || null, id]
    );
    return res.affectedRows > 0;
}

export async function addRestaurantImages(restaurantId, imageUrls) {
    if (!imageUrls?.length) return;
    const values = imageUrls.map((url) => [restaurantId, url]);
    await pool.query(
        "INSERT INTO restaurant_images (restaurant_id, image_url) VALUES ?",
        [values]
    );
}

export async function getAllRestaurants() {
    const [rows] = await pool.query("SELECT * FROM restaurants ORDER BY created_at DESC");
    const [images] = await pool.query("SELECT * FROM restaurant_images");
    const imagesByRestaurant = images.reduce((acc, img) => {
        (acc[img.restaurant_id] ||= []).push(img);
        return acc;
    }, {});
    return rows.map((r) => ({
        ...r,
        images: imagesByRestaurant[r.id] || [],
    }));
}

export async function deleteRestaurantById(id) {
    const [res] = await pool.query("DELETE FROM restaurants WHERE id = ?", [id]);
    return res.affectedRows > 0;
}
