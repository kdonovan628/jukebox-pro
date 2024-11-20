require("dotenv").config();
const express = require('express');
const app = express();
const PORT = 3000;
const bodyParser = require('body-parser');
const usersRouter = require('./api/users');
const playlistsRouter = require('./api/playlists');
const tracksRouter = require('./api/tracks');

app.use(require("morgan")("dev"));
app.use(express.json());

app.use(bodyParser.json());

app.use(require("./api/auth").router);
app.use('/api/users', usersRouter);
app.use('/api/playlists', playlistsRouter);
app.use('/api/tracks', tracksRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'An error occurred', details: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});