import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login    from '../../client/src/pages/login'; // 
import Register from '../../client/src/pages/register';
import Pokedex  from '../../client/src/pages/pokedex';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <PrivateRoute>
            <Pokedex />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}