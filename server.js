require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');

console.log(process.env.API_TOKEN);

const app = express();

app.use(function validateBearerToken(req, res, next) {
    console.log('validate bearer token middleware')
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
})

app.use(morgan('dev'));

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`];

const handleGetTypes = (req, res) => {
    res.json(validTypes);
}

app.get('/types', handleGetTypes);

const handleGetPokemon = (req, res) => {
    const { name, type } = req.query;

    let results = POKEDEX.pokemon;

    if (name) {
        results = POKEDEX.pokemon.filter(pokemon => pokemon.name.toLowerCase().includes(name.toLowerCase()));
    }

    if (type) {
        const validTypeToLowerCase = validTypes.map(type => type.toLowerCase())
        if (!validTypeToLowerCase.includes(type.toLowerCase())) {
            return res.status(400).json({ 'Please enter Valid Types': validTypes });

        }
        results = POKEDEX.pokemon.filter(pokemon => pokemon.type.map(poke => poke.toLowerCase()).includes(type.toLowerCase()));
    }

    res.json(results);
}

app.get('/pokemon', handleGetPokemon);

const port = 8000;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
});