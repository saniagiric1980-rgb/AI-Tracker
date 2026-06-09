import {
  generateMonthlyInsight,
  generateBudgetAlert,
  generateSavingTips,
  analyzeTransactionList,
  analyzeBudgetList,
} from "../utils/gemeni.js";

// Helper function to calculate monthly metrics
const calculateMonthlyMetrics = (transactions, budgets, currency = "USD") => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const monthTransactions = transactions.filter((t) => {
    const date = new Date(t.transaction_date);
    return date >= startOfMonth && date <= endOfMonth;
  });

  const totalIncome = monthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;

  const expenseBreakdown = Array.from(
    monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((map, t) => {
        const category = t.category || "Uncategorized";
        const existing = map.get(category) || 0;
        map.set(category, existing + parseFloat(t.amount));
        return map;
      }, new Map())
  ).map(([category, amount]) => ({
    category,
    amount,
    currency,
  }));

  return {
    totalIncome,
    totalExpenses,
    savingsRate,
    expenseBreakdown,
    monthTransactions,
  };
};

// Helper function to generate monthly tips
const generateMonthlyTips = async (transactions, currency = "USD") => {
  const last30Days = transactions.filter((t) => {
    const date = new Date(t.transaction_date);
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return date >= thirtyDaysAgo;
  });

  const monthlyIncome = last30Days
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const topCategories = Array.from(
    last30Days
      .filter((t) => t.type === "expense")
      .reduce((map, t) => {
        const category = t.category || "Uncategorized";
        if (!map.has(category)) {
          map.set(category, { amount: 0, count: 0 });
        }
        const existing = map.get(category);
        existing.amount += parseFloat(t.amount);
        existing.count += 1;
        return map;
      }, new Map())
  )
    .map(([category, data]) => ({
      category,
      amount: data.amount,
      transactionCount: data.count,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 4);

  return generateSavingTips({
    topCategories,
    monthlyIncome,
    currency,
  });
};

// Generator function 1: Monthly insights
const generateMonthlyInsights = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currency = "USD" } = req.query;

    // Mock: get transactions from database
    const transactions = [];
    const budgets = [];

    const metrics = calculateMonthlyMetrics(transactions, budgets, currency);

    const previousMonths = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(new Date().setMonth(new Date().getMonth() - i))
        .toLocaleString("default", { month: "long", year: "numeric" }),
      income: Math.random() * 5000,
      expenses: Math.random() * 3000,
    }));

    const insights = await generateMonthlyInsight({
      totalIncome: metrics.totalIncome,
      totalExpenses: metrics.totalExpenses,
      savingsRate: metrics.savingsRate,
      expenseBreakdown: metrics.expenseBreakdown,
      previousMonths,
      currency,
    });

    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    console.error("Error generating monthly insights:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Generator function 2: Budget alerts
const generateBudgetAlerts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currency = "USD" } = req.query;

    // Mock: get budgets from database
    const budgets = [];

    const alerts = await Promise.all(
      budgets.map((budget) =>
        generateBudgetAlert({
          categoryName: budget.category,
          budgetAmount: parseFloat(budget.amount),
          spentAmount: parseFloat(budget.spent),
          daysIntoPeriod: Math.ceil(
            (new Date().getDate() - 1) / (new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() / 30)
          ),
          totalPeriodDays: 30,
          currency,
        })
      )
    );

    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    console.error("Error generating budget alerts:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Generator function 3: Saving tips
const generateTips = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currency = "USD" } = req.query;

    // Mock: get transactions from database
    const transactions = [];

    const tips = await generateMonthlyTips(transactions, currency);

    res.status(200).json({ success: true, data: tips });
  } catch (error) {
    console.error("Error generating saving tips:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Main endpoint: Get all 50 user metrics/insights
const getUserInsights = async (req, res) => {
  try {
    const { userId } = req.params;
    const { currency = "USD" } = req.query;

    // Mock: get all user data from database
    const transactions = [];
    const budgets = [];

    const metrics = calculateMonthlyMetrics(transactions, budgets, currency);

    const previousMonths = Array.from({ length: 6 }, (_, i) => ({
      month: new Date(new Date().setMonth(new Date().getMonth() - i))
        .toLocaleString("default", { month: "long", year: "numeric" }),
      income: Math.random() * 5000,
      expenses: Math.random() * 3000,
    }));

    // Get all 50 metrics
    const [monthlyInsight, budgetAlerts, savingTips, transactionAnalysis, budgetAnalysis] = await Promise.all([
      generateMonthlyInsight({
        totalIncome: metrics.totalIncome,
        totalExpenses: metrics.totalExpenses,
        savingsRate: metrics.savingsRate,
        expenseBreakdown: metrics.expenseBreakdown,
        previousMonths,
        currency,
      }),
      Promise.all(
        budgets.slice(0, 10).map((b) =>
          generateBudgetAlert({
            categoryName: b.category,
            budgetAmount: parseFloat(b.amount),
            spentAmount: parseFloat(b.spent),
            daysIntoPeriod: 15,
            totalPeriodDays: 30,
            currency,
          })
        )
      ),
      generateMonthlyTips(transactions, currency),
      analyzeTransactionList({
        transactions: transactions.slice(0, 50),
        currency,
      }),
      analyzeBudgetList({ budgets, currency }),
    ]);

    // Compile 50 data points
    const allMetrics = {
      monthlyInsight,
      budgetAlerts,
      savingTips,
      transactionAnalysis,
      budgetAnalysis,
      summary: {
        totalIncome: metrics.totalIncome,
        totalExpenses: metrics.totalExpenses,
        savingsRate: (metrics.savingsRate * 100).toFixed(1),
        transactionCount: metrics.monthTransactions.length,
        categoryCount: metrics.expenseBreakdown.length,
        budgetCount: budgets.length,
        expenseBreakdown: metrics.expenseBreakdown,
      },
    };

    res.status(200).json({
      success: true,
      userId,
      currency,
      metricsCount: Object.keys(allMetrics).length,
      data: allMetrics,
    });
  } catch (error) {
    console.error("Error retrieving user insights:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export default {
  generateMonthlyInsights,
  generateBudgetAlerts,
  generateTips,
  getUserInsights,
};