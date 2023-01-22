const express = require("express");
const router = express.Router();

const Recipe = require("../models/Recipe");
const isAuthenticated = require("../middlewares/isAuthenticated");

router.post("/addRecipe", isAuthenticated, async (req, res) => {
    try {
        if (
            req.fields.title &&
            req.fields.amount &&
            req.fields.ingredients &&
            req.fields.steps.length
        ) {
            const newRecipe = new Recipe({
                title: req.fields.title,
                ingredientsList: [
                    {
                        amount: req.fields.amount,
                        ingredients: req.fields.ingredients,
                    },
                ],
                preparation: {
                    steps: [req.fields.steps],
                },
            });
            await newRecipe.save();

            res.status(200).json({
                title: newRecipe.title,
                ingredientsList: newRecipe.ingredientsList,
                preparation: newRecipe.preparation,
            });
        } else {
            res.status(400).json({ message: "Missing parameters" });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put("/updateRecipe", isAuthenticated, async (req, res) => {
    const recipeToModify = await Recipe.findById(req.params.id);

    try {
        if (req.fiels.title) {
            recipeToModify.title = req.fields.title;
        }

        const ingredients = recipeToModify.ingredientsList;
        for (i = 0; i < ingredients.length; i++) {
            if (ingredients[i].amount) {
                if (req.fields.amount) {
                    ingredients[i].amount = req.fields.amount;
                }
            }
            if (ingredients[i].ingredients) {
                if (req.fields.ingredients) {
                    ingredients[i].ingredients = req.fields.ingredients;
                }
            }
        }

        const preparation = recipeToModify.preparation;
        for (i = 0; i < preparation.steps.length; i++) {
            if (preparation.steps[i]) {
                if (req.fields.steps[i]) {
                    preparation.steps[i] = req.fields.steps[i];
                }
            }
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.delete("/deleteReceipe", isAuthenticated, async (res, req) => {
    try {
        const recipeToDelete = await Recipe.findByIdAndDelete(req.params.id);

        res.status(200).json("Recipe delete succesfully !");
    } catch (error) {
        res.status(400).jsoon({ error: error.message });
    }
});

router.get("/receipts", async (req, res) => {
    try {
        const allReceipts = await Recipe.find();

        res.json(allReceipts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
