require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const pool    = require('./db');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'Pokédex API funcionando' });
});

app.use('/api/auth',     require('./routes/auth'));
app.use('/api/pokemons', require('./routes/pokemons'));
app.use('/api/tipos',    require('./routes/tipos'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
  });
});

app.listen(PORT, () => {
  console.log(` API escuchando en http://localhost:${PORT}`);
});