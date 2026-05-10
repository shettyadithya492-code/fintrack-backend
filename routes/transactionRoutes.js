const express = require("express");
const router = express.Router();

const { addIncome, addExpense, getSummary, getTransactions, deleteTransaction, updateTransaction } = require("../controllers/transactionController");

router.post("/add-income", addIncome);
router.post("/add-expense", addExpense);
router.get("/summary", getSummary);
router.get("/all", getTransactions);
router.put("/update/:id", updateTransaction);
router.delete("/delete/:id", deleteTransaction);

module.exports = router;