import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const [form, setForm]       = useState({ token: '', password: '', confirm: '' });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');
  const navigate              = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm)
      return setError('Las contraseñas no coinciden');
    try {
      await api.post('/auth/reset-password', {
        token: form.token,
        password: form.password,
      });
      setSuccess('Contraseña actualizada. Redirigiendo...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al resetear');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Nueva contraseña</h2>
        {error   && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit}>
          <input style={styles.input} name="token" placeholder="Token de recuperación"
            value={form.token} onChange={handleChange} required />
          <input style={styles.input} name="password" type="password"
            placeholder="Nueva contraseña" value={form.password}
            onChange={handleChange} required />
          <input style={styles.input} name="confirm" type="password"
            placeholder="Confirmar contraseña" value={form.confirm}
            onChange={handleChange} required />
          <button style={styles.button} type="submit">Cambiar contraseña</button>
        </form>
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
  button:    { width: '100%', padding: '0.75rem', background: '#e63946', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  linkBtn:   { width: '100%', padding: '0.5rem', background: 'none', border: 'none', color: '#e63946', cursor: 'pointer', textDecoration: 'underline', marginTop: '0.5rem' },
  error:     { color: 'red', marginBottom: '1rem', textAlign: 'center' },
  success:   { color: 'green', marginBottom: '1rem', textAlign: 'center' },
};