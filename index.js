require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");

const formidable = require("express-formidable");

const app = express();

app.use(formidable());
app.use(cors());

const userRoutes = require("./routes/user");
const receiptsRoutes = require("./routes/receipts");

app.use(userRoutes);
app.use(receiptsRoutes);

mongoose.connect("mongodb://127.0.0.1/recettes", {
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
