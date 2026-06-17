import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import PokemonCard from '../components/PokemonCard';

export default function Pokedex() {
  const [pokemons, setPokemons]         = useState([]);
  const [tipos, setTipos]               = useState([]);
  const [filtroNombre, setFiltroNombre] = useState('');
  const [filtroTipo, setFiltroTipo]     = useState('');
  const [error, setError]               = useState('');
  const [form, setForm]                 = useState({
    nombre: '', numero_pokedex: '', tipo_id: '', tipo2_id: '',
    nivel: 1, ps: 45, ataque: 45, defensa: 45, velocidad: 45,
    imagen_url: '', descripcion: '', es_shiny: false,
    es_favorito: false, notas: '',
  });
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const navigate                = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const cargarPokemons = async () => {
    try {
      const params = {};
      if (filtroNombre) params.nombre  = filtroNombre;
      if (filtroTipo)   params.tipo_id = filtroTipo;
      const { data } = await api.get('/pokemons', { params });
      setPokemons(data);
    } catch {
      navigate('/login');
    }
  };

  const cargarTipos = async () => {
    const { data } = await api.get('/tipos');
    setTipos(data);
  };

  useEffect(() => { cargarTipos(); }, []);
  useEffect(() => { cargarPokemons(); }, [filtroNombre, filtroTipo]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const traducirTipo = (tipo) => {
    const map = {
      fire: 'fuego', water: 'agua', grass: 'planta', electric: 'eléctrico',
      ice: 'hielo', fighting: 'lucha', poison: 'veneno', ground: 'tierra',
      flying: 'volador', psychic: 'psíquico', bug: 'bicho', rock: 'roca',
      ghost: 'fantasma', dragon: 'dragón', dark: 'siniestro', steel: 'acero',
      fairy: 'hada', normal: 'normal',
    };
    return map[tipo] || tipo;
  };

  const buscarEnPokeAPI = async () => {
    if (!form.nombre || form.nombre.length < 2) return;
    setBuscando(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${form.nombre.toLowerCase()}`);
      if (!res.ok) {
        setError('Pokémon no encontrado en PokeAPI');
        return;
      }
      const data = await res.json();

      const tipo1Nombre = data.types[0]?.type?.name;
      const tipo2Nombre = data.types[1]?.type?.name;

      const tipo1 = tipos.find(t => t.nombre.toLowerCase() === traducirTipo(tipo1Nombre));
      const tipo2 = tipos.find(t => t.nombre.toLowerCase() === traducirTipo(tipo2Nombre));

      setForm(prev => ({
        ...prev,
        imagen_url:     data.sprites?.other?.['official-artwork']?.front_default || prev.imagen_url,
        numero_pokedex: data.id || prev.numero_pokedex,
        tipo_id:        tipo1?.id || prev.tipo_id,
        tipo2_id:       tipo2?.id || prev.tipo2_id,
        ps:             data.stats[0]?.base_stat || prev.ps,
        ataque:         data.stats[1]?.base_stat || prev.ataque,
        defensa:        data.stats[2]?.base_stat || prev.defensa,
        velocidad:      data.stats[5]?.base_stat || prev.velocidad,
      }));
      setError('');
    } catch {
      setError('Error al consultar PokeAPI');
    } finally {
      setBuscando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await api.put(`/pokemons/${editId}`, form);
      } else {
        await api.post('/pokemons', form);
      }
      setForm({
        nombre: '', numero_pokedex: '', tipo_id: '', tipo2_id: '',
        nivel: 1, ps: 45, ataque: 45, defensa: 45, velocidad: 45,
        imagen_url: '', descripcion: '', es_shiny: false,
        es_favorito: false, notas: '',
      });
      setEditId(null);
      setShowForm(false);
      cargarPokemons();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    }
  };

  const handleEdit = (p) => {
    setForm({
      nombre: p.nombre, numero_pokedex: p.numero_pokedex || '',
      tipo_id: p.tipo_id || '', tipo2_id: p.tipo2_id || '',
      nivel: p.nivel, ps: p.ps, ataque: p.ataque,
      defensa: p.defensa, velocidad: p.velocidad,
      imagen_url: p.imagen_url || '', descripcion: p.descripcion || '',
      es_shiny: p.es_shiny, es_favorito: p.es_favorito || false,
      notas: p.notas || '',
    });
    setEditId(p.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este Pokémon?')) return;
    await api.delete(`/pokemons/${id}`);
    cargarPokemons();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Pokédex</h1>
        <div style={styles.headerRight}>
          <span style={styles.username}>{user.username}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Cerrar sesión</button>
        </div>
      </div>

      <div style={styles.filtros}>
        <input style={styles.inputFiltro} placeholder="Buscar por nombre..."
          value={filtroNombre} onChange={(e) => setFiltroNombre(e.target.value)} />
        <select style={styles.inputFiltro} value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="">Todos los tipos</option>
          {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
        </select>
        <button style={styles.addBtn} onClick={() => { setShowForm(!showForm); setEditId(null); }}>
          {showForm ? 'Cancelar' : '+ Agregar Pokémon'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h3>{editId ? 'Editar Pokémon' : 'Nuevo Pokémon'}</h3>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input style={{...styles.input, flex: 1}} name="nombre" placeholder="Nombre *"
                  value={form.nombre} onChange={handleChange} required />
                <button type="button" style={styles.pokeApiBtn}
                  onClick={buscarEnPokeAPI} disabled={buscando}>
                  {buscando ? '...' : '🔍'}
                </button>
              </div>
              <input style={styles.input} name="numero_pokedex" placeholder="Nº Pokédex"
                type="number" value={form.numero_pokedex} onChange={handleChange} />
              <select style={styles.input} name="tipo_id" value={form.tipo_id} onChange={handleChange}>
                <option value="">Tipo principal</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
              <select style={styles.input} name="tipo2_id" value={form.tipo2_id} onChange={handleChange}>
                <option value="">Tipo secundario</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
              </select>
              <input style={styles.input} name="nivel" placeholder="Nivel (1-100)"
                type="number" min="1" max="100" value={form.nivel} onChange={handleChange} />
              <input style={styles.input} name="ps" placeholder="PS"
                type="number" value={form.ps} onChange={handleChange} />
              <input style={styles.input} name="ataque" placeholder="Ataque"
                type="number" value={form.ataque} onChange={handleChange} />
              <input style={styles.input} name="defensa" placeholder="Defensa"
                type="number" value={form.defensa} onChange={handleChange} />
              <input style={styles.input} name="velocidad" placeholder="Velocidad"
                type="number" value={form.velocidad} onChange={handleChange} />
              <input style={styles.input} name="imagen_url" placeholder="URL imagen"
                value={form.imagen_url} onChange={handleChange} />
            </div>
            <textarea style={{...styles.input, width: '100%'}} name="descripcion"
              placeholder="Descripción" value={form.descripcion} onChange={handleChange} />
            <textarea style={{...styles.input, width: '100%', marginTop: '0.5rem'}} name="notas"
              placeholder="Notas personales" value={form.notas} onChange={handleChange} />
            <label style={styles.checkbox}>
              <input type="checkbox" name="es_shiny" checked={form.es_shiny}
                onChange={handleChange} /> ¿Es shiny? ✨
            </label>
            <label style={styles.checkbox}>
              <input type="checkbox" name="es_favorito" checked={form.es_favorito}
                onChange={handleChange} /> ¿Es favorito? ⭐
            </label>
            <button style={styles.addBtn} type="submit">
              {editId ? 'Guardar cambios' : 'Agregar'}
            </button>
          </form>
        </div>
      )}

      <div style={styles.grid}>
        {pokemons.length === 0
          ? <p style={styles.empty}>No hay Pokémon en tu colección aún.</p>
          : pokemons.map(p => (
              <PokemonCard key={p.id} pokemon={p}
                onEdit={handleEdit} onDelete={handleDelete} />
            ))
        }
      </div>
    </div>
  );
}

const styles = {
  container:   { maxWidth: '1200px', margin: '0 auto', padding: '1rem' },
  header:      { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  headerRight: { display: 'flex', alignItems: 'center', gap: '1rem' },
  title:       { color: '#e63946', margin: 0 },
  username:    { fontWeight: 'bold' },
  logoutBtn:   { padding: '0.5rem 1rem', background: '#333', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  filtros:     { display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  inputFiltro: { padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', flex: 1 },
  addBtn:      { padding: '0.6rem 1.2rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  pokeApiBtn:  { padding: '0.6rem', background: '#457b9d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  formCard:    { background: '#fff', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  formGrid:    { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' },
  input:       { padding: '0.6rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  checkbox:    { display: 'block', marginBottom: '0.75rem', cursor: 'pointer' },
  error:       { color: 'red', marginBottom: '1rem' },
  grid:        { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' },
  empty:       { textAlign: 'center', color: '#999', gridColumn: '1/-1' },
};