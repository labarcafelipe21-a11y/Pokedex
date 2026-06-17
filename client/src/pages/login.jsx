import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Pokédex</h2>
        {error && <p style={styles.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="email" placeholder="Email"
            value={form.email} onChange={handleChange} required />
          <input style={styles.input} name="password" type="password"
            placeholder="Contraseña" value={form.password}
            onChange={handleChange} required />
          <button style={styles.button} type="submit">Entrar</button>
        </form>
        <p style={styles.link}>
          <span onClick={() => navigate('/forgot-password')} style={styles.span}>
            ¿Olvidaste tu contraseña?
          </span>
        </p>
        <p style={styles.link}>
          ¿No tienes cuenta?{' '}
          <span onClick={() => navigate('/register')} style={styles.span}>
            Regístrate
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
  button:    { width: '100%', padding: '0.75rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '0.5rem' },
  error:     { color: 'red', marginBottom: '1rem', textAlign: 'center' },
  link:      { textAlign: 'center', marginTop: '0.5rem' },
  span:      { color: '#e63946', cursor: 'pointer', fontWeight: 'bold' },
};