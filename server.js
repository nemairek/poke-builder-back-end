const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const testJWTRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const profilesRouter = require('./controllers/profiles');
const pokebuilderRouter = require('./controllers/pokebuilder');
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});
app.use(cors({
    origin: ["https://poke-builder.netlify.app"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
    origin: true,
  }));
app.use(express.json());
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')));

app.use('/test-jwt', testJWTRouter);
app.use('/users', usersRouter);
app.use('/profiles', profilesRouter);
app.use('/pokemon', pokebuilderRouter)

app.listen(3000, () => {
    console.log('The express app is ready!');
});