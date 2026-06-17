import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ email: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Crear cuenta</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />
          <input style={styles.input} name="username" placeholder="Nombre de usuario"
            value={form.username} onChange={handleChange} required />
          <input style={styles.input} name="password" type="password"
            placeholder="Contraseña" value={form.password}
            onChange={handleChange} required />
          <button style={styles.button} type="submit">Registrarse</button>
        </form>
        <p style={styles.link}>
          ¿Ya tienes cuenta?{' '}
          <span onClick={() => navigate('/login')} style={styles.span}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f0f0' },
  card:      { background: '#fff', padding: '2rem', borderRadius: '12px', width: '360px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  title:     { textAlign: 'center', marginBottom: '1.5rem', color: '#e63946' },
  input:     { width: '100%', padding: '0.75rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button:    { width: '100%', padding: '0.75rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  error:     { color: 'red', marginBottom: '1rem', textAlign: 'center' },
  link:      { textAlign: 'center', marginTop: '1rem' },
  span:      { color: '#e63946', cursor: 'pointer', fontWeight: 'bold' },
};