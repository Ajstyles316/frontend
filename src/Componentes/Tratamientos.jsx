import { useState } from 'react';

import enfermedadesData from './enfermedades.json';


const Tratamientos = () => {
  const [enfermedadSeleccionada, setEnfermedadSeleccionada] = useState('');
  const [datosTabla, setDatosTabla] = useState([]);
  const enfermedades = enfermedadesData.enfermedades;

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
          className="select"
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
      <button className="button" onClick={handleButtonClick}>
        Tratamiento
      </button>
      {datosTabla.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Receta</th>
              <th>Medicamento</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {datosTabla[0].recetas.map((receta, index) => (
              <tr key={`receta-${index}`}>
                <td className="table-cell">{receta}</td>
                <td className="table-cell">{datosTabla[0].medicamentos[index] || ''}</td>
                {index === 0 && (
                  <td className="table-cell" rowSpan={datosTabla[0].recetas.length}>
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