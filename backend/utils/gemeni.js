import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

if (!process.env.GOOGLE_GENAI_API_KEY) {
  console.warn(
    "Warning: GOOGLE_GENAI_API_KEY is not set. Gemini AI features will not work.",
  );
}

const stripMarkdown = (text) => {
  let cleaned = text.trim();
  if (cleaned.startsWith("- ")) {
    cleaned = cleaned.replace(/```json\n?/, "").replace(/```\n?/, "");
  } else if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/```json\n?/, "").replace(/```\n?/, "");
  }
  return cleaned.trim();
};

export const generateMonthlyInsight = async ({
  totalIncome,
  totalExpenses,
  savingsRate,
  expenseBreakdown,
  previousMonths,
  currency = "USD",
}) => {
  const breakdownText =
    expenseBreakdown.length > 0
      ? expenseBreakdown
          .map((c) => `- ${c.category}: ${c.currency} ${c.amount.toFixed(2)}`)
          .join("\n")
      : "No expenses recorded.";

  const trendText =
    previousMonths.length > 0
      ? previousMonths
          .map(
            (m) =>
              `- ${m.month}: Income  ${currency} ${m.income.toFixed(2)}, Expenses: ${currency} ${m.expenses.toFixed(2)}`,
          )
          .join("\n")
      : "No previous month data available.";

  const promt = `Analyze this user's financial data  and generate actionable insights.

Currency: ${currency}
Total Income: ${currency} ${totalIncome.toFixed(2)}
Total Expenses: ${currency} ${totalExpenses.toFixed(2)}
Savings Rate: ${(savingsRate * 100).toFixed(1)}%

Expense Breakdown by category (this month)
${breakdownText}:

Previous months trend:
${trendText}

Return ONLY valid JSON (no markdown, no text, no code blocks) in this exact structure:
{
    "summary": "2-3 sentences summarizing the user's financial health and habits",
    "actionable_insights": [ "string", "specific actions the user can take to improve their financial health" ],
    "positive_trends": [ "string", "any positive trends or habits the user has shown" ],
    "areas_for_improvement": [ "string", "specific areas where the user can improve their financial habits" ]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promt,
    });
    const cleanded = stripMarkdown(response.text);
    return JSON.parse(cleanded);
  } catch (error) {
    console.error("Error generating insights with Gemini AI:", error);
    throw new Error("Failed to generate insights. Please try again later.");
  }
};

export const generateBudgetAlert = async ({
  categoryName,
  budgetAmount,
  spentAmount,
  daysIntoPeriod,
  totalPeriodDays,
  currency = "USD",
}) => {
  const percentUsed = ((spentAmount / budgetAmount) * 100).toFixed(1);
  const daysLeft = totalPeriodDays - daysIntoPeriod;

  const promt = `A user is tracking a budget. Generate a helpful alert.
 
Category: ${categoryName}
Budget: ${currency} ${budgetAmount.toFixed(2)}
Spent so far: ${currency} ${spentAmount.toFixed(2)} (${percentUsed}% used)
Days into period: ${daysIntoPeriod} of ${totalPeriodDays} ( ${daysLeft} days remaining)

Return ONLY valid JSON (no markdown):
{
    "severity": "info" | "warning" | "critical",
    "title": "Short alert title",
    "message": "1-2 sentences empathetic message referencing actual numbers",
    "seggestions": [ "Specific actions 1", "Specific action 2" , "Specific action 3" ]
}

Severity guide:
- Info: under 70% spent
- Warning: 70-100% 
- Critical: over 100% spent`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promt,
    });
    const cleanded = stripMarkdown(response.text);
    return JSON.parse(cleanded);
  } catch (error) {
    console.error("Gemmini API error(budget alert):", error);
    throw new Error("Failed to generate budget alert. Please try again later.");
  }
};

export const generateSavingTips = async ({
  topCategories,
  monthlyIncome,
  currency = "USD",
}) => {
  const categoriesText =
    topCategories.length > 0
      ? topCategories
          .map(
            (c) =>
              `- ${c.category}: ${currency} ${c.amount.toFixed(2)} across ${c.transactionCount} transactions`,
          )
          .join("\n")
      : "No expense categories available.";

  const promt = `Generate personalized saving tips for a user.

Monthly Income (last 30 days): ${currency} ${monthlyIncome.toFixed(2)}
Top Expense Categories (last 30 days):
${categoriesText}

Return ONLY valid JSON (no markdown):
{
    "overallTip": "Top-level 1-sentence advice",
    "tips": [
    {
        "category": "Category this targets",
        "title": "Short tip title",
        "detail": "2-3 sentences actionable suggestion",
        "estimatedSavings": number
    }
    ]
} 
    Provide exatly 4 tips.  Each tip should reference an actual category from the data and include a realistic monthly savings estimate based on the user's spending in that category.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promt,
    });
    const cleanded = stripMarkdown(response.text);
    return JSON.parse(cleanded);
  } catch (error) {
    console.error("Gemmini API error(saving tips):", error);
    throw new Error("Failed to generate saving tips. Please try again later.");
  }
};
export const analyzeTransactionList = async ({
  transactions,
  currency = "USD",
}) => {
  const formatDeate = (date) => {
    if (!date) return "";
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    return String(date).split("T")[0]; // Fallback for string dates
  };

  const lines = transactions
    .slice(0, 50) // Limit to first 50 transactions for prompt
    .map((t) => {
      const date = formatDeate(t.transaction_date);
      const amt = parseFloat(t.amount).toFixed(2);
      const cat = t.category || "Uncategorized";
      const desc = t.description ? `| ${t.description}` : "";
      return `- ${date}: ${t.type} ${currency} ${amt} | ${cat} ${desc}`;
    })
    .join("\n");

  const promt = `Analyze these ${transactions.length} transactions and provide concise, helpful spending insights. Focus on patterns, anomalies, and actionable advice.
Transactions:
${lines}

Return ONLY valid JSON (no markdown):
{
    "insight": "2-4 sentences analyzing with specific references to the data",
    "highlight": "Single most important insight or anomaly, referencing specific transactions or patterns"
}`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promt,
    });
    const cleanded = stripMarkdown(response.text);
    return JSON.parse(cleanded);
  } catch (error) {
    console.error("Gemmini API error(transaction analysis):", error);
    throw new Error("Failed to analyze transactions. Please try again later.");
  }
};

export const analyzeBudgetList = async ({ budgets, currency = "USD" }) => {
    const lines = budgets.map((b) => {
        const spent = parseFloat(b.spent);
        const total = parseFloat(b.amount);
        const pct = ((spent / total) * 100).toFixed(1);
        return `- ${b.category}: ${currency} ${spent.toFixed(2)} / ${currency} ${total.toFixed(2)} (${pct}%)`;
    }).join("\n");

    const promt = `Analyze these budgets and provide a concise overview. Identify which categories are on track, overspent, or have room to spare.
Budgets:
${lines}

Return ONLY valid JSON (no markdown):
{
    "summary": "2-3 sentences overview of budget health",
    "onTrack": [ "Categories performing well" ],
    "atRisk": [ "Categories at 70-100% of budget" ],
    "overspent": [ "Categories over 100% of budget" ],
    "recommendations": [ "Actionable advice to improve budget management" ]
}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: promt,
        });
        const cleanded = stripMarkdown(response.text);
        return JSON.parse(cleanded);
    } catch (error) {
        console.error("Gemini API error(budget analysis):", error);
        throw new Error("Failed to analyze budgets. Please try again later.");
    }
};

export default {
    generateMonthlyInsight,
    generateBudgetAlert,
    generateSavingTips,
    analyzeTransactionList,
    analyzeBudgetList,
};