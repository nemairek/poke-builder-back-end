const express = require('express');
const verifyToken = require('../middleware/verify-token.js');
const Pokebuilder = require('../models/pokebuilder.js');

const router = express.Router();

router.use(verifyToken)

router.get('/search/:pokename', async (req, res) => {
  try {

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${req.params.pokename}`);
    const pokemon = await response.json();
    res.status(200).json(pokemon)
  } catch (error) {
    res.status(500).json(error);
  }
});


router.get('/', async (req, res) => {
  let all = await Pokebuilder.find({ ownedBy: req.user._id }).populate('comments.author')
  res.json(all)
});


router.post('/', async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ error: 'No Pokemon data' });
  }
  let pokemon = await Pokebuilder.findOne({ pokeId: req.body.pokeId })
  if (pokemon) {
    if (pokemon.ownedBy.includes(req.user._id))
      return
    pokemon.ownedBy.push(req.user._id)
    await pokemon.save();

  } else {
    pokemon = new Pokebuilder(req.body);
    pokemon.ownedBy.push(req.user._id)
    await pokemon.save();
  };
  try {


    res.status(201).json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.delete('/:pokeId', async (req, res) => {
  try {
    let pokemon = await Pokebuilder.findById(req.params.pokeId);
    if (pokemon.ownedBy.includes(req.user._id)) {
      pokemon.ownedBy.remove(req.user._id)
      await pokemon.save()
      res.status(200).json(pokemon);
    }

  } catch (error) {
    res.status(500).json(error);
  }
});




router.post('/:pokeId/comments', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const poke = await Pokebuilder.findById(req.params.pokeId);
    poke.comments.push(req.body);
    await poke.save();
    res.status(201).json(poke);
  } catch (error) {
    res.status(500).json(error);
  }
});


router.put('/:pokeId/comments/:commentId', async (req, res) => {
  try {
    req.body.author = req.user._id;
    const poke = await Pokebuilder.findById(req.params.pokeId);
    const pokeComment = poke.comments.id(req.params.commentId);
    pokeComment.text = req.body.text;
    await poke.save();
    res.status(201).json(poke);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete('/:pokeId/comments/:commentId', async (req, res) => {
  try {
    const poke = await Pokebuilder.findById(req.params.pokeId);
    let comment = poke.comments.id(req.params.commentId)
    poke.comments.remove(comment);
    await poke.save();
    res.status(201).json(poke);
  } catch (error) {
    res.status(500).json(error);
  }
});





module.exports = router;