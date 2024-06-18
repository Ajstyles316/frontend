import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const Tratamientos = () => {
  const [enfermedadSeleccionada, setEnfermedadSeleccionada] = useState('');
  const [datosTabla, setDatosTabla] = useState([]);
  const [enfermedades, setEnfermedades] = useState([]);

  useEffect(() => {
    fetchEnfermedades();
  }, []);

  const fetchEnfermedades = async () => {
    try {
      const response = await axios.get('http://localhost:5000/get_enfermedades');
      setEnfermedades(response.data);
    } catch (error) {
      console.error('Error fetching enfermedades:', error);
    }
  };

  const handleSelectChange = (event) => {
    setEnfermedadSeleccionada(event.target.value);
  };

  const handleButtonClick = () => {
    const enfermedad = enfermedades.find(
      (enfermedad) => enfermedad.nombre === enfermedadSeleccionada
    );

    if (enfermedad) {
      setDatosTabla([enfermedad]);
    } else {
      setDatosTabla([]);
    }
  };
  
  return (
    <div className="enfermedad-form">
      <h2>Selección de enfermedad</h2>
      <div className="select-container">
        <select
          className="form-select"
          value={enfermedadSeleccionada}
          onChange={handleSelectChange}
        >
          <option value="">Seleccionar enfermedad</option>
          {enfermedades.map((enfermedad) => (
            <option key={enfermedad.nombre} value={enfermedad.nombre}>
              {enfermedad.nombre}
            </option>
          ))}
        </select>
      </div>
      <button className="btn btn-primary mt-3" onClick={handleButtonClick}>
        Tratamiento
      </button>
      {datosTabla.length > 0 && (
        <table className="table mt-3">
          <thead>
            <tr>
              <th>Receta</th>
              <th>Medicamento</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {datosTabla[0].tratamientos.map((tratamiento, index) => (
              <tr key={`tratamiento-${index}`}>
                <td className="table-cell">{tratamiento.receta}</td>
                <td className="table-cell">{tratamiento.medicamento}</td>
                {index === 0 && (
                  <td className="table-cell" rowSpan={datosTabla[0].tratamientos.length}>
                    {datosTabla[0].descripcion}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tratamientos;
