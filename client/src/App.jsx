import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login          from './pages/login';
import Register       from './pages/register';
import Pokedex        from './pages/pokedex';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"           element={<Login />} />
        <Route path="/register"        element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/" element={
          <PrivateRoute>
            <Pokedex />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}