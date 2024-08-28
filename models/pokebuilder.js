const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
      text: {
        type: String,
        required: true
      },
      author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    },
    { timestamps: true }
  );


const pokebuilderSchema = new mongoose.Schema(
    {
        pokeId: {
            type: Number,
            required: true,
        },
      name: {
        type: String,
        required: true,
      },
      type: [{
        type: String,
        required: true,
      }],
      abilities: [{
        type: String,
        required: true,
      }],
      image: String, 
      ownedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
      }],
      comments: [commentSchema]
    },
    { timestamps: true }
  );



  
  const Pokebuilder = mongoose.model('Pokebuilder', pokebuilderSchema);

  module.exports = Pokebuilder;