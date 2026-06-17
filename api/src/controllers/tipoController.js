const pool = require('../db');

// GET /api/tipos
const getAll = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tipos ORDER BY nombre');
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET /api/tipos/:id
const getOne = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM tipos WHERE id = ?', [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Tipo no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// POST /api/tipos
const create = async (req, res, next) => {
  try {
    const { nombre, color_hex } = req.body;

    if (!nombre)
      return res.status(400).json({ error: 'El nombre es obligatorio' });

    const [dup] = await pool.query(
      'SELECT id FROM tipos WHERE nombre = ?', [nombre]
    );
    if (dup.length > 0)
      return res.status(409).json({ error: 'El tipo ya existe' });

    const [result] = await pool.query(
      'INSERT INTO tipos (nombre, color_hex) VALUES (?, ?)',
      [nombre, color_hex]
    );

    res.status(201).json({ mensaje: 'Tipo creado', id: result.insertId });
  } catch (err) {
    next(err);
  }
};

// PUT /api/tipos/:id
const update = async (req, res, next) => {
  try {
    const { nombre, color_hex } = req.body;

    const [rows] = await pool.query(
      'SELECT id FROM tipos WHERE id = ?', [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Tipo no encontrado' });

    await pool.query(
      'UPDATE tipos SET nombre = ?, color_hex = ? WHERE id = ?',
      [nombre, color_hex, req.params.id]
    );

    res.json({ mensaje: 'Tipo actualizado' });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/tipos/:id
const remove = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM tipos WHERE id = ?', [req.params.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Tipo no encontrado' });

    await pool.query('DELETE FROM tipos WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Tipo eliminado' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };