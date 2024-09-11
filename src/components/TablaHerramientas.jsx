import React, { useState } from "react";

const TablaHerramientas = ({ accordionStates, toggleAccordion }) => {
    const [formErrors, setFormErrors] = useState({});
    const [herramientas, setherramientas] = useState([
      {
        nombreHerramienta: "",
        descripcion: "",
        unidadMedida: "",
        cantidadSolicitar: "",
        observaciones: "",
      },
    ]);
  
    const handleInputChange = (index, event) => {
      const { name, value } = event.target;
      const newherramientas = [...herramientas];
      newherramientas[index][name] = value;
      setherramientas(newherramientas);
    };
  
    const addRow = () => {
      setherramientas([
        ...herramientas,
        {
          nombreHerramienta: "",
          descripcion: "",
          unidadMedida: "",
          cantidadSolicitar: "",
          observaciones: "",
        },
      ]);
    };
  
    return (
      <div>
        {accordionStates.herramientas && (
          <div className="flex flex-col rounded-lg w-auto">
            <div className="overflow-x-auto">
              <table className="min-w-full border border-black text-xs">
                <thead>
                  <tr>
                    <th className="border border-black px-2">ITEM</th>
                    <th className="border border-black px-2">NOMBRE DE LAS HERRAMIENTAS</th>
                    <th className="border border-black px-2">DESCRIPCIÓN</th>
                    <th className="border border-black px-2">CANTIDAD A SOLICITAR</th>
                    <th className="border border-black px-2">OBSERVACIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {herramientas.map((producto, index) => (
                    <tr key={index}>
                      <td className="border border-black px-4 py-2">
                        {index + 1}
                      </td>
                      <td className="border border-black px-4 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 rounded"
                          name="nombreHerramienta"
                          value={producto.nombreHerramienta}
                          onChange={(event) => handleInputChange(index, event)}
                        />
                      </td>
                      <td className="border border-black px-4 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 rounded"
                          name="descripcion"
                          value={producto.descripcion}
                          onChange={(event) => handleInputChange(index, event)}
                        />
                      </td>
                      <td className="border border-black px-4 py-2">
                        <input
                          type="number"
                          className="w-full px-2 py-1 rounded"
                          name="cantidadSolicitar"
                          value={producto.cantidadSolicitar}
                          onChange={(event) => handleInputChange(index, event)}
                        />
                      </td>
                      <td className="border border-black px-4 py-2">
                        <input
                          type="text"
                          className="w-full px-2 py-1 rounded"
                          name="observaciones"
                          value={producto.observaciones}
                          onChange={(event) => handleInputChange(index, event)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
  
            <div className="flex justify-between mt-4">
              <button className="btn-black2" onClick={addRow}>
                Agregar item
              </button>
              <button className="btn-black2 mb-4" onClick={() => handleCreate("herramientas")}>
                Guardar y continuar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

export default TablaHerramientas
