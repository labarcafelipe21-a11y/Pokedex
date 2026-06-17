import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail]   = useState('');
  const [token, setToken]   = useState('');
  const [error, setError]   = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate            = useNavigate();

  const handleSolicitar = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setToken(data.token);
      setMensaje('Token generado. Cópialo y úsalo abajo para resetear tu contraseña.');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al solicitar reset');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Recuperar contraseña</h2>
        {error   && <p style={styles.error}>{error}</p>}
        {mensaje && <p style={styles.success}>{mensaje}</p>}
        {token   && (
          <div style={styles.tokenBox}>
            <p style={{ margin: 0, fontSize: '0.8rem', wordBreak: 'break-all' }}>
              🔑 Token: <strong>{token}</strong>
            </p>
          </div>
        )}
        <form onSubmit={handleSolicitar}>
          <input style={styles.input} type="email" placeholder="Tu email"
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button style={styles.button} type="submit">Solicitar token</button>
        </form>
        <button style={styles.linkBtn} onClick={() => navigate('/reset-password')}>
          ¿Ya tienes un token? Resetea tu contraseña
        </button>
        <button style={styles.linkBtn} onClick={() => navigate('/login')}>
          Volver al login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' },
  card:      { background: '#fff', padding: '2rem', borderRadius: '12px', width: '400px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title:     { textAlign: 'center', marginBottom: '1.5rem', color: '#e63946' },
  input:     { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button:    { width: '100%', padding: '0.75rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' },
  linkBtn:   { width: '100%', padding: '0.5rem', background: 'none', border: 'none', color: '#e63946', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.5rem' },
  error:     { color: 'red', marginBottom: '1rem', textAlign: 'center' },
  success:   { color: 'green', marginBottom: '1rem', textAlign: 'center' },
  tokenBox:  { background: '#f8f9fa', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #ddd' },
};