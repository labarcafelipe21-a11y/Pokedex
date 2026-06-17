
CREATE DATABASE IF NOT EXISTS pokedex_db;
USE pokedex_db;

-- Tabla: users
CREATE TABLE IF NOT EXISTS users (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  email               VARCHAR(255) NOT NULL UNIQUE,
  password_hash       VARCHAR(255) NOT NULL,
  username            VARCHAR(100) NOT NULL,
  reset_token         VARCHAR(255),
  reset_token_expires DATETIME,
  created_at          DATETIME NOT NULL DEFAULT NOW(),
  updated_at          DATETIME NOT NULL DEFAULT NOW()
);

-- Tabla: tipos
CREATE TABLE IF NOT EXISTS tipos (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  nombre     VARCHAR(50) NOT NULL UNIQUE,
  color_hex  CHAR(7),
  created_at DATETIME NOT NULL DEFAULT NOW()
);

INSERT IGNORE INTO tipos (nombre, color_hex) VALUES
  ('Normal',    '#A8A878'),
  ('Fuego',     '#F08030'),
  ('Agua',      '#6890F0'),
  ('Planta',    '#78C850'),
  ('Eléctrico', '#F8D030'),
  ('Hielo',     '#98D8D8'),
  ('Lucha',     '#C03028'),
  ('Veneno',    '#A040A0'),
  ('Tierra',    '#E0C068'),
  ('Volador',   '#A890F0'),
  ('Psíquico',  '#F85888'),
  ('Bicho',     '#A8B820'),
  ('Roca',      '#B8A038'),
  ('Fantasma',  '#705898'),
  ('Dragón',    '#7038F8'),
  ('Siniestro', '#705848'),
  ('Acero',     '#B8B8D0'),
  ('Hada',      '#EE99AC');

-- Tabla: pokemons
CREATE TABLE IF NOT EXISTS pokemons (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  user_id        INT NOT NULL,
  numero_pokedex INT,
  nombre         VARCHAR(100) NOT NULL,
  tipo_id        INT,
  tipo2_id       INT,
  descripcion    TEXT,
  es_shiny       TINYINT(1) DEFAULT 0,
  capturado_en   DATE,
  created_at     DATETIME NOT NULL DEFAULT NOW(),
  updated_at     DATETIME NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (tipo_id)  REFERENCES tipos(id),
  FOREIGN KEY (tipo2_id) REFERENCES tipos(id)
);

CREATE INDEX idx_pokemons_user   ON pokemons(user_id);
CREATE INDEX idx_pokemons_tipo   ON pokemons(tipo_id);
CREATE INDEX idx_pokemons_nombre ON pokemons(nombre);