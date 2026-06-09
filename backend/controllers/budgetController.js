import pool from '../db.js';

export const getBudgets = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.id, b.amount, b.period, b.category_id, b.start_date, 
                    c.name AS category_name, c.icon AS category_icon, c.color AS category_color,
                    COALESCE(SUM(t.amount), 0) AS spent
             FROM budgets b
             JOIN categories c ON b.category_id = c.id
             LEFT JOIN transactions t ON t.category_id = b.category_id AND t.user_id = b.user_id 
             AND t.type = 'expense'
             AND (
                 (b.period = 'monthly' AND DATE_TRUNC('month', t.transaction_date) >= DATE_TRUNC('month', CURRENT_DATE))
                 OR (b.period = 'weekly' AND DATE_TRUNC('week', t.transaction_date) >= DATE_TRUNC('week', CURRENT_DATE))
             )
             WHERE b.user_id = $1
             GROUP BY b.id, c.name, c.icon, c.color
             ORDER BY c.name`,
            [req.userId]
        );
        res.json({ success: true, data: result.rows });
    } catch (error) {
        console.error('Get Budgets Error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }   
};
 
export const createBudget = async (req, res) => {
    const { amount, period = 'monthly', category_id, startDate } = req.body;

    if (!amount || !category_id) {
        return res.status(400).json({ success: false, message: 'Amount and category_id are required' });
    }
    if (!['monthly', 'weekly'].includes(period)) {
        return res.status(400).json({ success: false, message: 'Invalid period. Must be "monthly" or "weekly"' });
    }

    try {
        const today = new Date();
        const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
        const finalStartDate = startDate || monthStart;
        
        const result = await pool.query(
            `INSERT INTO budgets (user_id, amount, period, category_id, start_date)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [req.userId, amount, period, category_id, finalStartDate]
        );
        res.status(201).json({ success: true, data: result.rows[0], message: 'Budget created' });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: 'Budget for this category and period already exists' });
        }
        console.error('Create Budget Error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const updateBudget = async (req, res) => {
    const { id } = req.params;
    const { amount, period } = req.body;

    try {
        const result = await pool.query(
            `UPDATE budgets SET amount = $1, period = $2, updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 AND user_id = $4 RETURNING *`,
            [amount, period, id, req.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }
        res.json({ success: true, data: result.rows[0], message: 'Budget updated' });
    } catch (error) {
        console.error('Update Budget Error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

export const deleteBudget = async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query(
            `DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING *`,
            [id, req.userId]
        );  

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Budget not found' });
        }
        res.json({ success: true, message: 'Budget deleted successfully' });
    } catch (error) {
        console.error('Delete Budget Error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};
