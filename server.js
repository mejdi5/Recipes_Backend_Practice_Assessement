const express = require('express')
const app = express()
const recipes = require('./data.json').recipes

app.use(express.json())

const port = process.env.PORT || 3000
app.listen(port, err => err ? console.log(err) : console.log(`server is running on port ${port}`))


//Build a GET route that returns all recipe names
app.get('/recipes', (req, res) => {
    try {
        const recipeNames = recipes.map(recipe => recipe.name)
        res.status(200).json({recipeNames})
    } catch (error) {
        console.log(error)
    }
})

//Build a GET route that takes a recipe name as a string param. Return the ingredients and the number of steps in the recipe as JSON
app.get('/recipes/details/:name', (req, res) => {
    try {
    const {name} = req.params
    const element = recipes.find(recipe => recipe.name == name)
    if (element) {
        const details = {
            ingredients: element.ingredients,
            numSteps: element.ingredients.length
        }
        res.status(200).json({details})
    } else {
        res.status(200).json({})
    }
    } catch (error) {
        console.log(error)
    }
})

//Add a POST route that can add additional recipes in the existing format to the backend with support for the above routes.
app.post('recipes', (req, res) => {
    try {
        const newRecipe = {
            name: req.body.name, 
            ingredients: req.body.ingredients, 
            instructions: req.body.instructions
        }
        const element = recipes.find(recipe => recipe.name == newRecipe.name)
        if (element) {
            res.status(400).json({"error": "Recipe already exists"})
        } else {
            recipes.push(newRecipe)
            res.status(201)
        }
    } catch (error) {
        console.log(error)
    }
})

//Add a PUT route that can update existing recipes.
app.put('recipes/:name', (req, res) => {
    try {
        const editedRecipe = {
            name: req.body.name, 
            ingredients: req.body.ingredients, 
            instructions: req.body.instructions
        }
        const { name } = req.params
        const element = recipes.find(recipe => recipe.name == name)
        if(element) {
            recipes = {...recipes, element: editedRecipe}
            res.status(204)
        } else {
            res.status(404).json({"error": "Recipe does not exist"})
        }
    } catch (error) {
        console.log(error)
    }
})