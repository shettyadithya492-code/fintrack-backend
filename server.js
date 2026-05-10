const express = require("express");

const cors = require("cors");

const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ==============================
// DATABASE
// ==============================

const connectDB =
    require("./config/db");

// ==============================
// ROUTES
// ==============================

const authRoutes =
    require("./routes/authRoutes");

const transactionRoutes =
    require("./routes/transactionRoutes");

// ==============================
// CONNECT DATABASE
// ==============================

connectDB();

// ==============================
// MIDDLEWARE
// ==============================

app.use(cors());

app.use(express.json());

// ==============================
// HOME ROUTE
// ==============================

app.get("/", (req, res) => {

    res.send(
        "FinTrack API Running..."
    );
});

// ==============================
// API ROUTES
// ==============================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/transactions",
    transactionRoutes
);

// ==============================
// SERVER
// ==============================

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );
});