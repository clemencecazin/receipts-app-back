require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const formidable = require("express-formidable");

const app = express();

app.use(formidable());

const userRoutes = require("./routes/user");
const receiptsRoutes = require("./routes/receipts");

app.use(userRoutes);
app.use(receiptsRoutes);

mongoose.connect("mongodb://localhost:27017/recettes", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
});

app.get("/", (req, res) => {
    res.json("API recettes");
});

app.all("*", (req, res) => {
    res.status(404).json({ message: "Cette route n'existe pas" });
});

app.listen(process.env.PORT, () => {
    console.log("Server started");
});
