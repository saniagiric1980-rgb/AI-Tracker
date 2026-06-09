import pool from "../db.js";

const pctChange = (current, previous) => {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / Math.abs(previous)) * 100;
};

export const getSummary = async (req, res) => {
  try {
    const result = await pool.query(
      `WITH monthly AS (
                SELECT 
                    DATE_TRUNC('month', transaction_date) AS month,
                    type,
                    SUM(amount) AS total
                FROM transactions
                WHERE user_id = $1
                    AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '1 year'
                GROUP BY 1, 2
            )
            SELECT
               COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE) THEN total END), 0) AS total_income,
                COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE) THEN total END), 0) AS total_expense,
                COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' THEN total END), 0) AS prev_income,
                COALESCE(SUM(CASE WHEN month = date_trunc('month', CURRENT_DATE) - INTERVAL '1 month' THEN total END), 0) AS prev_expense
            FROM monthly`,
      [req.userId],
    );

    const row = result.rows[0];
    const incomeThisMonth = pctFloat(row.income_this_month);
    const expenseThisMonth = pctFloat(row.expense_this_month);
    const incomeLastMonth = pctChange(row.income_last_month);
    const expenseLastMonth = pctChange(row.expense_last_month);
    const balance = incomeThisMonth - expenseThisMonth;
    const savingRate =
      incomeThisMonth > 0 ? (balance / incomeThisMonth) * 100 : 0;

    res.json({
      incomeThisMonth,
      expenseThisMonth,
      balance,
      savingRate,
      incomeDelta: pctChange(incomeThisMonth, incomeLastMonth),
      expenseDelta: pctChange(expenseThisMonth, expenseLastMonth),
    });
  } catch (error) {
    console.error("Get Summary Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCategoryBreakdown = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.name AS category_name, c.icon AS category_icon, c.color AS category_color, SUM(t.amount) AS total
            FROM transactions t
            JOIN categories c ON t.category_id = c.id
            WHERE t.user_id = $1
            AND t.type = 'expense'
            AND t.transaction_date >= DATE_TRUNC('month', CURRENT_DATE)
            GROUP BY c.id
            ORDER BY total DESC`,
            [req.userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get Category Breakdown Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMonthlyTrends = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
              to_char(DATE_TRUNC('month', transaction_date), 'YYYY-MM') AS month,
              type,
              SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
              SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
            FROM transactions
            WHERE user_id = $1
                AND transaction_date >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '5 months'
            GROUP BY 1
            ORDER BY 1`,
            [req.userId]
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Get Monthly Trends Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
