const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Pokebuilder = require('../models/pokebuilder.js');

const router = express.Router();



router.get('/search/:pokename', async (req, res) => {
    console.log(req.params.pokename)
    try {

        // const response = await fetch(`https://pokeapi.co/api/v2/pokemon/pikachu/`);
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${req.params.pokename}`);
        const pokemon = await response.json();
       res.status(200).json(pokemon)
    } catch (error) {
      res.status(500).json(error);
    }
});

module.exports = router;