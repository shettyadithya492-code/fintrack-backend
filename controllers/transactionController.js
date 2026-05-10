const Transaction =
    require("../models/Transaction");

const User =
    require("../models/User");

// ==========================
// ADD INCOME
// ==========================
exports.addIncome = async (req, res) => {

    const {
        phone,
        amount,
        category,
        note,
        date,
        mode
    } = req.body;

    try {

        if (
            !phone ||
            !amount ||
            !category ||
            !mode
        ) {

            return res.status(400).json({
                message:
                    "Required fields missing"
            });
        }

        // Find User
        const user =
            await User.findOne({ phone });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        // Create Transaction
        const transaction =
            new Transaction({

                userId: user._id,

                type: "income",

                amount: Number(amount),

                category,

                note: note || "",

                date:
                    date
                        ? new Date(date)
                        : new Date(),

                mode:
                    mode || "Cash"
            });

        await transaction.save();

        res.status(201).json({

            message:
                "Income added successfully",

            transaction
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================
// ADD EXPENSE
// ==========================
exports.addExpense = async (req, res) => {

    const {
        phone,
        amount,
        category,
        note,
        date,
        mode
    } = req.body;

    try {

        if (
            !phone ||
            !amount ||
            !category ||
            !mode
        ) {

            return res.status(400).json({
                message:
                    "Required fields missing"
            });
        }

        // Find User
        const user =
            await User.findOne({ phone });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        // Create Transaction
        const transaction =
            new Transaction({

                userId: user._id,

                type: "expense",

                amount: Number(amount),

                category,

                note: note || "",

                date:
                    date
                        ? new Date(date)
                        : new Date(),

                mode:
                    mode || "Cash"
            });

        await transaction.save();

        res.status(201).json({

            message:
                "Expense added successfully",

            transaction
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================
// GET SUMMARY
// ==========================
exports.getSummary = async (req, res) => {

    const { phone } = req.query;

    try {

        // Find User
        const user =
            await User.findOne({ phone });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        const transactions =
            await Transaction.find({
                userId: user._id
            });

        let income = 0;
        let expense = 0;

        transactions.forEach(t => {

            if (t.type === "income") {

                income += Number(t.amount);

            } else {

                expense += Number(t.amount);
            }
        });

        const balance =
            income - expense;

        res.status(200).json({

            income,
            expense,
            balance
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================
// GET ALL TRANSACTIONS
// ==========================
exports.getTransactions = async (req, res) => {

    const { phone } = req.query;

    try {

        // Find User
        const user =
            await User.findOne({ phone });

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });
        }

        const transactions =
            await Transaction.find({
                userId: user._id
            }).sort({ date: -1 });

        res.status(200).json(
            transactions
        );

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================
// UPDATE TRANSACTION
// ==========================
exports.updateTransaction = async (req, res) => {

    const { id } = req.params;

    const {
        amount,
        category,
        mode,
        note
    } = req.body;

    try {

        const updated =
            await Transaction.findByIdAndUpdate(

                id,

                {
                    amount,
                    category,
                    mode,
                    note
                },

                { new: true }
            );

        if (!updated) {

            return res.status(404).json({
                message:
                    "Transaction not found"
            });
        }

        res.status(200).json({

            message:
                "Transaction updated",

            transaction: updated
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

// ==========================
// DELETE TRANSACTION
// ==========================
exports.deleteTransaction = async (req, res) => {

    const { id } = req.params;

    try {

        const deleted =
            await Transaction.findByIdAndDelete(
                id
            );

        if (!deleted) {

            return res.status(404).json({
                message:
                    "Transaction not found"
            });
        }

        res.status(200).json({
            message:
                "Transaction deleted"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};