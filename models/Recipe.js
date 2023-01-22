const mongoose = require("mongoose");

const Recipe = mongoose.model("Recipe", {
    title: {
        unique: true,
        type: String,
        required: true,
    },
    ingredientsList: [
        {
            amount: String,
            ingredients: String,
        },
        { _id: false },
    ],
    preparation: {
        steps: {
            type: Array,
        },
    },
});

module.exports = Recipe;
