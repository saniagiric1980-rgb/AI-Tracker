import pool from "../db.js";

export const getTransactions = async (req, res) => {
  const {
    startDate,
    endDate,
    categoryid,
    type,
    search,
    limit = 50,
    offset = 0,
  } = req.query;

  const conditions = ["t.user_id = $1"];
  const values = [req.userId];
  let idx = 2;

  if (startDate) {
    conditions.push(`t.transaction_date >= $${idx++}`);
    values.push(startDate);
  }
  if (endDate) {
    conditions.push(`t.transaction_date <= $${idx++}`);
    values.push(endDate);
  }
  if (categoryid) {
    conditions.push(`t.category_id = $${idx++}`);
    values.push(categoryid);
  }
  if (type) {
    conditions.push(`c.type = $${idx++}`);
    values.push(type);
  }
  if (search) {
    conditions.push(`(t.description ILIKE $${idx} OR c.name ILIKE $${idx})`);
    values.push(`%${search}%`);
    idx++;
  }

  values.push(limit, offset);

  try {
    const result = await pool.query(
      `SELECT t.*,  c.name AS category_name, c.type AS category_type, c.icon AS category_icon
             FROM transactions t
           LEFT JOIN categories c ON t.category_id = c.id
             WHERE ${conditions.join(" AND ")}
             ORDER BY t.transaction_date DESC, t.id DESC
                LIMIT $${idx++} OFFSET $${idx++}`,
      values,
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Get Transactions Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createTransaction = async (req, res) => {
  const { amount, notes, category_id, type, transactionDate, description } =
    req.body;

  if (!amount || !type || !transactionDate) {
    return res
      .status(400)
      .json({ message: "Amount, type, and transaction date are required" });
  }
  if (!["income", "expense"].includes(type)) {
    return res
      .status(400)
      .json({ message: 'Type must be either "income" or "expense"' });
  }

  try {
    const result = await pool.query(
      "INSERT INTO transactions (amount, notes, category_id, user_id, type, transaction_date, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [
        req.userId,
        category_id || null,
        amount,
        type,
        description || null,
        notes || null,
        transactionDate,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Transaction Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT t.*,  c.name AS category_name, c.type AS category_color, c.icon AS category_icon
             FROM transactions t
             LEFT JOIN categories c ON t.category_id = c.id
             WHERE t.id = $1 AND t.user_id = $2`,
      [id, req.userId],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("GetTransactionById Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, notes, category_id, type, transactionDate, description } =
    req.body;

  try {
    const result = await pool.query(
      `UPDATE transactions SET category_id = COALESCE($1, category_id), amount = COALESCE($2, amount), type = COALESCE($3, type), description = COALESCE($4, description), notes = COALESCE($5, notes), transaction_date = COALESCE($6, transaction_date)
             WHERE id = $7 AND user_id = $8 RETURNING *`,
      [
        category_id,
        amount,
        type,
        description,
        notes,
        transactionDate,
        id,
        req.userId,
      ],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Update Transaction Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, req.userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Delete Transaction Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

