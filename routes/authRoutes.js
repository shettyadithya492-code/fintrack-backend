const express =
    require("express");

const router =
    express.Router();

const {

    register,
    login,
    deleteAccount

} = require(
    "../controllers/authController"
);

// REGISTER
router.post(
    "/register",
    register
);

// LOGIN
router.post(
    "/login",
    login
);

// DELETE ACCOUNT
router.delete(
    "/delete-account",
    deleteAccount
);

module.exports = router;