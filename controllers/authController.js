const User = require("../models/User");

const bcrypt =
    require("bcryptjs");

// ==========================
// REGISTER
// ==========================
exports.register =
    async (req, res) => {

    try {

        const {

            name,
            phone,
            pin,
            confirmPin

        } = req.body;

        // VALIDATION
        if (
            !name ||
            !phone ||
            !pin ||
            !confirmPin
        ) {

            return res.status(400)
                .json({
                    message:
                        "All fields are required"
                });
        }

        // PHONE VALIDATION
        const phoneRegex =
            /^[6-9]\d{9}$/;

        if (
            !phoneRegex.test(phone)
        ) {

            return res.status(400)
                .json({
                    message:
                        "Invalid phone number"
                });
        }

        // PIN VALIDATION
        if (
            pin.length !== 4 ||
            isNaN(pin)
        ) {

            return res.status(400)
                .json({
                    message:
                        "PIN must be 4 digits"
                });
        }

        if (pin !== confirmPin) {

            return res.status(400)
                .json({
                    message:
                        "PIN values do not match"
                });
        }

        // CHECK USER
        const existingUser =
            await User.findOne({
                phone
            });

        if (existingUser) {

            return res.status(400)
                .json({
                    message:
                        "Phone number already registered"
                });
        }

        // HASH PIN
        const hashedPin =
            await bcrypt.hash(
                pin,
                10
            );

        // CREATE USER
        const user =
            await User.create({

                name,
                phone,

                pin: hashedPin
            });

        res.status(201)
            .json({

                message:
                    "Account created successfully",

                user: {

                    id: user._id,
                    name: user.name,
                    phone: user.phone
                }
            });

    } catch (error) {

        console.error(error);

        res.status(500)
            .json({
                message:
                    "Server Error"
            });
    }
};

// ==========================
// LOGIN
// ==========================
exports.login =
    async (req, res) => {

    try {

        const {
            phone,
            pin
        } = req.body;

        // CHECK FIELDS
        if (
            !phone ||
            !pin
        ) {

            return res.status(400)
                .json({
                    message:
                        "Phone and PIN required"
                });
        }

        // FIND USER
        const user =
            await User.findOne({
                phone
            });

        if (!user) {

            return res.status(400)
                .json({
                    message:
                        "User not found"
                });
        }

        // CHECK PIN
        const isMatch =
            await bcrypt.compare(
                pin,
                user.pin
            );

        if (!isMatch) {

            return res.status(400)
                .json({
                    message:
                        "Invalid PIN"
                });
        }

        res.status(200)
            .json({

                message:
                    "Login successful",

                user: {

                    id: user._id,
                    name: user.name,
                    phone: user.phone
                }
            });

    } catch (error) {

        console.error(error);

        res.status(500)
            .json({
                message:
                    "Server Error"
            });
    }
};

// ==========================
// DELETE ACCOUNT
// ==========================
exports.deleteAccount =
    async (req, res) => {

    try {

        const {
            phone,
            pin
        } = req.body;

        const user =
            await User.findOne({
                phone
            });

        if (!user) {

            return res.status(404)
                .json({
                    message:
                        "User not found"
                });
        }

        const isMatch =
            await bcrypt.compare(
                pin,
                user.pin
            );

        if (!isMatch) {

            return res.status(400)
                .json({
                    message:
                        "Invalid PIN"
                });
        }

        await User.findByIdAndDelete(
            user._id
        );

        res.status(200)
            .json({
                message:
                    "Account deleted"
            });

    } catch (error) {

        console.error(error);

        res.status(500)
            .json({
                message:
                    "Server Error"
            });
    }
};