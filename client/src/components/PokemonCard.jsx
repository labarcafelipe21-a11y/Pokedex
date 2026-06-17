export default function PokemonCard({ pokemon, onEdit, onDelete }) {
  return (
    <div style={{
      ...styles.card,
      background: pokemon.es_shiny == 1 ? '#fff3cd' : '#fff',
      border: pokemon.es_favorito == 1
        ? '2px solid #f4c430'
        : pokemon.es_shiny == 1
        ? '2px solid #ffc107'
        : '1px solid #ddd',
    }}>
      {pokemon.es_favorito == 1 && <div style={styles.favBadge}>⭐ Favorito</div>}

      {pokemon.imagen_url
        ? <img src={pokemon.imagen_url} alt={pokemon.nombre} style={styles.img} />
        : <div style={styles.noImg}>🎮</div>
      }

      <h3 style={styles.nombre}>
        {pokemon.nombre} {pokemon.es_shiny == 1 ? '✨' : ''}
      </h3>

      {pokemon.numero_pokedex
        ? <p style={styles.numero}>#{pokemon.numero_pokedex}</p>
        : null
      }

      <div style={styles.tipos}>
        {pokemon.tipo  && <span style={styles.tipo}>{pokemon.tipo}</span>}
        {pokemon.tipo2 && <span style={styles.tipo}>{pokemon.tipo2}</span>}
      </div>

      <div style={styles.stats}>
        <span>Nv.{pokemon.nivel}</span>
        <span>PS {pokemon.ps}</span>
        <span>Atq {pokemon.ataque}</span>
        <span>Def {pokemon.defensa}</span>
      </div>

      {pokemon.notas && (
        <p style={styles.notas}>📝 {pokemon.notas}</p>
      )}

      <div style={styles.actions}>
        <button style={styles.editBtn} onClick={() => onEdit(pokemon)}>Editar</button>
        <button style={styles.deleteBtn} onClick={() => onDelete(pokemon.id)}>Eliminar</button>
      </div>
    </div>
  );
}

const styles = {
  card:      { borderRadius: '12px', padding: '1rem', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.08)', position: 'relative' },
  favBadge:  { position: 'absolute', top: '8px', left: '8px', background: '#f4c430', padding: '0.2rem 0.5rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' },
  img:       { width: '100px', height: '100px', objectFit: 'contain' },
  noImg:     { fontSize: '3rem', marginBottom: '0.5rem' },
  nombre:    { margin: '0.5rem 0 0', color: '#333' },
  numero:    { color: '#999', margin: '0.25rem 0' },
  tipos:     { display: 'flex', justifyContent: 'center', gap: '0.5rem', margin: '0.5rem 0' },
  tipo:      { background: '#e63946', color: '#fff', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem' },
  stats:     { display: 'flex', justifyContent: 'space-around', margin: '0.5rem 0', fontSize: '0.8rem', color: '#666' },
  notas:     { fontSize: '0.8rem', color: '#555', fontStyle: 'italic', margin: '0.5rem 0', textAlign: 'left' },
  actions:   { display: 'flex', gap: '0.5rem', marginTop: '0.75rem' },
  editBtn:   { flex: 1, padding: '0.4rem', background: '#457b9d', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  deleteBtn: { flex: 1, padding: '0.4rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' },
};