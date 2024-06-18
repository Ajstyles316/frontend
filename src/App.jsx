import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Informe from './Componentes/Informe';
import Tratamientos from './Componentes/Tratamientos';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <Link className="navbar-brand" to="/">Home</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/informe">Informe</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/tratamientos">Tratamientos</Link>
              </li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/informe" element={<Informe />} />
          <Route path="/tratamientos" element={<Tratamientos />} />
        </Routes>
      </div>
    </Router>
  );
};

const Home = () => (
  <div>
    <h2>Bienvenido a la aplicación de gestión médica</h2>
    <p>Seleccione una opción en la barra de navegación.</p>
  </div>
);

export default App;
