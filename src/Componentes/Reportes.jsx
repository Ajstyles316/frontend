import { useState } from 'react';
import pacienteData from './paciente.json';
import './Reportes.css'; 
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReporteMedico = () => {
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState('');
  const [enfermedadSeleccionada, setEnfermedadSeleccionada] = useState('');
  const [datosTabla, setDatosTabla] = useState([]);
  const pacientes = pacienteData.pacientes;

  const handlePacienteChange = (event) => {
    setPacienteSeleccionado(event.target.value);
    setEnfermedadSeleccionada('');
    setDatosTabla([]);
  };

  const handleEnfermedadChange = (event) => {
    setEnfermedadSeleccionada(event.target.value);
  };

  const handleButtonClick = () => {
    const paciente = pacientes.find(
      (paciente) => paciente.nombre === pacienteSeleccionado
    );

    if (paciente) {
      const enfermedad = paciente.historialMedico.find(
        (enfermedad) => enfermedad.enfermedad === enfermedadSeleccionada
      );

      if (enfermedad) {
        setDatosTabla([enfermedad]);
      } else {
        setDatosTabla([]);
      }
    }
  };

  const handleDownloadClick = () => {
    const doc = new jsPDF();

    doc.text('Reporte Médico', 14, 16);
    doc.setFontSize(12);
    if (pacienteSeleccionado && datosTabla.length > 0) {
      const paciente = pacientes.find(
        (paciente) => paciente.nombre === pacienteSeleccionado
      );

      doc.text(`Nombre: ${paciente.nombre}`, 14, 24);
      doc.text(`Edad: ${paciente.edad}`, 14, 30);
      doc.text(`Género: ${paciente.genero}`, 14, 36);
      doc.text(`Enfermedad: ${enfermedadSeleccionada}`, 14, 42);
      doc.text('Fecha de Diagnóstico:', 14, 48);
      doc.text(datosTabla[0].fechaDiagnostico, 70, 48);

      const recetas = datosTabla[0].recetas.map((receta) => [receta]);
      const medicamentos = datosTabla[0].medicamentos.map((medicamento) => [medicamento]);

      doc.autoTable({
        startY: 56,
        head: [['Recetas']],
        body: recetas,
      });

      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Medicamentos']],
        body: medicamentos,
      });

      doc.text('Descripción:', 14, doc.lastAutoTable.finalY + 20);
      doc.text(datosTabla[0].descripcion, 14, doc.lastAutoTable.finalY + 26, {
        maxWidth: 180,
      });
    } else {
      doc.text('No hay datos disponibles.', 14, 24);
    }

    doc.save('reporte_medico.pdf');
  };

  const paciente = pacientes.find(
    (paciente) => paciente.nombre === pacienteSeleccionado
  );

  return (
    <div className="reporte-medico-form">
      <h2>Reporte Médico</h2>
      <div className="select-container">
        <select
          className="select"
          value={pacienteSeleccionado}
          onChange={handlePacienteChange}
        >
          <option value="">Seleccionar paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente.nombre} value={paciente.nombre}>
              {paciente.nombre}
            </option>
          ))}
        </select>
      </div>
      {paciente && (
        <>
          <p>Edad: {paciente.edad}</p>
          <p>Género: {paciente.genero}</p>
          <div className="select-container">
            <select
              className="select"
              value={enfermedadSeleccionada}
              onChange={handleEnfermedadChange}
            >
              <option value="">Seleccionar enfermedad</option>
              {paciente.historialMedico.map((enfermedad) => (
                <option key={enfermedad.enfermedad} value={enfermedad.enfermedad}>
                  {enfermedad.enfermedad}
                </option>
              ))}
            </select>
          </div>
        </>
      )}
      <div className="button-container">
        <button className="button" onClick={handleButtonClick}>
          Ver Reporte
        </button>
        <button className="button download-button" onClick={handleDownloadClick}>
          Descargar Reporte
        </button>
      </div>
      {datosTabla.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Receta</th>
              <th>Medicamento</th>
              <th>Descripción</th>
              <th>Fecha de Diagnóstico</th>
            </tr>
          </thead>
          <tbody>
            {datosTabla[0].recetas.map((receta, index) => (
              <tr key={`receta-${index}`}>
                <td className="table-cell">{receta}</td>
                <td className="table-cell">{datosTabla[0].medicamentos[index] || ''}</td>
                {index === 0 && (
                  <>
                    <td className="table-cell" rowSpan={datosTabla[0].recetas.length}>
                      {datosTabla[0].descripcion}
                    </td>
                    <td className="table-cell" rowSpan={datosTabla[0].recetas.length}>
                      {datosTabla[0].fechaDiagnostico}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ReporteMedico;