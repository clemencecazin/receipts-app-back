const express = require("express");
const router = express.Router();

const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");
const uid2 = require("uid2");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.fields.email });
        console.log(req);
        if (!user) {
            // If user doesn't exist
            if (
                req.fields.email &&
                req.fields.username &&
                req.fields.password
            ) {
                // Creation
                // Step 1 : crypt password
                const salt = uid2(64);
                const hash = SHA256(req.fields.password + salt).toString(
                    encBase64
                );
                const token = uid2(64);
                // Step 2 : create new user
                const newUser = new User({
                    email: req.fields.email,
                    account: {
                        username: req.fields.username,
                        phone: req.fields.phone,
                    },
                    token: token,
                    hash: hash,
                    salt: salt,
                });
                // Step 3 : save user
                await newUser.save();
                // Step 4 : response client
                res.status(200).json({
                    _id: newUser._id,
                    token: newUser.token,
                    account: {
                        username: newUser.account.username,
                    },
                });
            } else {
                res.status(400).json({ message: "Missing parameters" });
            }
        } else {
            // If user exist error message
            res.status(400).json({
                message: "This email already has an account",
            });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.post("/user/login", async (req, res) => {
    try {
        const loginUser = await User.findOne({ email: req.fields.email });

        // If user is known thanks to his email
        if (loginUser) {
            console.log("Hash BDD", loginUser.hash);

            // Generate password thanks to the user salt of the DB and the password he send

            const newHash = SHA256(
                req.fields.password + loginUser.salt
            ).toString(encBase64);

            // Check Hash : Verified if the newHash equuals the one in the DB

            if (newHash === loginUser.hash) {
                res.status(200).json({
                    _id: loginUser._id,
                    token: loginUser.token,
                    account: {
                        username: loginUser.account.username,
                    },
                });
            } else {
                res.status(401).json({
                    message: "Unauthorized",
                }); // If the password is not OK
            }
        } else {
            res.status(401).json({
                message: "Unauthorized",
            }); // if the username is not OK
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
