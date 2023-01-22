const User = require("../models/User");

const isAuhenticated = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.replace("Bearer ", "");
            const user = await User.findOne({ token: token });

            if (user) {
                // Rajouter une clé user à l'objet req

                req.user = user;
                // Sortir du middleware pour passer à la suite
                return next();
            } else {
                return res.status(401).json({ message: "Unauthorized" });
            }
        } else {
            return res.status(401).json({ message: "Unauthorized" });
        }
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

module.exports = isAuhenticated;
