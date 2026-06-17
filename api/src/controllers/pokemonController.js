const pool = require('../db');

const getAll = async (req, res, next) => {
  try {
    const { nombre, tipo_id } = req.query;
    let query = `
      SELECT p.*, t.nombre AS tipo, t2.nombre AS tipo2
      FROM pokemons p
      LEFT JOIN tipos t  ON p.tipo_id  = t.id
      LEFT JOIN tipos t2 ON p.tipo2_id = t2.id
      WHERE p.user_id = ?
    `;
    const params = [req.user.id];

    if (nombre) {
      query += ' AND p.nombre LIKE ?';
      params.push(`%${nombre}%`);
    }
    if (tipo_id) {
      query += ' AND p.tipo_id = ?';
      params.push(tipo_id);
    }

  query += ' ORDER BY p.numero_pokedex ASC';
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

const getOne = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.*, t.nombre AS tipo, t2.nombre AS tipo2
       FROM pokemons p
       LEFT JOIN tipos t  ON p.tipo_id  = t.id
       LEFT JOIN tipos t2 ON p.tipo2_id = t2.id
       WHERE p.id = ? AND p.user_id = ?`,
      [req.params.id, req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Pokémon no encontrado' });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

const create = async (req, res, next) => {
  try {
    const { nombre, numero_pokedex, tipo_id, tipo2_id, nivel = 1,
            ps, ataque, defensa, velocidad, imagen_url, descripcion,
            es_shiny, capturado_en, es_favorito, notas } = req.body;

    if (!nombre)
      return res.status(400).json({ error: 'El nombre es obligatorio' });

    if (nivel < 1 || nivel > 100)
      return res.status(422).json({ error: 'El nivel debe estar entre 1 y 100' });

    const [dup] = await pool.query(
      'SELECT id FROM pokemons WHERE user_id = ? AND nombre = ? AND numero_pokedex = ?',
      [req.user.id, nombre, numero_pokedex || null]
    );
    if (dup.length > 0)
      return res.status(409).json({ error: 'Ya tienes ese Pokémon registrado con ese nombre' });

    const [result] = await pool.query(
      `INSERT INTO pokemons 
        (user_id, nombre, numero_pokedex, tipo_id, tipo2_id, nivel, ps, ataque, defensa, velocidad, imagen_url, descripcion, es_shiny, capturado_en, es_favorito, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        nombre,
        numero_pokedex || null,
        tipo_id || null,
        tipo2_id || null,
        nivel,
        ps || null,
        ataque || null,
        defensa || null,
        velocidad || null,
        imagen_url || null,
        descripcion || null,
        es_shiny || false,
        capturado_en || null,
        es_favorito || false,
        notas || null
      ]
    );

    res.status(201).json({ mensaje: 'Pokémon creado', id: result.insertId });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const { nombre, numero_pokedex, tipo_id, tipo2_id, nivel,
            ps, ataque, defensa, velocidad, imagen_url, descripcion,
            es_shiny, capturado_en, es_favorito, notas } = req.body;

    if (nivel && (nivel < 1 || nivel > 100))
      return res.status(422).json({ error: 'El nivel debe estar entre 1 y 100' });

    const [rows] = await pool.query(
      'SELECT id FROM pokemons WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Pokémon no encontrado' });

    await pool.query(
      `UPDATE pokemons SET
        nombre = ?, numero_pokedex = ?, tipo_id = ?, tipo2_id = ?, nivel = ?,
        ps = ?, ataque = ?, defensa = ?, velocidad = ?, imagen_url = ?,
        descripcion = ?, es_shiny = ?, capturado_en = ?, es_favorito = ?, notas = ?
       WHERE id = ? AND user_id = ?`,
      [
        nombre,
        numero_pokedex || null,
        tipo_id || null,
        tipo2_id || null,
        nivel,
        ps || null,
        ataque || null,
        defensa || null,
        velocidad || null,
        imagen_url || null,
        descripcion || null,
        es_shiny || false,
        capturado_en || null,
        es_favorito || false,
        notas || null,
        req.params.id,
        req.user.id
      ]
    );

    res.json({ mensaje: 'Pokémon actualizado' });
  } catch (err) {
    next(err);
  }
};

const remove = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id FROM pokemons WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (rows.length === 0)
      return res.status(404).json({ error: 'Pokémon no encontrado' });

    await pool.query('DELETE FROM pokemons WHERE id = ?', [req.params.id]);
    res.json({ mensaje: 'Pokémon eliminado' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getOne, create, update, remove };