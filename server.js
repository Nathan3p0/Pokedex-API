require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const POKEDEX = require('./pokedex.json');

const app = express();

app.use(helmet());
app.use(cors());
app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization');
    const apiToken = process.env.API_TOKEN;

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
})

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';
app.use(morgan(morganSetting));

app.use((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        response = { error }
    }
    res.status(500).json(response);
})

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

const PORT = process.env.PORT || 8000;

app.listen(PORT);